import React, { useEffect, useRef, useState } from 'react'
import { YakitStatusType, YaklangEngineWatchDogCredential } from '../../types'
import { useDebounceEffect, useMemoizedFn } from 'ahooks'
import { debugToPrintLog } from '@/utils/logCollection'
import { yakitNotify } from '@/utils/notification'
import { __PLATFORM__, FetchSoftwareVersion, isEnpriTraceAgent } from '@/utils/envfile'
import emiter from '@/utils/eventBus/eventBus'
import { grpcStartLocalEngine, isEngineConnectionAlive } from '../../grpc'
import { outputToWelcomeConsole } from '../../utils'
import { yakitEngine } from '@/utils/electronBridge'

export interface YaklangEngineWatchDogProps {
  credential: YaklangEngineWatchDogCredential
  keepalive: boolean
  engineLink: boolean

  onReady?: () => void
  onFailed?: (failedCount: number) => void
  onKeepaliveShouldChange?: (keepalive: boolean) => void

  yakitStatus: YakitStatusType
  setYakitStatus: (v: YakitStatusType) => void

  setCheckLog: (log: string[]) => void
}

export const YaklangEngineWatchDog: React.FC<YaklangEngineWatchDogProps> = React.memo((props) => {
  const yakitStatusRef = useRef<YakitStatusType>(props.yakitStatus)
  // 是否自动重启引擎进程
  const [autoStartProgress, setAutoStartProgress] = useState(false)
  // 是否正在重启引擎进程
  const startingUp = useRef<boolean>(false)
  const latestStartCallIdRef = useRef(0)

  useEffect(() => {
    yakitStatusRef.current = props.yakitStatus
  }, [props.yakitStatus])

  useEffect(() => {
    if (!props.engineLink) setAutoStartProgress(false)
  }, [props.engineLink])

  /** 接受Connect引擎的指令 */
  useEffect(() => {
    emiter.on('startAndCreateEngineProcess', () => {
      engineTest()
    })
    return () => {
      emiter.off('startAndCreateEngineProcess')
    }
  }, [])

  /** 引擎信息认证 */
  const engineTest = useMemoizedFn(() => {
    debugToPrintLog(`[IFNO] engine-test mode:${props.credential.Mode} port:${props.credential.Port}`)
    // 重置状态
    setAutoStartProgress(false)

    const mode = props.credential.Mode
    if (!mode) {
      return
    }

    if (props.credential.Port <= 0) {
      outputToWelcomeConsole('Port is empty. Unable to connect to engine')
      return
    }

    /**
     * 认证要小心做，拿到准确的信息之后，尝试Connect一 times，ConfirmConnect成功之后才可以开始后续步骤
     * 当然引擎没有启动的时候None法Connect成功，要准备根据引擎状态选择合适的方式启动引擎
     */
    outputToWelcomeConsole('Trying to connect to Yaklang core engine')
    debugToPrintLog(`------ Checking whether the target engine process is alive------`)
    yakitEngine
      .connectYaklangEngine(props.credential)
      .then(() => {
        debugToPrintLog(`------ Target engine process is alive ------`)
        outputToWelcomeConsole(`Core engine connected successfully!`)
        if (props.onKeepaliveShouldChange) {
          props.onKeepaliveShouldChange(true)
        }
      })
      .catch((e) => {
        debugToPrintLog(`------ Target engine process does not exist ------`)
        outputToWelcomeConsole('Not connected to engine. Trying to start engine process')
        switch (mode) {
          case 'local':
            outputToWelcomeConsole('Trying to start local process')
            setAutoStartProgress(true)
            return
          case 'remote':
            outputToWelcomeConsole('Remote Mode does not auto-start the local engine')
            yakitNotify('error', e + '')
            return
        }
      })
  })

  useDebounceEffect(
    () => {
      const mode = props.credential.Mode

      if (!mode) {
        return
      }
      if (mode === 'remote') {
        return
      }
      if (props.credential.Port <= 0) {
        return
      }
      if (!autoStartProgress) {
        // 不启动进程的话，就直接Exit
        return
      }
      debugToPrintLog(`[INFO] Trying to start a new engine process port:${props.credential.Port}`)
      // 只有普通模式才涉及到引擎启动的流程
      outputToWelcomeConsole(
        `Starting local engine process with standard permissions. Local port: ${props.credential.Port}`,
      )

      if (mode === 'local') {
        if (!startingUp.current) {
          const callId = ++latestStartCallIdRef.current
          grpcStartLocalEngine({
            port: props.credential.Port,
            password: props.credential.Password,
            version: __PLATFORM__,
            isEnpriTraceAgent: isEnpriTraceAgent(),
            softwareVersion: FetchSoftwareVersion(),
          })
            .then((res) => {
              if (yakitStatusRef.current === 'break') return

              if (res.ok && res.status === 'success') {
                debugToPrintLog(`[INFO] New local engine process started successfully`)
                if (props.onKeepaliveShouldChange) {
                  props.onKeepaliveShouldChange(true)
                }
              } else {
                if (res.status === 'timeout') {
                  props.setCheckLog(['Command timed out. Click Run Again'])
                  props.setYakitStatus('start_timeout')
                } else {
                  outputToWelcomeConsole('Engine startup failed:' + res.status + ':' + res.message)
                }
                debugToPrintLog(`[ERROR] New local engine process failed to start: ${res.status + ':' + res.message}`)
              }
              startingUp.current = false
            })
            .catch((error) => {
              // 旧调用直接跳过
              if (callId !== latestStartCallIdRef.current) return
              // 如果手动中断 显示中断界面 意外情况暂时不做处理
              outputToWelcomeConsole(`Engine startup command was interrupted or hit an unexpected error：${error}`)
              props.setCheckLog([
                'Engine startup command was interrupted or hit an unexpected error. Check logs for details...',
              ])
            })
        }
      }
    },
    [autoStartProgress, props.onKeepaliveShouldChange, props.credential],
    {
      leading: false,
      wait: 1000,
    },
  )

  /**
   * 引擎Connect尝试逻辑
   * 引擎Connect有效尝试 times数: 1-10
   */
  useEffect(() => {
    const keepalive = props.keepalive
    if (!keepalive) {
      if (props.onFailed) {
        props.onFailed(100)
      }
      return
    }
    debugToPrintLog(`------ Starting engine process keepalive flow------`)

    let count = 0
    let failedCount = 0
    let notified = false

    const connect = () => {
      count++
      isEngineConnectionAlive()
        .then(() => {
          if (!keepalive) {
            return
          }
          if (!notified) {
            outputToWelcomeConsole('Engine is ready and can be connected')
            notified = true
          }
          failedCount = 0
          if (props.onReady) {
            props.onReady()
          }
        })
        .catch((e) => {
          failedCount++
          if (failedCount > 0 && failedCount <= 10) {
            outputToWelcomeConsole(`Engine is not fully started and cannot connect. Failure count：${failedCount}`)
          }
          if (props.onFailed) {
            props.onFailed(failedCount)
          }
        })
    }
    connect()
    const id = setInterval(connect, 3000)
    return () => {
      clearInterval(id)
    }
  }, [props.keepalive, props.onReady, props.onFailed])

  return <></>
})
