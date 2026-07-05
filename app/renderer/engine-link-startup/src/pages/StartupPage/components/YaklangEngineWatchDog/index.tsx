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
  // Whether to auto-restart the engine process.
  const [autoStartProgress, setAutoStartProgress] = useState(false)
  // Whether the engine process is starting.
  const startingUp = useRef<boolean>(false)
  const latestStartCallIdRef = useRef(0)

  useEffect(() => {
    yakitStatusRef.current = props.yakitStatus
  }, [props.yakitStatus])

  useEffect(() => {
    if (!props.engineLink) setAutoStartProgress(false)
  }, [props.engineLink])

  /** Receive the command to connect to the engine */
  useEffect(() => {
    emiter.on('startAndCreateEngineProcess', () => {
      engineTest()
    })
    return () => {
      emiter.off('startAndCreateEngineProcess')
    }
  }, [])

  /** Engine credential validation */
  const engineTest = useMemoizedFn(() => {
    debugToPrintLog(`[IFNO] engine-test mode:${props.credential.Mode} port:${props.credential.Port}`)
    // Reset state.
    setAutoStartProgress(false)

    const mode = props.credential.Mode
    if (!mode) {
      return
    }

    if (props.credential.Port <= 0) {
      outputToWelcomeConsole('The port is empty, so the engine cannot be connected.')
      return
    }

    /**
     * Validate carefully: after accurate information is available, try one connection and continue only after it succeeds.
     * If the engine is not running, the connection cannot succeed; choose the proper startup path based on engine state.
     */
    outputToWelcomeConsole('Attempting to connect to the Yaklang core engine.')
    debugToPrintLog('------ Checking whether the target engine process is alive ------')
    yakitEngine
      .connectYaklangEngine(props.credential)
      .then(() => {
        debugToPrintLog('------ Target engine process is alive ------')
        outputToWelcomeConsole('Connected to the core engine successfully!')
        if (props.onKeepaliveShouldChange) {
          props.onKeepaliveShouldChange(true)
        }
      })
      .catch((e) => {
        debugToPrintLog('------ Target engine process was not found ------')
        outputToWelcomeConsole('Engine not connected. Attempting to start the engine process.')
        switch (mode) {
          case 'local':
            outputToWelcomeConsole('Attempting to start the local process.')
            setAutoStartProgress(true)
            return
          case 'remote':
            outputToWelcomeConsole('Remote mode does not auto-start the local engine.')
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
        // Exit early if the process should not be started.
        return
      }
      debugToPrintLog(`[INFO] Attempting to start a new engine process port:${props.credential.Port}`)
      // Only local mode uses the engine startup flow.
      outputToWelcomeConsole(
        `Starting the local engine process with standard privileges. Local port: ${props.credential.Port}`,
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
                debugToPrintLog('[INFO] New local engine process started successfully')
                if (props.onKeepaliveShouldChange) {
                  props.onKeepaliveShouldChange(true)
                }
              } else {
                if (res.status === 'timeout') {
                  props.setCheckLog(['Command timed out. Click Retry to run it again.'])
                  props.setYakitStatus('start_timeout')
                } else {
                  outputToWelcomeConsole('Engine startup failed:' + res.status + ':' + res.message)
                }
                debugToPrintLog(`[ERROR] New local engine process failed to start: ${res.status + ':' + res.message}`)
              }
              startingUp.current = false
            })
            .catch((error) => {
              // Skip stale calls.
              if (callId !== latestStartCallIdRef.current) return
              // If manually interrupted, show the interrupted state; unexpected cases are left unchanged for now.
              outputToWelcomeConsole(
                `The engine startup command was interrupted or hit an unexpected condition: ${error}`,
              )
              props.setCheckLog([
                'The engine startup command was interrupted or hit an unexpected condition. Check the logs for details...',
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
   * Engine connection retry logic
   * Valid engine connection retry count: 1-10
   */
  useEffect(() => {
    const keepalive = props.keepalive
    if (!keepalive) {
      if (props.onFailed) {
        props.onFailed(100)
      }
      return
    }
    debugToPrintLog('------ Starting engine process health-check loop ------')

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
            outputToWelcomeConsole('The engine is ready and can be connected.')
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
            outputToWelcomeConsole(
              `The engine has not fully started and cannot be connected. Failed attempts: ${failedCount}`,
            )
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
