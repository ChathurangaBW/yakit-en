import { Architecture, DownloadingState, System, SystemInfoProps, YaklangEngineMode } from './types'
import { yakitEngine, yakitSystem } from '@/utils/electronBridge'

/**
 * Return the display label for a Yaklang engine mode.
 */
export const EngineModeVerbose = (m: YaklangEngineMode): string => {
  switch (m) {
    case 'local':
      return 'Local Mode'
    case 'remote':
      return 'Remote Mode'
    default:
      return 'Unknown Mode'
  }
}

export const SystemInfo: SystemInfoProps = {
  system: undefined,
  architecture: undefined,
  isDev: undefined,
  mode: undefined,
}

export const DragHeaderHeight = 50

export const handleFetchSystemInfo = async () => {
  try {
    SystemInfo.system = await yakitSystem.fetchSystemName()
  } catch (error) {}
  try {
    SystemInfo.architecture = await yakitSystem.fetchCpuArch()
  } catch (error) {}
  try {
    SystemInfo.isDev = !!(await yakitSystem.isDev())
  } catch (error) {}
}

export const handleFetchSystem = async (callback?: (value: System | undefined) => any) => {
  try {
    SystemInfo.system = await yakitSystem.fetchSystemName()
  } catch (error) {}
  if (callback) callback(SystemInfo.system)
}

export const handleFetchArchitecture = async (callback?: (value: Architecture | undefined) => any) => {
  try {
    SystemInfo.architecture = await yakitSystem.fetchCpuArch()
  } catch (error) {}
  if (callback) callback(SystemInfo.architecture)
}

export const handleFetchIsDev = async (callback?: (value: boolean | undefined) => any) => {
  try {
    SystemInfo.isDev = !!(await yakitSystem.isDev())
  } catch (error) {}
  if (callback) callback(SystemInfo.isDev)
}

/** @name Normalize progress data and guard against malformed values */
export const safeFormatDownloadProcessState = (state: DownloadingState) => {
  try {
    // Safely read nested values and default missing values to 0.
    const total = state.size?.total || 0
    const transferred = state.size?.transferred || 0
    const elapsed = state.time?.elapsed || 0
    const remaining = state.time?.remaining || 0

    return {
      percent: state.percent || 0,
      size: { total, transferred },
      speed: state.speed || 0,
      time: { elapsed, remaining },
    }
  } catch (e) {
    return {
      percent: 0,
      size: { total: 0, transferred: 0 },
      speed: 0,
      time: { elapsed: 0, remaining: 0 },
    }
  }
}

export const outputToWelcomeConsole = (msg: any) => {
  yakitEngine
    .outputLogToWelcomeConsole(`${msg}`)
    .then(() => {})
    .catch((e) => {
      console.info(e)
    })
}
