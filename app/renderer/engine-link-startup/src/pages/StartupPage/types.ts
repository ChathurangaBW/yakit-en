import { SoftwareVersion } from '@/utils/envfile'

/** Current启动yaklang引擎模式 */
export type YaklangEngineMode = 'local' | 'remote'

/** 操作系统类型 */
export type System = 'Linux' | 'Darwin' | 'Windows_NT'

/** CPU架构 */
export type Architecture =
  | 'arm'
  | 'arm64'
  | 'ia32'
  | 'mips'
  | 'mipsel'
  | 'ppc'
  | 'ppc64'
  | 'riscv64'
  | 's390'
  | 's390x'
  | 'x64'

export interface SystemInfoProps {
  /** 操作系统 */
  system?: System
  /** 系统架构 */
  architecture?: Architecture
  /** 是否为开发环境 */
  isDev?: boolean
  /** Local Mode或者Remote Mode */
  mode?: YaklangEngineMode
}

/** @name Currentyakit使用状态 */
export type YakitStatusType =
  | 'init' // 初始
  | 'install' // 解压内置引擎
  | 'installNetWork' // 初始内置引擎不存在，联网Install
  | 'check_timeout' // 引擎check超时
  | 'old_version' // 检查随机Password模式失败(引擎版本低)
  | 'skipAgreement_InstallNetWork' // Downloadyak引擎 不需要勾选User Agreement
  | 'skipAgreement_Install' // 重置yak引擎 不需要勾选User Agreement
  | 'port_occupied_prev' // 端口被占用前操作
  | 'port_occupied' // 端口被占用
  | 'database_error' // 数据库Error
  | 'fix_database_timeout' // 数据库修复超时
  | 'fix_database_error' // 数据库修复失败
  | 'antivirus_blocked' // 检查随机Password模式失败(杀软)
  | 'allow-secret-error' // 检查随机Password模式失败(未知)
  | 'update_yakit' // 检测到新版yakit
  | 'update_yak' // 检测到新版yak
  | 'check_yak_version_error' // 检测新版yak出错
  | 'softwareBasics' // 软件基础设置
  | 'ready' // 开始尝试Connect引擎
  | 'start_timeout' // 引擎启动超时
  | 'error' // 引擎Connect超时
  | 'link_countdown' // 引擎Connect成功，倒计时进入
  | 'link' // 引擎Connect成功
  | 'break' // 小风车主动断开本地Connect的引擎
  | 'reclaimDatabaseSpace_start' // 开始Reclaim Database Space
  | 'reclaimDatabaseSpace_success' // Reclaim Database Space完成
  | 'reclaimDatabaseSpace_error' // 回收Error
  | ''

/** Download进度条-时间数据 */
interface DownloadingTime {
  /** Elapsed */
  elapsed: number
  /** Remaining time */
  remaining: number
}
/** Download进度条-包体大小数据 */
interface DownloadingSize {
  total: number
  transferred: number
}

/** Download yaklang 和 yakit 进度条数据流 */
export interface DownloadingState {
  time: DownloadingTime
  /** Download speed */
  speed: number
  /** Download进度百分比 */
  percent: number
  size: DownloadingSize
}

export interface YaklangEngineWatchDogCredential {
  Mode?: YaklangEngineMode
  Host: string
  Port: number

  /**
   * 高级登陆验证信息
   * */
  IsTLS?: boolean
  PemBytes?: Uint8Array
  Password?: string
}

/** @name engineWatchDog-处理过程的回调事件 */
export type EngineWatchDogCallbackType = 'remote-connect-failed'

export type ModalIsTop = 0 | 1 | 2

export type IgnoreYakit = 'ignoreThisTime' | 'ignoreUpdates'
export interface LoadingClickExtra {
  port?: number
  killCurProcess?: boolean
  downYakit?: boolean
  ignoreYakit?: IgnoreYakit
  downYak?: boolean
  linkAgain?: boolean
  /** 是否Enter Now（跳过倒计时） */
  enterNow?: boolean
}

export interface StartLocalEngine {
  port: number
  password: string
  version: string
  isEnpriTraceAgent: boolean
  softwareVersion: SoftwareVersion
}

export interface TypeCallbackExtra {
  message?: string
  dbPath?: string[]
}
