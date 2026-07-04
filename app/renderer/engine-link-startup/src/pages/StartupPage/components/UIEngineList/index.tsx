import React, { useEffect, useMemo, useRef, useState } from 'react'
import { TypeCallbackExtra, YakitStatusType, YaklangEngineMode, YaklangEngineWatchDogCredential } from '../../types'
import { useInViewport, useMemoizedFn } from 'ahooks'
import { YakitPopover } from '@/components/yakitUI/YakitPopover/YakitPopover'
import classNames from 'classnames'
import { YakitButton } from '@/components/yakitUI/YakitButton/YakitButton'
import { showYakitModal } from '@/components/yakitUI/YakitModal/YakitModalConfirm'
import { getReleaseEditionName } from '@/utils/envfile'
import { yakitNotify } from '@/utils/notification'
import { YakitPopconfirm } from '@/components/yakitUI/YakitPopconfirm/YakitPopconfirm'
import { LoadingOutlined } from '@ant-design/icons'
import { CheckedSvgIcon, GooglePhotosLogoSvgIcon } from '@/assets/newIcon'
import { YakitTag } from '@/components/yakitUI/YakitTag/YakitTag'
import { grpcRelaunch, grpcUnpackBuildInYak, grpcWriteEngineKeyToYakitProjects } from '../../grpc'
import { yakitEngine } from '@/utils/electronBridge'
import styles from './UIEngineList.module.scss'

interface yakProcess {
  port: number
  pid: number
  ppid?: number
  cmd: string
  origin: any
}

interface UIEngineListProp {
  engineMode: YaklangEngineMode | undefined
  typeCallback: (type: YakitStatusType, extra?: TypeCallbackExtra) => any
  engineLink: boolean
}

/** @name 已启动引擎列表 */
export const UIEngineList: React.FC<UIEngineListProp> = React.memo((props) => {
  const { engineMode, typeCallback, engineLink } = props

  const [show, setShow] = useState<boolean>(false)

  const listRef = useRef(null)
  const [inViewport] = useInViewport(listRef)

  const [psLoading, setPSLoading] = useState<boolean>(false)
  const [process, setProcess] = useState<yakProcess[]>([])
  const [port, setPort] = useState<number>(0)

  const fetchPSList = useMemoizedFn(() => {
    if (psLoading) return

    setPSLoading(true)
    yakitEngine
      .listYakGrpc()
      .then((i: yakProcess[]) => {
        setProcess(
          i.map((element: yakProcess) => {
            return {
              port: element.port,
              pid: element.pid,
              cmd: element.cmd,
              origin: element.origin,
            }
          }),
        )
      })
      .catch((e) => {
        yakitNotify('error', `PS | GREP yak failed ${e}`)
      })
      .finally(() => {
        setPSLoading(false)
      })
  })
  const fetchCurrentPort = () => {
    yakitEngine
      .fetchYaklangEngineAddr()
      .then((data) => {
        const hosts: string[] = (data.addr as string).split(':')
        if (hosts.length !== 2) return
        if (+hosts[1]) setPort(+hosts[1] || 0)
      })
      .catch(() => {})
  }
  useEffect(() => {
    if (inViewport) {
      fetchPSList()
      fetchCurrentPort()

      let id = setInterval(() => {
        fetchPSList()
        fetchCurrentPort()
      }, 3000)
      return () => {
        clearInterval(id)
      }
    }
  }, [inViewport])

  const allClose = useMemoizedFn(async () => {
    ;(process || []).forEach((i) => {
      yakitEngine.killYakGrpc(i.pid).then((val) => {
        if (!val) {
          yakitNotify('info', `KILL yak PROCESS: ${i.pid}`)
          if (+i.port === port && isLocal) typeCallback('break')
        }
      })
    })
    setTimeout(() => yakitNotify('success', 'Engine process is closing...'), 1000)
  })

  const isLocal = useMemo(() => {
    return engineMode === 'local'
  }, [engineMode])

  return (
    <YakitPopover
      visible={show}
      overlayClassName={classNames(styles['ui-op-dropdown'], styles['ui-engine-list-dropdown'])}
      placement={'bottomRight'}
      content={
        <div ref={listRef} className={styles['ui-engine-list-wrapper']}>
          <div className={styles['ui-engine-list-body']}>
            <div className={styles['engine-list-header']}>
              Local Yak Process Manager
              <YakitPopconfirm
                title={'Resetting the engine will restore the factory default and force a restart'}
                onConfirm={async () => {
                  process.map((i) => {
                    yakitEngine.killYakGrpc(i.pid)
                  })
                  grpcUnpackBuildInYak()
                    .then(() => {
                      grpcWriteEngineKeyToYakitProjects({}, true).finally(() => {
                        yakitNotify('info', 'Engine restored successfully')
                        grpcRelaunch()
                      })
                    })
                    .catch((err) => {
                      typeCallback('skipAgreement_InstallNetWork', { message: err + '' })
                    })
                }}
              >
                <YakitButton style={{ marginLeft: 8 }}>Reset Engine</YakitButton>
              </YakitPopconfirm>
              {psLoading && <LoadingOutlined className={styles['loading-icon']} />}
            </div>
            <div className={styles['engine-list-container']}>
              {process.map((i) => {
                return (
                  <div key={i.pid} className={styles['engine-list-opt']}>
                    <div className={styles['left-body']}>
                      <YakitTag color={isLocal && +i.port === port && engineLink ? 'success' : undefined}>
                        {`PID: ${i.pid}`}
                        {isLocal && +i.port === port && engineLink && <CheckedSvgIcon style={{ marginLeft: 8 }} />}
                      </YakitTag>
                      <div className={styles['engine-ps-info']}>
                        {`yak grpc --port ${i.port === 0 ? 'fetching' : i.port}`}
                        &nbsp;
                        {isLocal && +i.port === port && engineLink && (
                          <span className={styles['current-ps-info']}>(current)</span>
                        )}
                      </div>
                    </div>
                    <div className={styles['right-body']}>
                      <YakitButton
                        type="text"
                        onClick={() => {
                          setShow(false)
                          showYakitModal({
                            title: 'YakProcess Details',
                            content: <div style={{ padding: 8 }}>{JSON.stringify(i)}</div>,
                            footer: null,
                          })
                        }}
                      >
                        Details
                      </YakitButton>

                      <YakitPopconfirm
                        title={<>Confirm switch to this engine?</>}
                        onConfirm={async () => {
                          if (!isLocal) {
                            yakitNotify('info', 'Remote mode, engine switching not supported')
                            return
                          }
                          let oldPort = port
                          const switchEngine: YaklangEngineWatchDogCredential = {
                            Port: i.port,
                            Host: '127.0.0.1',
                          }
                          yakitEngine
                            .connectYaklangEngine(switchEngine)
                            .then(() => {
                              setTimeout(() => {
                                yakitNotify('success', `Engine switched successfully!`)
                              }, 500)
                            })
                            .catch((e) => {
                              yakitNotify('error', 'Engine switch failed, try reconnecting on a different port')
                              process.forEach((item) => {
                                if (item.port == oldPort) {
                                  yakitEngine
                                    .killYakGrpc(item.pid)
                                    .then((val) => {
                                      if (!val) {
                                        yakitNotify('success', 'Closing engine process...')
                                        typeCallback('break')
                                      }
                                    })
                                    .catch((e: any) => {})
                                    .finally(fetchPSList)
                                }
                              })
                            })
                        }}
                      >
                        <YakitButton
                          type="outline1"
                          colors="success"
                          disabled={+i.port === 0 || (isLocal && +i.port === port)}
                        >
                          Switch Engine
                        </YakitButton>
                      </YakitPopconfirm>
                      <YakitPopconfirm
                        title={
                          <>
                            Closing will force-terminate the process.
                            <br />
                            If this is the active engine, close {getReleaseEditionName()} before reconnecting,
                            <br />
                            then use "Manual Connect" on the loading page.
                          </>
                        }
                        onConfirm={async () => {
                          yakitEngine
                            .killYakGrpc(i.pid)
                            .then((val) => {
                              if (!val) {
                                isLocal && +i.port === port && typeCallback('break')
                                yakitNotify('success', 'Closing engine process...')
                              }
                            })
                            .catch((e: any) => {})
                            .finally(fetchPSList)
                        }}
                      >
                        <YakitButton type="outline1" colors="danger">
                          Close Engine
                        </YakitButton>
                      </YakitPopconfirm>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={styles['engine-list-footer']}>
              <div></div>
              <YakitPopconfirm
                title={
                  <div style={{ width: 330 }}>
                    Closing will force-terminate all processes.
                    <br />
                    If any is the active engine, close {getReleaseEditionName()} before reconnecting,
                    <br />
                    then use "Manual Connect" on the loading page.
                  </div>
                }
                onConfirm={() => allClose()}
              >
                <div className={styles['engine-list-footer-btn']}>Close All</div>
              </YakitPopconfirm>
            </div>
          </div>
        </div>
      }
      onVisibleChange={(visible) => setShow(visible)}
    >
      <div className={styles['ui-op-btn-wrapper']}>
        <div className={classNames(styles['op-btn-body'], { [styles['op-btn-body-hover']]: show })}>
          <GooglePhotosLogoSvgIcon className={classNames({ [styles['icon-rotate-animation']]: !show })} />
        </div>
      </div>
    </YakitPopover>
  )
})
