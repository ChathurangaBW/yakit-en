import { YaklangEngineMode } from '@/yakitGVDefine'
import { DynamicStatusProps } from '@/store'

export const EngineModeVerbose = (m: YaklangEngineMode, n?: DynamicStatusProps) => {
  if (n && n.isDynamicStatus) {
    return 'Control Mode'
  }
  switch (m) {
    case 'local':
      return 'Local Mode'
    case 'remote':
      return 'Remote Mode'
    default:
      return 'Unknown Mode'
  }
}
