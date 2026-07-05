import React, { useState, useRef, useEffect } from 'react'
import { YakitButton } from '@/components/yakitUI/YakitButton/YakitButton'
import { getReleaseEditionName } from '@/utils/envfile'
import { useGetState, useMemoizedFn } from 'ahooks'
import { Progress } from 'antd'
import Draggable from 'react-draggable'
import type { DraggableEvent, DraggableData } from 'react-draggable'
import { yakitNotify } from '@/utils/notification'
import { DownloadingState, ModalIsTop, System } from '../../types'
import {
  grpcCancelDownloadYakEngineVersion,
  grpcClearLocalYaklangVersionCache,
  grpcFetchDownloadYak,
  grpcFetchLatestYakVersion,
  grpcInstallYak,
  grpcWriteEngineKeyToYakitProjects,
} from '../../grpc'
import { DragHeaderHeight, safeFormatDownloadProcessState } from '../../utils'
import { YaklangInstallHintSvgIcon } from '@/assets/newIcon'
import { OutlineQuestionmarkcircleIcon } from '@/assets/outline'
import { QuestionModal } from '../QuestionModal'
import { yakitEngine } from '@/utils/electronBridge'

import classNames from 'classnames'
import styles from './DownloadYaklang.module.scss'

interface DownloadYaklangProps {
  isTop: ModalIsTop
  setIsTop: (top: ModalIsTop) => void
  yaklangSpecifyVersion: string
  system: System
  visible: boolean
  onCancel: (isOk: boolean) => any
}

/** @name Yaklang引擎更新Download弹窗 */
export const DownloadYaklang: React.FC<DownloadYaklangProps> = React.memo((props) => {
  const { isTop, setIsTop, yaklangSpecifyVersion, system, visible, onCancel } = props

  /** 常见问题弹窗是否展示 */
  const [qsShow, setQSShow] = useState<boolean>(false)

  const [disabled, setDisabled] = useState(true)
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  const draggleRef = useRef<HTMLDivElement>(null)

  /** 远端yaklang引擎版本 */
  const yakLangVersion = useRef<string>('')
  /** Download进度条数据 */
  const [downloadProgress, setDownloadProgress, getDownloadProgress] = useGetState<DownloadingState>()

  // 是否中断Download进程
  const isBreakRef = useRef<boolean>(false)
  // 执行中途是否失败
  const [isFailed, setIsFailed] = useState<boolean>(false)

  const fetchVersion = useMemoizedFn(() => {
    let isTry: boolean = false // 是否需要Retry

    setIsFailed(false)
    setDownloadProgress(undefined)

    grpcFetchLatestYakVersion()
      .then((data: string) => {
        yakLangVersion.current = data
      })
      .catch((e: any) => {
        if (isBreakRef.current) return
        setIsFailed(true)
        isTry = true
      })
      .finally(() => {
        if (isBreakRef.current) return
        if (isTry) return
        downloadYak()
      })
  })

  const downloadYak = () => {
    grpcFetchDownloadYak(yakLangVersion.current, true)
      .then(() => {
        if (isBreakRef.current) return

        yakitNotify('success', 'Download complete')
        if (!getDownloadProgress()?.size) return

        setDownloadProgress({
          time: {
            elapsed: downloadProgress?.time.elapsed || 0,
            remaining: 0,
          },
          speed: 0,
          percent: 100,
          // @ts-ignore
          size: getDownloadProgress().size,
        })

        // 这样在下 times启动时，yakit会自动检测到引擎是否一致(用于解决yakit与irify在mac下的引擎冲突)
        grpcWriteEngineKeyToYakitProjects({ version: yakLangVersion.current }, true).finally(() => {
          // 清空主进程yaklang版本缓存
          grpcClearLocalYaklangVersionCache(true)
          onUpdate()
        })
      })
      .catch((e: any) => {
        if (isBreakRef.current) return
        yakitNotify('error', yakLangVersion.current + ' Download failed：' + e)
        setDownloadProgress(undefined)
        setIsFailed(true)
      })
  }

  /**
   * 1. 获取引擎版本号，并Download
   * 2. 监听本地Download Engine进度数据
   */
  useEffect(() => {
    if (visible) {
      isBreakRef.current = false

      if (yaklangSpecifyVersion) {
        yakLangVersion.current = yaklangSpecifyVersion
        downloadYak()
      } else {
        fetchVersion()
      }

      const offProgress = yakitEngine.onDownloadYakEngineProgress((state: DownloadingState) => {
        if (isBreakRef.current) return
        setDownloadProgress(safeFormatDownloadProcessState(state))
      })

      return () => {
        offProgress()
      }
    } else {
      isBreakRef.current = true
    }
  }, [visible])

  /** 立即更新 */
  const onUpdate = useMemoizedFn(() => {
    if (isBreakRef.current) return
    grpcInstallYak(yakLangVersion.current, true)
      .then(() => {
        yakitNotify(
          'success',
          `Installation succeeded. If it does not take effect, restart ${getReleaseEditionName()} `,
        )
        onClose(true)
      })
      .catch((err: any) => {
        yakitNotify(
          'error',
          `Installation failed: ${err.message.indexOf('operation not permitted') > -1 ? 'Please close the engine and try again' : err}`,
        )
        onClose(false)
      })
  })

  /** 弹窗拖拽移动触发事件 */
  const onStart = useMemoizedFn((_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) return

    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y + DragHeaderHeight,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    })
  })

  const onClose = useMemoizedFn((isOk: boolean) => {
    grpcCancelDownloadYakEngineVersion(yakLangVersion.current, true)
    isBreakRef.current = true
    setDownloadProgress(undefined)
    setQSShow(false)
    onCancel(isOk)
  })

  return (
    <div className={visible ? styles['mask-wrapper'] : styles['hidden-wrapper']}>
      <Draggable
        defaultClassName={classNames(styles['yaklang-update-modal'], {
          [styles['modal-top-wrapper']]: isTop === 0,
        })}
        disabled={disabled}
        bounds={bounds}
        onStart={(event, uiData) => onStart(event, uiData)}
        defaultPosition={{ x: 215, y: -300 }} // <- 初始位置
      >
        <div ref={draggleRef}>
          <div className={styles['modal-yaklang-engine-hint']} onClick={() => setIsTop(0)}>
            <div className={styles['yaklang-engine-hint-wrapper']}>
              <div
                className={styles['hint-draggle-body']}
                onMouseEnter={() => {
                  if (disabled) setDisabled(false)
                }}
                onMouseLeave={() => setDisabled(true)}
                onMouseDown={() => setIsTop(0)}
              ></div>

              <div className={styles['hint-left-wrapper']}>
                <div className={styles['hint-icon']}>
                  <YaklangInstallHintSvgIcon />
                </div>
                <div
                  className={styles['qs-icon']}
                  onClick={(e) => {
                    e.stopPropagation()
                    setQSShow(true)
                    setIsTop(2)
                  }}
                >
                  <OutlineQuestionmarkcircleIcon />
                </div>
              </div>

              <div className={styles['hint-right-wrapper']}>
                <div className={classNames(styles['hint-right-download'], 'yakit-progress-wrapper')}>
                  <div className={styles['hint-right-title']}>Yaklang engine downloading...</div>
                  <Progress
                    strokeColor="var(--Colors-Use-Main-Primary)"
                    trailColor="var(--Colors-Use-Neutral-Bg)"
                    percent={Math.floor((downloadProgress?.percent || 0) * 100)}
                  />
                  <div className={styles['download-info-wrapper']}>
                    <div>Remaining time : {(downloadProgress?.time.remaining || 0).toFixed(2)}s</div>
                    <div className={styles['divider-wrapper']}>
                      <div className={styles['divider-style']}></div>
                    </div>
                    <div>Elapsed : {(downloadProgress?.time.elapsed || 0).toFixed(2)}s</div>
                    <div className={styles['divider-wrapper']}>
                      <div className={styles['divider-style']}></div>
                    </div>
                    <div>Download speed : {((downloadProgress?.speed || 0) / 1000000).toFixed(2)}M/s</div>
                  </div>
                  <div className={styles['download-btn']}>
                    {isFailed && (
                      <YakitButton
                        size="max"
                        type="outline2"
                        onClick={() => (yaklangSpecifyVersion ? downloadYak() : fetchVersion())}
                      >
                        Retry
                      </YakitButton>
                    )}
                    <YakitButton size="max" type="outline2" onClick={() => onClose(false)}>
                      Cancel
                    </YakitButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <QuestionModal isTop={isTop} setIsTop={setIsTop} system={system} visible={qsShow} setVisible={setQSShow} />
    </div>
  )
})
