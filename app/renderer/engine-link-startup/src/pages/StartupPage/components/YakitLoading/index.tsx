import React, { useEffect, useMemo, useState } from 'react'
import { Checkbox, Divider, Form, Tooltip } from 'antd'
import { getLocalValue, setLocalValue } from '@/utils/kv'
import { OutlineArrowcirclerightIcon, OutlineExitIcon, OutlineQuestionmarkcircleIcon } from '@/assets/outline'
import { YakitButton } from '@/components/yakitUI/YakitButton/YakitButton'
import { YakitInput } from '@/components/yakitUI/YakitInput/YakitInput'
import { LoadingClickExtra, ModalIsTop, System, YakitStatusType, YaklangEngineMode } from '../../types'
import { useDebounceEffect, useMemoizedFn } from 'ahooks'
import { AgreementContentModal } from '../AgreementContentModal'
import { LocalGVS } from '@/enums/yakitGV'
import { grpcOpenYaklangPath } from '../../grpc'
import { openABSFileLocated } from '@/utils/openWebsite'
import { EngineModeVerbose } from '../../utils'
import { YakitDropdownMenu } from '@/components/yakitUI/YakitDropdownMenu/YakitDropdownMenu'
import { YakitSpin } from '@/components/yakitUI/YakitSpin/YakitSpin'
import { SoftwareBasics, SoftwareBasicsProps } from '../SoftwareBasics'
import { yakitApp } from '@/utils/electronBridge'
import { YakitPopover } from '@/components/yakitUI/YakitPopover/YakitPopover'
import { MoreYaklangVersion } from '../MoreYaklangVersion'

import classNames from 'classnames'
import styles from './YakitLoading.module.scss'
export interface YakitLoadingProp extends SoftwareBasicsProps {
  /** Loading message */
  yakitLoadingTip: string
  /** Whether the UI is temporarily disabled */
  disableYakitLoading: boolean

  isTop: ModalIsTop
  setIsTop: (top: ModalIsTop) => void

  /** Operating system */
  system: System
  /** Built-in engine version */
  buildInEngineVersion: string
  /** Yakit status */
  yakitStatus: YakitStatusType
  /** Engine mode */
  engineMode: YaklangEngineMode

  /** Software check logs */
  checkLog: string[]

  /** Button loading state while manually reconnecting the engine */
  restartLoading: boolean

  /** Database path when database repair fails */
  dbPath: string[]

  /** Current connection port */
  port: number

  /** Countdown seconds */
  countdown?: number

  /** Additional engine versions */
  moreYaklangVersionList: string[]

  /** Set the specific engine version to download */
  setYaklangSpecifyVersion: (version: string) => void

  btnClickCallback: (type: YaklangEngineMode | YakitStatusType, extra?: LoadingClickExtra) => void
}

export const YakitLoading: React.FC<YakitLoadingProp> = (props) => {
  const {
    yakitLoadingTip,
    disableYakitLoading,
    isTop,
    setIsTop,
    system,
    buildInEngineVersion,
    yakitStatus,
    engineMode,
    restartLoading,
    btnClickCallback,
    checkLog,
    dbPath,
    port,
    countdown = 0,
    softTheme,
    setSoftTheme,
    softMode,
    setSoftMode,
    softLang,
    setSoftLang,
    moreYaklangVersionList,
    setYaklangSpecifyVersion,
  } = props

  const [moreVersionPopShow, setMoreVersionPopShow] = useState<boolean>(false)
  const [form] = Form.useForm()
  /** User agreement checked state */
  const [agrCheck, setAgrCheck] = useState<boolean>(false)
  /** User agreement state used before one-click install */
  const [checkStatus, setCheckStatus] = useState<boolean>(false)
  /** Whether to show the shake animation */
  const [isShake, setIsShake] = useState<boolean>(false)
  // Keep the modal on top.
  const [agrShow, setAgrShow] = useState<boolean>(false)
  useEffect(() => {
    getLocalValue(LocalGVS.IsCheckedUserAgreement).then((val: boolean) => {
      setAgrCheck(val)
    })
  }, [])
  useDebounceEffect(
    () => {
      if (agrCheck) {
        setLocalValue(LocalGVS.IsCheckedUserAgreement, true)
      }
    },
    [agrCheck],
    { wait: 500 },
  )
  const agreement = useMemoizedFn(() => {
    return (
      <div
        className={classNames(styles['hint-right-agreement'], {
          [styles['agr-shake-animation']]: !agrCheck && isShake,
        })}
      >
        <Checkbox
          className={classNames(
            { [styles['agreement-checkbox']]: !(!agrCheck && checkStatus) },
            {
              [styles['agreement-danger-checkbox']]: !agrCheck && checkStatus,
            },
          )}
          checked={agrCheck}
          onChange={(e) => setAgrCheck(e.target.checked)}
        ></Checkbox>
        <span>
          I agree to the{' '}
          <span
            className={styles['agreement-style']}
            onClick={(e) => {
              e.stopPropagation()
              setAgrShow(true)
              setIsTop(1)
            }}
          >
            User Agreement
          </span>
        </span>
      </div>
    )
  })

  const judgmentAgreement = useMemoizedFn(() => {
    setCheckStatus(true)
    if (!agrCheck) {
      /** Shake hint animation */
      setIsShake(true)
      setTimeout(() => setIsShake(false), 1000)
      return false
    }
    return true
  })

  const btns = useMemo(() => {
    if (yakitStatus === 'install') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => judgmentAgreement() && btnClickCallback('install')}
          >
            Initialize Engine
          </YakitButton>

          <YakitButton
            className={styles['btn-style']}
            size="large"
            type="secondary2"
            loading={restartLoading}
            onClick={() => judgmentAgreement() && btnClickCallback('remote')}
          >
            Remote Connection
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'installNetWork') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => judgmentAgreement() && btnClickCallback('installNetWork')}
          >
            Download Engine
          </YakitButton>

          <YakitButton
            className={styles['btn-style']}
            size="large"
            type="secondary2"
            loading={restartLoading}
            onClick={() => judgmentAgreement() && btnClickCallback('remote')}
          >
            Remote Connection
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'check_timeout') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('check_timeout')}
          >
            Retry
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'old_version') {
      return (
        <>
          {buildInEngineVersion ? (
            <YakitButton
              className={styles['btn-style']}
              size="large"
              loading={restartLoading}
              onClick={() => btnClickCallback('install')}
            >
              Reset Engine Version
            </YakitButton>
          ) : (
            <YakitButton
              className={styles['btn-style']}
              size="large"
              loading={restartLoading}
              onClick={() => btnClickCallback('installNetWork')}
            >
              Download Engine
            </YakitButton>
          )}
        </>
      )
    }

    if (yakitStatus === 'port_occupied_prev') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('port_occupied_prev', { killCurProcess: true })}
          >
            Reconnect
          </YakitButton>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            type="secondary2"
            onClick={() => btnClickCallback('port_occupied_prev')}
          >
            Switch Port
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'port_occupied') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => {
              form.validateFields().then((res) => {
                btnClickCallback('port_occupied', { port: res.newLinkport })
              })
            }}
          >
            Connect
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'allow-secret-error') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('install')}
          >
            Reset Engine Version
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'start_timeout') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('start_timeout')}
          >
            Retry
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'skipAgreement_Install') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('install')}
          >
            Reset Engine Version
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'skipAgreement_InstallNetWork') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('installNetWork')}
          >
            Download Engine
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'database_error') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('database_error')}
          >
            Repair Database
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'fix_database_error') {
      return (
        <>
          <div
            className={styles['engine-help-wrapper']}
            onClick={() => {
              openABSFileLocated(dbPath[0])
            }}
          >
            {dbPath.join(',')}
            <Tooltip title={`Open the folder and repair the database manually`}>
              <OutlineQuestionmarkcircleIcon />
            </Tooltip>
          </div>
        </>
      )
    }

    if (yakitStatus === 'fix_database_timeout') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('fix_database_timeout')}
          >
            Retry
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'update_yakit') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('update_yakit', { downYakit: true })}
          >
            Download Update
          </YakitButton>

          <YakitDropdownMenu
            menu={{
              data: [
                { key: 'ignoreThisTime', label: 'Ignore This Time' },
                { key: 'ignoreUpdates', label: "Don't Remind Again" },
              ],
              onClick: ({ key }) => {
                switch (key) {
                  case 'ignoreThisTime':
                    btnClickCallback('update_yakit', { ignoreYakit: 'ignoreThisTime' })
                    break
                  case 'ignoreUpdates':
                    btnClickCallback('update_yakit', { ignoreYakit: 'ignoreUpdates' })
                    break
                  default:
                    break
                }
              },
              menuWrapperClassName: styles['menuWrapper'],
              menuItemTitleClassName: styles['menuItemTitle'],
            }}
            dropdown={{
              trigger: ['click'],
              placement: 'bottom',
            }}
          >
            <YakitButton className={styles['btn-style']} size="large" type="secondary2" loading={restartLoading}>
              Ignore
            </YakitButton>
          </YakitDropdownMenu>
        </>
      )
    }

    if (yakitStatus === 'update_yak') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('update_yak', { downYak: true })}
          >
            Install
          </YakitButton>

          <YakitButton
            className={styles['btn-style']}
            size="large"
            type="secondary2"
            loading={restartLoading}
            onClick={() => btnClickCallback('update_yak')}
          >
            Ignore
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'check_yak_version_error') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('check_yak_version_error')}
          >
            Manual Connect
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'softwareBasics') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('softwareBasics')}
          >
            Manual Connect
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'break') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('break', { linkAgain: true })}
          >
            Manual Connect
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'reclaimDatabaseSpace_success') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('reclaimDatabaseSpace_success')}
          >
            Manual Connect
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'reclaimDatabaseSpace_error') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('reclaimDatabaseSpace_error')}
          >
            Manual Connect
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'error') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            loading={restartLoading}
            onClick={() => btnClickCallback('error')}
          >
            Manual Connect
          </YakitButton>
        </>
      )
    }

    if (yakitStatus === 'link_countdown') {
      return (
        <>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            type="primary"
            onClick={() => btnClickCallback('link_countdown', { enterNow: true })}
          >
            Enter Now ({countdown}s)
          </YakitButton>
          <YakitButton
            className={styles['btn-style']}
            size="large"
            type="secondary2"
            onClick={() => btnClickCallback('link_countdown')}
          >
            Cancel Connection
          </YakitButton>
        </>
      )
    }

    return null
  }, [yakitStatus, restartLoading, engineMode, checkStatus, buildInEngineVersion, JSON.stringify(dbPath), countdown])

  const logError = useMemo(() => {
    if (!yakitStatus) {
      return false
    }
    const statusArr: YakitStatusType[] = [
      'check_timeout',
      'old_version',
      'skipAgreement_InstallNetWork',
      'skipAgreement_Install',
      'port_occupied_prev',
      'port_occupied',
      'database_error',
      'fix_database_timeout',
      'fix_database_error',
      'reclaimDatabaseSpace_error',
      'antivirus_blocked',
      'allow-secret-error',
      'check_yak_version_error',
      'start_timeout',
      'error',
      'break',
    ]
    return statusArr.includes(yakitStatus)
  }, [yakitStatus])
  const logSuccess = useMemo(() => {
    if (!yakitStatus) {
      return false
    }
    const statusArr: YakitStatusType[] = ['reclaimDatabaseSpace_success']
    return statusArr.includes(yakitStatus)
  }, [yakitStatus])

  useEffect(() => {
    form.setFieldsValue({ newLinkport: port })
  }, [port])

  const showAgreement = useMemo(() => {
    const statusArr: YakitStatusType[] = ['install', 'installNetWork']
    return statusArr.includes(yakitStatus)
  }, [yakitStatus])

  const showBreakBtn = useMemo(() => {
    const statusArr: YakitStatusType[] = ['link', 'ready']
    return !yakitStatus || statusArr.includes(yakitStatus)
  }, [yakitStatus])

  const unLinkStatus = useMemo(() => {
    const statusArr: YakitStatusType[] = ['link', 'ready', 'init', 'reclaimDatabaseSpace_start']
    return yakitStatus && !statusArr.includes(yakitStatus)
  }, [yakitStatus])

  return (
    <YakitSpin spinning={disableYakitLoading} tip={yakitLoadingTip}>
      <div className={styles['startup-loading-wrapper']}>
        {yakitStatus === 'softwareBasics' ? (
          <SoftwareBasics
            softTheme={softTheme}
            setSoftTheme={setSoftTheme}
            softMode={softMode}
            setSoftMode={setSoftMode}
            softLang={softLang}
            setSoftLang={setSoftLang}
          />
        ) : (
          <div
            className={classNames(styles['log-wrapper'], {
              [styles['log-default-color']]: !logError,
              [styles['log-error-color']]: logError,
              [styles['log-success-color']]: logSuccess,
            })}
          >
            <div className={styles['log-body']}>
              {yakitStatus === 'link_countdown' ? (
                <div className={styles['log-item']}>Engine connected! Auto-entering in {countdown}s...</div>
              ) : yakitStatus === 'break' ? (
                <div className={styles['log-item']}>Connection interrupted. Click Manual Connect to reconnect.</div>
              ) : (
                checkLog.map((item, index, arr) => {
                  return (
                    <div key={item} className={styles['log-item']}>
                      {item}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
        <div className={styles['engine-log-btn']}>
          <Form
            form={form}
            requiredMark={false}
            colon={false}
            layout={'horizontal'}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            style={{ display: yakitStatus === 'port_occupied' ? 'block' : 'none' }}
          >
            <Form.Item
              label={''}
              rules={[
                { required: true, message: `Please enter a port number` },
                {
                  pattern: /^(?:[1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                  message: 'Please enter a valid port number',
                },
              ]}
              name={'newLinkport'}
            >
              <YakitInput placeholder="Switch port..." disabled={restartLoading} />
            </Form.Item>
          </Form>
          {btns}
        </div>
        <div className={styles['footer-wrapper']}>
          <span className={styles['exit-btn']} onClick={() => yakitApp.closeWindow()}>
            <OutlineExitIcon className={styles['exit-icon']} />
            Exit
          </span>
          {showAgreement ? (
            <>
              <Divider type="vertical"></Divider>
              {agreement()}
            </>
          ) : (
            <div className={styles['footer-btn']}>
              {/* Hide footer buttons during countdown state */}
              {yakitStatus !== 'link_countdown' && (
                <>
                  <Divider type="vertical"></Divider>
                  <span className={styles['secondary-btn']} onClick={() => grpcOpenYaklangPath()}>
                    Open Engine File
                  </span>
                  {/* Disconnect button: shown in empty state or after a successful connection */}
                  {showBreakBtn && (
                    <>
                      <Divider type="vertical"></Divider>
                      <span
                        className={classNames(styles['primary-btn'])}
                        onClick={() => {
                          btnClickCallback('break')
                        }}
                      >
                        Disconnect
                      </span>
                    </>
                  )}
                  {/* Remote connection button: shown while disconnected */}
                  {unLinkStatus && (
                    <>
                      <Divider type="vertical"></Divider>
                      <span
                        className={classNames(styles['primary-btn'], {
                          [styles['primary-btn-disable']]: restartLoading,
                        })}
                        onClick={() => {
                          if (restartLoading) {
                            return
                          }
                          btnClickCallback('remote')
                        }}
                      >
                        {EngineModeVerbose('remote')}{' '}
                        <OutlineArrowcirclerightIcon className={styles['arrow-circle-right-icon']} />
                      </span>
                    </>
                  )}
                  {/* More versions button: shown while disconnected */}
                  {unLinkStatus && (
                    <div className={styles['more-version-btn']}>
                      <YakitPopover
                        visible={moreVersionPopShow}
                        overlayClassName={styles['more-versions-popover']}
                        placement="topLeft"
                        trigger="click"
                        content={
                          <MoreYaklangVersion
                            moreYaklangVersionList={moreYaklangVersionList}
                            onClosePop={(visible, version) => {
                              setMoreVersionPopShow(visible)
                              setYaklangSpecifyVersion(version)
                            }}
                          />
                        }
                        onVisibleChange={(visible) => {
                          setMoreVersionPopShow(visible)
                        }}
                      >
                        <span className={classNames(styles['primary-btn'])}>More Engine Versions</span>
                      </YakitPopover>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <AgreementContentModal
        isTop={isTop}
        setIsTop={setIsTop}
        system={system}
        visible={agrShow}
        setVisible={setAgrShow}
      />
    </YakitSpin>
  )
}
