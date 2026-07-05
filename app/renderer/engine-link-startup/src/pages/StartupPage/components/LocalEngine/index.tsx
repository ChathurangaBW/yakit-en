import { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react'
import { AllowSecretLocalJson, LocalEngineProps } from './LocalEngineType'
import { useMemoizedFn } from 'ahooks'
import { debugToPrintLog } from '@/utils/logCollection'
import {
  grpcCheckAllowSecretLocal,
  grpcFetchBuildInYakVersion,
  grpcFetchLatestYakitVersion,
  grpcFetchLocalYakitVersion,
  grpcFetchLocalYakVersion,
  grpcFetchLocalYakVersionHash,
  grpcFetchSpecifiedYakVersionHash,
} from '../../grpc'
import { FetchSoftwareVersion, getReleaseEditionName, isCommunityYakit, isEnpriTraceAgent } from '@/utils/envfile'
import { yakitNotify } from '@/utils/notification'
import { SystemInfo } from '../../utils'
import { getLocalValue } from '@/utils/kv'
import { LocalGVS } from '@/enums/yakitGV'
import { UpdateYakitHint } from '../UpdateYakitHint'
import { yakitEngine } from '@/utils/electronBridge'

function compare(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

export const LocalEngine: React.FC<LocalEngineProps> = memo(
  forwardRef((props, ref) => {
    const {
      setLog,
      onLinkEngine,
      yakitStatus,
      setYakitStatus,
      buildInEngineVersion,
      setRestartLoading,
      yakitUpdate,
      setYakitUpdate,
    } = props
    // check Json
    const allowSecretLocalJson = useRef<AllowSecretLocalJson>(null)
    // 本地 yakit 版本
    const currentYakit = useRef<string>('')
    // 最新 yakit 版本
    const latestYakit = useRef<string>('')
    // 内置引擎版本
    const buildInYak = useRef<string>('')
    // 本地引擎版本
    const currentYak = useRef<string>('')

    const yakitStatusRef = useRef(yakitStatus)
    useEffect(() => {
      yakitStatusRef.current = yakitStatus
    }, [yakitStatus])

    const latestCheckCallIdRef = useRef(0)
    const handleAllowSecretLocal = useMemoizedFn(async (port: number, checkVersion: boolean) => {
      const callId = ++latestCheckCallIdRef.current
      // Interrupt Connection 后续不执行
      if (yakitStatusRef.current === 'break') {
        debugToPrintLog(`------ Start check blocked ------`)
        setLog([])
        return
      }

      debugToPrintLog(`------ Starting check ------`)
      setLog(['Checking random-password mode...'])
      try {
        const res = await grpcCheckAllowSecretLocal({ port, softwareVersion: FetchSoftwareVersion() })
        setRestartLoading(false)
        if (res.ok && res.status === 'success') {
          setLog((arr) => arr.concat(['Check passed. Random-password mode is supported']))
          setYakitStatus('')
          allowSecretLocalJson.current = res.json
          handlePreCheckForLinkEngine(checkVersion)
          return
        }
        allowSecretLocalJson.current = null
        switch (res.status) {
          case 'timeout':
            setLog((arr) => arr.concat(['Command timed out. Check logs for details...']))
            setYakitStatus('check_timeout')
            break
          case 'call_error':
            setLog((arr) => arr.concat(['Engine connection timed out. Check logs for details...']))
            setYakitStatus('check_timeout')
            break
          case 'old_version':
            setLog((arr) =>
              arr.concat([
                `Engine version is too low. Click ${buildInEngineVersion ? 'Reset Engine version update...' : 'Download Engine update...'}`,
              ]),
            )
            setYakitStatus('old_version')
            break
          case 'port_occupied':
            setLog((arr) => arr.concat(['Port is unavailable. Check log errors for details...']))
            setYakitStatus('port_occupied_prev')
            break
          case 'antivirus_blocked':
            setLog((arr) => arr.concat(['Blocked by security software. Add the app to the allowlist and restart...']))
            setYakitStatus('antivirus_blocked')
            break
          case 'build_yak_error':
          case 'dial_error':
            setLog((arr) => arr.concat(['Engine connection problem. Click Reset Engine version update...']))
            setYakitStatus('skipAgreement_Install')
            break
          case 'database_error':
            setLog((arr) => arr.concat(['Local database error detected. Click Repair to fix it...']))
            setYakitStatus('database_error')
            break
          default:
            setLog((arr) =>
              arr.concat([
                'Unable to start. Send logs to support for help...',
                `[Reason]：${res.status}：${res.message || 'None'}`,
              ]),
            )
            setYakitStatus('allow-secret-error')
        }
      } catch (error) {
        // 旧调用直接跳过
        if (callId !== latestCheckCallIdRef.current) return
      }
    })

    /**
     * @name 初始化启动-Connect引擎的前置版本检查
     * - 引擎Connect断开或Download其他版本引擎，不检查版本，直接Connect引擎
     * - 开发环境直接Connect引擎，不检查版本
     * - 先进行 yakit 检查，在进行引擎检查
     * - 最后软件基础设置（目前只有Yakit支持）
     */
    const handlePreCheckForLinkEngine = useMemoizedFn((checkVersion: boolean) => {
      // Interrupt Connection 后续不执行
      if (yakitStatusRef.current === 'break') {
        debugToPrintLog(`------ Pre-connection version check blocked ------`)
        setLog([])
        return
      }

      debugToPrintLog(`------ Running startup pre-connection version check ------`)
      if (SystemInfo.isDev) {
        setLog(['Development environment. Connecting to engine directly'])
        startYakEngine()
      } else if (checkVersion) {
        // SE 版本不进行 yakit 更新检查，直接检查引擎和内置的版本
        if (isEnpriTraceAgent()) {
          handleCheckEngineVersion()
        } else {
          setLog(['Checking for app updates...'])
          handleCheckYakitLatestVersion()
        }
      } else {
        startYakEngine()
      }
    })

    /**
     * @name 检查yakit是否有版本更新
     * - 未开启 yakit 更新检查，不进行 yakit 更新检查，直接检查引擎和内置的版本
     */
    const handleCheckYakitLatestVersion = useMemoizedFn(() => {
      // Interrupt Connection 后续不执行
      if (yakitStatusRef.current === 'break') {
        debugToPrintLog(`------ Yakit version update check blocked ------`)
        setLog([])
        return
      }

      let showUpdateYakit = false
      getLocalValue(LocalGVS.NoAutobootLatestVersionCheck)
        .then(async (val: boolean) => {
          if (!val) {
            debugToPrintLog(`------ Starting app version update check ------`)
            try {
              const promise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Check engine source request timed out')), 3100),
              )
              const [res1, res2] = await Promise.allSettled([
                grpcFetchLocalYakitVersion(true),
                Promise.race([grpcFetchLatestYakitVersion({ timeout: 3000 }, true), promise]),
              ])
              if (res1.status === 'fulfilled') {
                currentYakit.current = res1.value || ''
                debugToPrintLog(`------ Current app version: ${currentYakit.current} ------`)
              }
              if (res2.status === 'fulfilled') {
                let latest = (res2.value || '') as string
                latestYakit.current = latest.startsWith('v') ? latest.substring(1) : latest
                debugToPrintLog(`------ Latest app version: ${latestYakit.current} ------`)
              }
              // 只要与线上的不一样就算需要更新，不需要进行版本号比较
              showUpdateYakit =
                !!currentYakit.current && !!latestYakit.current && currentYakit.current !== latestYakit.current
            } catch (error) {}
          } else {
            debugToPrintLog(`------ Skipping app version update check ------`)
            setLog((old) => old.concat(['Skipped check. You can enable it in app update settings']))
          }
        })
        .catch(() => {})
        .finally(() => {
          if (showUpdateYakit) {
            setLog([`New version detected for ${getReleaseEditionName()}，. Install now...`])
            setYakitStatus('update_yakit')
          } else {
            setLog((old) => old.concat(['App is up to date']))
            setTimeout(() => {
              handleCheckEngineVersion()
            }, 500)
          }
        })
    })

    /**
     * @name 检查引擎本地版本和Built-in version
     * - Ignore yak 更新检查，不进行 yak 更新检查，直接检查引擎来源
     * - NoneBuilt-in version则直接Connect引擎
     * - 内置比本地版本高提示是否更新
     */

    const handleCheckEngineVersion = useMemoizedFn(async () => {
      // Interrupt Connection 后续不执行
      if (yakitStatusRef.current === 'break') {
        debugToPrintLog(`------ Local and built-in engine version check blocked ------`)
        setLog([])
        return
      }

      try {
        const res = await getLocalValue(LocalGVS.NoYakVersionCheck)
        if (res) {
          setLog(['Getting engine version...'])
        } else {
          debugToPrintLog(`------ Starting built-in engine version check ------`)
          setLog(['Getting engine version and checking for updates...'])
        }
        const localVersion = allowSecretLocalJson.current.version
        const localVersionPromise = localVersion ? Promise.resolve(localVersion) : grpcFetchLocalYakVersion(true)
        const buildInVersionPromise = grpcFetchBuildInYakVersion(true)
        const [res1, res2] = await Promise.allSettled([localVersionPromise, buildInVersionPromise])
        if (!res && res2.status === 'fulfilled') {
          let buildIn = res2.value || ''
          buildInYak.current = buildIn.startsWith('v') ? buildIn.substring(1) : buildIn
          debugToPrintLog(`------ Built-in version: ${buildInYak.current} ------`)
        }

        if (res1.status === 'fulfilled') {
          currentYak.current = (res1.value as string) || ''
          debugToPrintLog(`------ Current version: ${currentYak.current} ------`)

          setLog((old) =>
            old.concat([
              currentYak.current ? `Local engine version: ${currentYak.current}` : 'Could not get local engine version',
            ]),
          )

          if (!currentYak.current) {
            softwareBasics()
            return
          }

          if (res) {
            handleCheckEngineSource(currentYak.current)
          } else {
            if (!!currentYak.current && !!buildInYak.current && compare(buildInYak.current, currentYak.current) > 0) {
              setLog(['Engine version detected. Install now...'])
              setYakitStatus('update_yak')
            } else {
              setLog((old) => old.concat(['Engine is up to date']))
              handleCheckEngineSource(currentYak.current)
            }
          }
        } else {
          setLog((old) => old.concat([`Error: ${res1.reason}`]))
          softwareBasics()
        }
      } catch (error) {
        setLog((old) => old.concat([`Error: ${error}`]))
        setYakitStatus('check_yak_version_error')
      }
    })

    /**
     * @name 校验引擎是否来源正确
     * - 通过相同版本的线上hash和本地hash对比，判断是否一样
     */
    const handleCheckEngineSource = useMemoizedFn(async (version?: string) => {
      // Interrupt Connection 后续不执行
      if (yakitStatusRef.current === 'break') {
        debugToPrintLog(`------ Engine source validation blocked ------`)
        setLog([])
        return
      }

      debugToPrintLog(`------ Starting engine source validation ------`)
      setLog(['Validating engine source...'])
      const checkVersion = version || currentYak.current
      try {
        const promise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Fetch engine online hash request timed out')), 2100),
        )
        const [res1, res2] = await Promise.all([
          // 远端
          Promise.race([
            grpcFetchSpecifiedYakVersionHash({ version: checkVersion, config: { timeout: 2000 } }, true),
            promise,
          ]),
          // 本地
          grpcFetchLocalYakVersionHash(true),
        ])

        if (!res1 || !Array.isArray(res2) || res2.length === 0) {
          setLog((old) => old.concat(['Unknown error. Unable to validate source']))
        } else {
          if (res2.includes(res1 as string)) {
            setLog((old) => old.concat(['Engine source is valid']))
          } else {
            setLog((old) => old.concat(['Engine source is unofficial']))
            yakitNotify('info', 'Engine source is unofficial')
          }
        }
      } catch (error) {
        setLog((old) => old.concat(['Error. Unable to validate source']))
      } finally {
        softwareBasics()
      }
    })

    /**
     * @name 软件基础设置
     * - 更新校验完毕之后（目前只有社区版yakit支持设置）
     */
    const softwareBasics = useMemoizedFn(async () => {
      // Interrupt Connection 后续不执行
      if (yakitStatusRef.current === 'break') {
        debugToPrintLog(`------ Software basics setup blocked ------`)
        setLog([])
        return
      }
      let flag = false
      if (isCommunityYakit()) {
        try {
          const res = await getLocalValue(LocalGVS.YakitCESoftwareBasics)
          flag = !res
        } catch (error) {}
      }
      if (flag) {
        debugToPrintLog(`------ Starting software basics setup ------`)
        setYakitStatus('softwareBasics')
      } else {
        startYakEngine()
      }
    })

    const startYakEngine = useMemoizedFn(async () => {
      // Interrupt Connection 后续不执行
      if (yakitStatusRef.current === 'break') {
        debugToPrintLog(`------ Engine startup flow blocked ------`)
        setLog([])
        return
      }

      if (allowSecretLocalJson.current) {
        debugToPrintLog(`------ Preparing to start engine connection flow ------`)
        setLog(['Preparing to start engine connection'])
        setTimeout(() => {
          onLinkEngine({
            port: allowSecretLocalJson.current.port,
            secret: allowSecretLocalJson.current.secret,
          })
          // 启动本地Connect后，重置所有检查状态，并后续不会在进行检查
          handleResetAllStatus()
        }, 1000)
      }
    })

    /** 初始化所有引擎Connect前检查状态 */
    const handleResetAllStatus = useMemoizedFn(() => {
      // check Json
      allowSecretLocalJson.current = null
      // yakit更新
      currentYakit.current = ''
      latestYakit.current = ''
      // yak更新
      currentYak.current = ''
      buildInYak.current = ''
    })

    // 监听数据库初始化中
    useEffect(() => {
      const offStartUpMessage = yakitEngine.onStartUpEngineMessage((str: string) => {
        setLog([str])
      })
      return () => {
        offStartUpMessage()
      }
    }, [])

    // 全部流程
    const initLink = useMemoizedFn((port: number) => {
      handleAllowSecretLocal(port, true)
    })

    // 后续不再检测更新操作
    const toLink = useMemoizedFn((port: number) => {
      handleAllowSecretLocal(port, false)
    })

    useImperativeHandle(
      ref,
      () => ({
        init: initLink,
        checkEngine: handleCheckEngineVersion,
        checkEngineSource: handleCheckEngineSource,
        startYakEngine: startYakEngine,
        link: toLink,
      }),
      [],
    )

    return (
      <>
        {!isEnpriTraceAgent() && (
          <UpdateYakitHint
            visible={yakitUpdate}
            onCallback={() => {
              setYakitUpdate(false)
              setRestartLoading(false)
              setYakitStatus('')
              handleCheckEngineVersion()
            }}
            latest={latestYakit.current}
          />
        )}
      </>
    )
  }),
)
