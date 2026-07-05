export interface RemoteEngineProps {
  loading: boolean
  setLoading: (flag: boolean) => any
  onSubmit: (info: RemoteLinkInfo) => any
  /** Cancel & 切换本地Connect */
  onSwitchLocalEngine: () => any
}

/** @name Remote Connection配置参数 */
export interface RemoteLinkInfo {
  /** 是否Save as connection history */
  allowSave: boolean
  /** 历史Connection Name称 */
  linkName?: string
  /** 远程主机地址 */
  host: string
  /** 远程端口 */
  port: string
  /** 是否开启TLS */
  tls: boolean
  /** 证书 */
  caPem?: string
  password?: string
}

/** @name 本地缓存Remote Connection配置信息 */
export interface YakitAuthInfo {
  name: string
  host: string
  port: number
  caPem: string
  tls: boolean
  password: string
}

export interface PEMExampleProps {
  children?: any
  setShow?: (flag: boolean) => any
}
