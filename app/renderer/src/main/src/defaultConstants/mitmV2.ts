import { SingleManualHijackControlMessage } from '@/pages/mitm/MITMManual/utils'
import { MITMHackerPageInfoProps } from '@/store/pageInfo'

export enum ManualHijackListAction {
  Hijack_List_Add = 'add',
  Hijack_List_Delete = 'delete',
  Hijack_List_Update = 'update',
  /**重置Manual Hijack表格数据 */
  Hijack_List_Reload = 'reload',
}

export enum ManualHijackListStatus {
  Hijacking_Request = 'hijacking request',
  Hijacking_Response = 'hijacking response',
  WaitHijack = 'wait hijack',
  Hijack_WS = 'hijacking ws',
}

export enum ManualHijackType {
  /**Manual Hijack */
  Manual = 'manual',
  /**Auto Forward */
  Log = 'log',
  /*Plugins输出 */
  PluginOutput = 'pluginOutput',
  /**Conditional Hijack */
  HijackFilter = 'hijackFilter',
}

export enum PackageType {
  Request = 'request',
  Response = 'response',
  WS = 'ws',
}

export const ManualHijackListStatusMap: Record<string, string> = {
  'hijacking request': 'Hijack Request',
  'hijacking response': 'Hijack Response',
  'wait hijack': 'Waiting for Hijack',
  'hijacking ws': 'WS Hijack',
}

export const defaultSingleManualHijack: SingleManualHijackControlMessage = {
  TaskID: '',
  Request: new Uint8Array(),
  Response: new Uint8Array(),
  HijackResponse: false,
  CancelHijackResponse: false,
  Drop: false,
  Forward: false,
  Tags: [],
  Payload: new Uint8Array(),
}
