import {
  SolidYakitPluginIcon,
  SolidPluginYakMitmIcon,
  SolidPluginProtScanIcon,
  SolidSparklesPluginIcon,
  SolidDocumentSearchPluginIcon,
  SolidCollectionPluginIcon,
} from '@/assets/icon/colors'
import { ReactNode } from 'react'
import { CodecPluginTemplate } from '../invoker/data/CodecPluginTemplate'
import { MITMPluginTemplate, PortScanPluginTemplate } from '../pluginDebugger/defaultData'
import { SolidFlagIcon, SolidBadgecheckIcon, SolidBanIcon, SolidCircleIcon } from '@/assets/icon/solid'
import { TypeSelectOpt } from './funcTemplateType'
import { PluginFilterParams, PluginListPageMeta, PluginSearchParams } from './baseTemplateType'

export function GetPluginLanguage(type: string): string {
  return pluginTypeToName[type]?.language || type
}

/** 插件类型对应的详细Info */
interface PluginTypeInfoProps {
  /** 插件类型名 */
  name: string
  /** 插件类型描述 */
  description: string
  /** 插件类型icon */
  icon: ReactNode
  /** 插件类型展示颜色 */
  color: string
  /** 插件类型默认源码 */
  content: string
  /** 插件类型使用编程语言 */
  language: string
}

/** @name 插件类型对应的详细Info */
export const pluginTypeToName: Record<string, PluginTypeInfoProps> = {
  yak: {
    name: 'Yak Native Plugin',
    description:
      'Built-in common network security libraries let you quickly create small security tools. This native module supports manual invocation only.',
    icon: <SolidYakitPluginIcon />,
    color: 'warning',
    content: 'yakit.AutoInitYakit()\n\n# Input your code!\n\n',
    language: 'yak',
  },
  mitm: {
    name: 'Yak-MITM Module',
    description: '专用于 MITM 模块中的模块，编写 MITM 插件，可以轻松对经过的流量进行Edit',
    icon: <SolidPluginYakMitmIcon />,
    color: 'blue',
    content: MITMPluginTemplate,
    language: 'yak',
  },
  'port-scan': {
    name: 'Yak Port Scan',
    description:
      'This plugin scans target ports and then further processes fingerprint results. A common workflow is fingerprinting first, then PoC verification.',
    icon: <SolidPluginProtScanIcon />,
    color: 'success',
    content: PortScanPluginTemplate,
    language: 'yak',
  },
  codec: {
    name: 'Yak-Codec',
    description:
      'The codec module in Yakit lets you customize the encoding, decoding, encryption, and decryption you need.',
    icon: <SolidSparklesPluginIcon />,
    color: 'purple',
    content: CodecPluginTemplate,
    language: 'yak',
  },
  lua: {
    name: 'Lua Module',
    description: 'Under review and currently unavailable.',
    icon: <SolidDocumentSearchPluginIcon />,
    color: 'bluePurple',
    content: '',
    language: 'lua',
  },
  nuclei: {
    name: 'Nuclei YAML Module',
    description:
      'Built with a YakVM sandbox, this module can run Nuclei DSL and use built-in Nuclei YAML templates seamlessly.',
    icon: <SolidCollectionPluginIcon />,
    color: 'cyan',
    content: '# Add your nuclei formatted PoC!',
    language: 'yaml',
  },
  config: {
    name: 'Simple Template',
    description: '',
    icon: <SolidCollectionPluginIcon />,
    color: 'cyan',
    content: '',
    language: 'yak',
  },
  skillmd: {
    name: 'Skill Template',
    description: '',
    icon: <SolidSparklesPluginIcon />,
    color: 'blue',
    content: '',
    language: 'yak',
  },
}
/** @name 类型选择-脚本类型选项Info */
export const DefaultTypeList: { icon: ReactNode; name: string; description: string; key: string }[] = [
  { ...pluginTypeToName['yak'], key: 'yak' },
  { ...pluginTypeToName['mitm'], key: 'mitm' },
  { ...pluginTypeToName['port-scan'], key: 'port-scan' },
  { ...pluginTypeToName['codec'], key: 'codec' },
  { ...pluginTypeToName['lua'], key: 'lua' },
  { ...pluginTypeToName['nuclei'], key: 'nuclei' },
]

/** @name ReviewStatus对应展示名称 */
export const aduitStatusToName: Record<string, { name: string; icon: ReactNode }> = {
  '0': { name: 'Pending Review', icon: <SolidCircleIcon className="aduit-status-solid-circle-color" /> },
  '1': { name: 'Approved', icon: <SolidBadgecheckIcon className="aduit-status-badge-check-color" /> },
  '2': { name: 'Rejected', icon: <SolidBanIcon className="aduit-status-ban-color" /> },
  '3': { name: 'Under Review', icon: <SolidFlagIcon className="aduit-status-flag-color" /> },
}
/** @name ReviewStatus选择列表 */
export const DefaultStatusList: TypeSelectOpt[] = [
  { key: '0', ...aduitStatusToName['0'] },
  { key: '1', ...aduitStatusToName['1'] },
  { key: '2', ...aduitStatusToName['2'] },
  { key: '3', ...aduitStatusToName['3'] },
]

export const defaultFilter: PluginFilterParams = {
  plugin_type: [],
  tags: [],
  plugin_group: [],
}
export const defaultSearch: PluginSearchParams = {
  keyword: '',
  userName: '',
  fieldKeywords: '',
  tag: '',
  type: 'fieldKeywords',
}

export const funcSearchType: { value: string; label: string }[] = [
  { value: 'fieldKeywords', label: 'Keywords' },
  { value: 'userName', label: 'By Author' },
  { value: 'tag', label: 'By Tag' },
  { value: 'keyword', label: 'Full Text Search' },
]
