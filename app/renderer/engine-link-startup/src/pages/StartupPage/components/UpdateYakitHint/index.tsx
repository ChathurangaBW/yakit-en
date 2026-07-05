import React, { useRef } from 'react'
import { useMemoizedFn } from 'ahooks'
import { useEffect, useMemo, useState } from 'react'
import { DownloadingState } from '../../types'
import { safeFormatDownloadProcessState } from '../../utils'
import { getReleaseEditionName } from '@/utils/envfile'
import { yakitNotify } from '@/utils/notification'
import { YakitButton } from '@/components/yakitUI/YakitButton/YakitButton'
import { YakitHint } from '@/components/yakitUI/YakitHint/YakitHint'
import { Progress } from 'antd'
import { grpcCancelDownloadYakit, grpcDownloadYakit } from '../../grpc'
import { yakitApp, yakitEngine, yakitShell } from '@/utils/electronBridge'

import styles from './UpdateYakitHint.module.scss'

interface UpdateYakitHintProps {
  latest: string
  visible: boolean
  onCallback: () => void
}
/** yakit 更新弹框 */
export const UpdateYakitHint: React.FC<UpdateYakitHintProps> = React.memo((props) => {
  const { latest, visible, onCallback } = props

  useEffect(() => {
    if (visible) {
      handleDownload()
      return () => {
        setStatus('install')
        setYakitProgress(undefined)
        setBreakLoading(false)
        isBreak.current = false
      }
    }
  }, [visible])

  const handleCancel = useMemoizedFn(() => {
    onCallback()
  })

  const [status, setStatus] = useState<'install' | 'installed'>('install')
  const [yakitProgress, setYakitProgress] = useState<DownloadingState>()
  const [breakLoading, setBreakLoading] = useState<boolean>(false)
  const isBreak = useRef<boolean>(false)

  useEffect(() => {
    const offProgress = yakitEngine.onDownloadYakitProgress((state: DownloadingState) => {
      if (isBreak.current) return
      setYakitProgress(safeFormatDownloadProcessState(state))
    })

    return () => {
      offProgress()
    }
  }, [])

  /** Download */
  const handleDownload = useMemoizedFn(() => {
    let version = latest.startsWith('v') ? latest.substring(1) : latest
    setStatus('install')
    grpcDownloadYakit(version, true)
      .then(() => {
        if (isBreak.current) return
        yakitNotify('success', 'Download complete')
        setYakitProgress((old) => {
          if (!old) return undefined
          return {
            time: {
              elapsed: old?.time.elapsed || 0,
              remaining: 0,
            },
            speed: 0,
            percent: 100,
            size: old.size,
          }
        })
        setStatus('installed')
      })
      .catch((e: any) => {
        !isBreak.current && yakitNotify('error', `Download failed: ${e}`)
        setYakitProgress(undefined)
        setStatus('install')
      })
  })

  /** 停止Download */
  const yakitBreak = useMemoizedFn(() => {
    isBreak.current = true
    grpcCancelDownloadYakit(true).catch(() => {})
    setBreakLoading(true)
    setStatus('install')
    setYakitProgress(undefined)
    setTimeout(() => {
      setBreakLoading(false)
      handleCancel()
    }, 300)
  })

  /** 立即更新-已Download完成 */
  const yakitUpdate = useMemoizedFn(() => {
    yakitShell.openYakitPath()
    setTimeout(() => {
      yakitApp.closeWindow()
    }, 100)
  })

  const title = useMemo(() => {
    if (status === 'install') return `${getReleaseEditionName()} downloading...`
    if (status === 'installed') return `${getReleaseEditionName()} downloaded successfully`
    return 'Unexpected error, please close!'
  }, [status])

  const footerBtn = useMemo(() => {
    if (status === 'install') {
      return (
        <YakitButton loading={breakLoading} size="max" type="outline2" onClick={yakitBreak}>
          Cancel
        </YakitButton>
      )
    }

    if (status === 'installed') {
      return (
        <>
          <YakitButton size="max" type="outline2" onClick={handleCancel}>
            Cancel
          </YakitButton>
          <YakitButton size="max" onClick={yakitUpdate}>
            Confirm
          </YakitButton>
        </>
      )
    }
    return null
  }, [status, breakLoading])

  return (
    <YakitHint footer={null} visible={visible} title={title}>
      <div className={styles['update-yakit-hint']}>
        {status === 'installed' && (
          <div className={styles['content']}>
            <div className={styles['hint-right-content']}>
              Installation requires closing the app. Double-click the installer to complete installation. Install now?
            </div>
          </div>
        )}

        {status === 'install' && (
          <div className={styles['content']}>
            <Progress
              strokeColor="var(--Colors-Use-Main-Primary)"
              trailColor="var(--Colors-Use-Neutral-Bg-Hover)"
              percent={Math.floor((yakitProgress?.percent || 0) * 100)}
            />
            <div className={styles['download-info-wrapper']}>
              <div>Remaining time : {(yakitProgress?.time.remaining || 0).toFixed(2)}s</div>
              <div className={styles['divider-wrapper']}></div>
              <div>Elapsed : {(yakitProgress?.time.elapsed || 0).toFixed(2)}s</div>
              <div className={styles['divider-wrapper']}></div>
              <div>
                Download speed : {((yakitProgress?.speed || 0) / 1000000).toFixed(2)}
                M/s
              </div>
            </div>
          </div>
        )}

        <div className={styles['footer']}>
          <div className={styles['btn-group']}>{footerBtn}</div>
        </div>
      </div>
    </YakitHint>
  )
})
