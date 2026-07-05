import { grpcFetchLocalPluginDetail } from '../pluginHub/utils/grpc'
import { defPluginExecuteFormValue } from '../plugins/operator/localPluginExecuteDetailHeard/constants'
import { apiDebugPlugin, DebugPluginRequest } from '../plugins/utils'
import {
  ListVectorStoreEntriesRequest,
  QueryEntityRequest,
  QueryEntityResponse,
  SearchKnowledgeBaseEntryRequest,
  SearchKnowledgeBaseEntryResponse,
  TClearKnowledgeResponse,
  TResultAllTableTotal,
  VectorStoreEntryResponse,
  type KnowledgeBaseFile,
} from './TKnowledgeBase'
import { KnowledgeBaseItem } from './hooks/useKnowledgeBase'
import { yakitNotify } from '@/utils/notification'

import {
  CrabIcon,
  SleepingCatIcon,
  TigerIcon,
  CatIcon,
  OctopusIcon,
  PigIcon,
  DogIcon,
  RabbitIcon,
  JumpingDragonIcon,
  BatmanIcon,
  SkeletonIcon,
  MeasuringCupIcon,
  CarIcon,
  TVIcon,
  HeadphonesIcon,
  SmileyFaceIcon,
  HeartIcon,
  WalletIcon,
  DiamondIcon,
  RobotIcon,
} from './icon/sidebarIcon'
import { YakitSideTabProps } from '../../components/yakitSideTab/YakitSideTabType'
import { API } from '@/services/swagger/resposeType'
import { NetWorkApi } from '@/services/fetch'
import { OutlineBookOpenTextIcon, OutlineChipIcon, OutlinePuzzleIcon } from '@/assets/icon/outline'
import knowledgeJoyrideFirst from '@/pages/KnowledgeBase/images/knowledge-joyride-first.mp4'
import knowledgeJoyrideLast from '@/pages/KnowledgeBase/images/knowledge-joyride-last.mp4'
import joyrideFirstStepImg from '@/pages/KnowledgeBase/images/joyride-first-step.png'
import knowledgeJoyrideThree from '@/pages/KnowledgeBase/images/knowledge-joyride-three.mp4'
import { Step } from 'react-joyride'
import styles from './knowledgeBase.module.scss'
import { RuleObject } from 'antd/lib/form'

const { ipcRenderer } = window.require('electron')

// 知识库所需安装插件名称列表
const targetInstallList = [
  'ffmpeg',
  'llama-server',
  'model-Qwen3-Embedding-0.6B-Q4',
  'model-whisper-medium-q5',
  'page2image',
  'pandoc',
  'whisper.cpp',
]

export enum KnowledgeTabListEnum {
  Knowledge = 'knowledge',
  Plugin = 'plugin',
  AI_Model = 'AIModel',
}
export const KnowledgeTabList: YakitSideTabProps['yakitTabs'] = [
  { value: KnowledgeTabListEnum.Knowledge, label: 'Knowledge Base', icon: <OutlineBookOpenTextIcon /> },
  {
    value: KnowledgeTabListEnum.Plugin,
    label: 'Plugins',
    icon: <OutlinePuzzleIcon />,
  },
  {
    value: KnowledgeTabListEnum.AI_Model,
    label: () => (
      <div className="first-step" style={{ display: 'flex', gap: 4 }}>
        <OutlineChipIcon />
        Models
      </div>
    ),
  },
]

const insertModaOptions = [
  {
    value: 'manual',
    label: 'Manual Add',
  },
  {
    value: 'external',
    label: 'External Import',
  },
  {
    value: 'other',
    label: 'Other',
  },
]

const knowledgeTypeOptions = [
  {
    value: 'Vulnerability Intelligence',
    label: 'Vulnerability Intelligence',
  },
  {
    value: 'Attack Techniques',
    label: 'Attack Techniques',
  },
  {
    value: 'Malware',
    label: 'Malware',
  },
  {
    value: 'Penetration Testing',
    label: 'Penetration Testing',
  },
  {
    value: 'Red Team vs Blue Team',
    label: 'Red Team vs Blue Team',
  },
  {
    value: 'Threat Intelligence',
    label: 'Threat Intelligence',
  },
  {
    value: 'Incident Response',
    label: 'Incident Response',
  },
  {
    value: 'Code Audit',
    label: 'Code Audit',
  },
  {
    value: 'Reverse Engineering',
    label: 'Reverse Engineering',
  },
  {
    value: 'Web Security',
    label: 'Web Security',
  },
  {
    value: 'Internal Network Penetration',
    label: 'Internal Network Penetration',
  },
  {
    value: 'Cloud-Native Security',
    label: 'Cloud-Native Security',
  },
  {
    value: 'Mobile Security',
    label: 'Mobile Security',
  },
  {
    value: 'IoT Security',
    label: 'IoT Security',
  },
  {
    value: 'Cryptography',
    label: 'Cryptography',
  },
  {
    value: 'Protocol Analysis',
    label: 'Protocol Analysis',
  },
  {
    value: 'Supply Chain Security',
    label: 'Supply Chain Security',
  },
  {
    value: 'Security Tools',
    label: 'Security Tools',
  },
  {
    value: 'Arsenal',
    label: 'Arsenal',
  },
  {
    value: 'Lab Environment',
    label: 'Lab Environment',
  },
  {
    value: 'Dictionary Rules',
    label: 'Dictionary Rules',
  },
  {
    value: 'Compliance Protection',
    label: 'Compliance Protection',
  },
  {
    value: 'Security Standards',
    label: 'Security Standards',
  },
  {
    value: 'Laws and Regulations',
    label: 'Laws and Regulations',
  },
  {
    value: 'Security Baseline',
    label: 'Security Baseline',
  },
  {
    value: 'Programming Languages',
    label: 'Programming Languages',
  },
  {
    value: 'Development Frameworks',
    label: 'Development Frameworks',
  },
  {
    value: 'Databases',
    label: 'Databases',
  },
  {
    value: 'DevOps',
    label: 'DevOps',
  },
  {
    value: 'System Operations',
    label: 'System Operations',
  },
  {
    value: 'Industry Reports',
    label: 'Industry Reports',
  },
  {
    value: 'Technical Blogs',
    label: 'Technical Blogs',
  },
  {
    value: 'Training Tutorials',
    label: 'Training Tutorials',
  },
  {
    value: 'Product Documentation',
    label: 'Product Documentation',
  },
  {
    value: 'Project Management',
    label: 'Project Management',
  },
  {
    value: 'AI and Security',
    label: 'AI and Security',
  },
]

// 获取文件上传后缀
const getFileInfoList = (filename?: string): KnowledgeBaseFile[] => {
  if (!filename) return []

  return filename.split(',').map((path) => {
    const trimmedPath = path.trim()
    if (!trimmedPath) return { path: '', fileType: '' }

    const parts = trimmedPath.split('.')
    const fileType = parts.length > 1 ? parts.pop()!.toLowerCase() : ''
    return { path: trimmedPath, fileType }
  })
}

const manageMenuList = [
  {
    key: 'edit',
    label: 'Edit',
  },
  {
    key: 'export',
    label: 'Export',
  },
  {
    key: 'delete',
    label: 'Delete',
  },
  {
    key: 'default',
    label: 'Set as Default',
  },
]

const createMenuList = [
  {
    key: 'create',
    label: 'Create',
  },
  {
    key: 'import',
    label: 'Import',
  },
]

const tableHeaderGroupOptions = [
  {
    value: 'entity',
    label: 'Entities',
  },
  {
    value: 'knowledge',
    label: 'Knowledge',
  },
  {
    value: 'vector',
    label: 'Vectors',
  },
]

const totalKeyMap: Record<string, keyof TResultAllTableTotal> = {
  entity: 'entityTotal',
  knowledge: 'knowledgeTotal',
  vector: 'vectorTotal',
}

// 查询知识库-知识列表
const apiSearchKnowledgeBaseEntry: (
  query?: SearchKnowledgeBaseEntryRequest,
) => Promise<SearchKnowledgeBaseEntryResponse> = (query) => {
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('SearchKnowledgeBaseEntry', query)
      .then(resolve)
      .catch((e) => {
        yakitNotify('error', `Query failed: ${e}`)
        reject(e)
      })
  })
}

// 查询知识库-向量列表
const apiListVectorStoreEntries: (query?: ListVectorStoreEntriesRequest) => Promise<VectorStoreEntryResponse> = (
  query,
) => {
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('ListVectorStoreEntries', query)
      .then(resolve)
      .catch((e) => {
        yakitNotify('error', `Query failed: ${e}`)
        reject(e)
      })
  })
}

// 查询知识库-实体列表
const apiQueryEntity: (query?: QueryEntityRequest) => Promise<QueryEntityResponse> = (query) => {
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('QueryEntity', query)
      .then(resolve)
      .catch((e) => {
        yakitNotify('error', `Query failed: ${e}`)
        reject(e)
      })
  })
}

const icons = [
  CrabIcon,
  SleepingCatIcon,
  TigerIcon,
  CatIcon,
  OctopusIcon,
  PigIcon,
  DogIcon,
  RabbitIcon,
  JumpingDragonIcon,
  BatmanIcon,
  SkeletonIcon,
  MeasuringCupIcon,
  CarIcon,
  TVIcon,
  HeadphonesIcon,
  SmileyFaceIcon,
  HeartIcon,
  WalletIcon,
  DiamondIcon,
  RobotIcon,
]

const targetIcon = (index) => icons[(index * 7 + 3) % icons.length]

const mergeKnowledgeBaseData = (localData: KnowledgeBaseItem[], apiData: KnowledgeBaseItem[]): KnowledgeBaseItem[] =>
  !Array.isArray(apiData) || apiData.length === 0
    ? localData
    : apiData.reduce(
        (acc, remoteItem) => {
          const index = acc.findIndex((localItem) => localItem.KnowledgeBaseName === remoteItem.KnowledgeBaseName)
          return index >= 0
            ? acc.map((item, i) => (i === index ? { ...item, ...remoteItem } : item))
            : [...acc, remoteItem]
        },
        [...localData],
      )

/**
 * 对比两个知识库数组，判断新增或删除
 * @param prev 上一次的数据
 * @param next 当前的数据
 */
const compareKnowledgeBaseChange = (
  prev: KnowledgeBaseItem[] | null | undefined,
  next: KnowledgeBaseItem[] | null | undefined,
): { delete: KnowledgeBaseItem | null; increase: KnowledgeBaseItem | null } | true => {
  // 如果任意一方为空，则无法比较，直接返回 true（表示无变化或无法判断）
  if (!Array.isArray(prev) || !Array.isArray(next)) return true

  const prevMap = new Map(prev.map((item) => [item.ID, item]))
  const nextMap = new Map(next.map((item) => [item.ID, item]))

  // 查找被删除的对象
  const deleted = prev.find((item) => !nextMap.has(item.ID))
  if (deleted) return { delete: deleted, increase: null }

  // 查找新增的对象
  const increased = next.find((item) => !prevMap.has(item.ID))
  if (increased) return { delete: null, increase: increased }

  // 没有变化
  return true
}

const compareKnowledgeBaseChangeList = (
  prev: KnowledgeBaseItem[] | null | undefined,
  next: KnowledgeBaseItem[] | null | undefined,
): { deleted: KnowledgeBaseItem[]; increased: KnowledgeBaseItem[]; unchanged: boolean } => {
  if (!Array.isArray(prev)) prev = []
  if (!Array.isArray(next)) next = []

  const prevMap = new Map(prev.map((item) => [item.ID, item]))
  const nextMap = new Map(next.map((item) => [item.ID, item]))

  // 删除项：prev 里有，但 next 没有
  const deleted = prev.filter((item) => !nextMap.has(item.ID))

  // 新增项：next 里有，但 prev 没有
  const increased = next.filter((item) => !prevMap.has(item.ID))

  // === 核心: 没有任何新增或删除时，返回 true ===
  const unchanged = deleted.length === 0 && increased.length === 0

  return {
    deleted,
    increased,
    unchanged,
  }
}
const findChangedObjects = (before, after) => {
  return after.find((newItem) => {
    const oldItem = before.find((b) => b.ID === newItem.ID)
    return oldItem?.streamstep === 'success' && newItem.streamstep === 1
  })
}

const BuildingKnowledgeBase = async (targetKnowledgeBase: KnowledgeBaseItem) => {
  const plugin = await grpcFetchLocalPluginDetail({ Name: '构建知识库' }, true)
  const files = (targetKnowledgeBase.KnowledgeBaseFile?.map((it) => it.path) || []).join(',')
  const ExecParams = [
    { Key: 'files', Value: files },
    { Key: 'kbName', Value: targetKnowledgeBase.KnowledgeBaseName || 'default' },
    { Key: 'prompt', Value: targetKnowledgeBase.prompt ?? '' },
    { Key: 'entrylen', Value: `${targetKnowledgeBase.KnowledgeBaseLength ?? 1000}` },
    { Key: 'k', Value: '0' },
    { Key: 'kmin', Value: '2' },
    { Key: 'kmax', Value: '4' },
    { Key: 'chunk', Value: targetKnowledgeBase?.chunk ?? 'Medium' },
    { Key: 'concurrency', Value: `${targetKnowledgeBase?.concurrency ?? 10}` },
  ]
  const disableERM = {
    Key: 'disableERM',
    Value: `${targetKnowledgeBase.disableERM}`,
  }
  const executeParams: DebugPluginRequest = {
    Code: '',
    PluginType: plugin.Type,
    Input: '',
    HTTPRequestTemplate: { ...defPluginExecuteFormValue, IsHttpFlowId: false, HTTPFlowId: [] },
    ExecParams: targetKnowledgeBase.disableERM === 'true' ? ExecParams.concat(disableERM) : ExecParams,
    PluginName: plugin.ScriptName,
  }

  await apiDebugPlugin({
    params: executeParams,
    token: targetKnowledgeBase.streamToken,
    pluginCustomParams: plugin.Params,
    isShowStartInfo: false,
  })
}

const BuildingKnowledgeBaseEntry = async (targetKnowledgeBase: any, depth?: number) => {
  const plugin = await grpcFetchLocalPluginDetail({ Name: '构建知识条目' }, true)
  const executeParam = [
    {
      Key: 'kbName',
      Value: targetKnowledgeBase.KnowledgeBaseName!,
    },
    {
      Key: 'query',
      Value: targetKnowledgeBase.query ?? '',
    },
    {
      Key: 'entrylen',
      Value: targetKnowledgeBase.KnowledgeBaseLength ?? 1000,
    },
    {
      Key: 'k',
      Value: 0,
    },
    {
      Key: 'klimit',
      Value: 300,
    },
    {
      Key: 'kmin',
      Value: 2,
    },
    {
      Key: 'kmax',
      Value: 4,
    },
    // TODO 深度存在问题
    {
      Key: 'depth',
      Value: 0,
    },
    {
      Key: 'entityID',
      Value: targetKnowledgeBase.isAll ? '' : targetKnowledgeBase?.HiddenIndex,
    },
  ]
  const executeParams: any = {
    params: {
      Code: '',
      PluginType: 'yak',
      PluginName: '构建知识条目',
      ExecParams: executeParam,
    },
    pluginCustomParams: plugin?.Params,
  }
  await apiDebugPlugin({
    ...executeParams,
    token: targetKnowledgeBase.streamToken,
    isShowStartInfo: false,
  })
}

// 清空知识库插件调用所需参数
const ClearAllKnowledgeBase = (params: TClearKnowledgeResponse) => async (streamToken: string) => {
  const executeParams: DebugPluginRequest = {
    Code: '',
    PluginType: params.Type,
    Input: '',
    HTTPRequestTemplate: { ...defPluginExecuteFormValue, IsHttpFlowId: false, HTTPFlowId: [] },
    PluginName: params.ScriptName,
    ExecParams: [
      {
        Key: 'confirm',
        Value: 'true',
      },
    ],
  }
  await apiDebugPlugin({
    params: executeParams,
    token: streamToken,
    pluginCustomParams: params.Params,
    isShowStartInfo: false,
  })
}

const BuildingOnlineKnowledgeBase = async (params: any, streamToken: string) => {
  const executeParams: DebugPluginRequest = {
    Code: '',
    PluginType: params.Type,
    Input: '',
    HTTPRequestTemplate: { ...defPluginExecuteFormValue, IsHttpFlowId: false, HTTPFlowId: [] },
    PluginName: params.ScriptName,
    ExecParams: [
      {
        Key: 'rag-file-path',
        Value: params.rag_file_path,
      },
      {
        Key: 'rag-name',
        Value: params.rag_name,
      },
      {
        Key: 'rag-serial-version-uid',
        Value: params.rag_serial_version_uid,
      },
    ],
  }
  await apiDebugPlugin({
    params: executeParams,
    token: streamToken,
    pluginCustomParams: params.Params,
    isShowStartInfo: false,
  })
}

// 知识库可用性诊断
const checkAIModelAvailability = async (params, streamToken) => {
  const executeParams: DebugPluginRequest = {
    Code: '',
    PluginType: params.Type,
    Input: '',
    HTTPRequestTemplate: { ...defPluginExecuteFormValue, IsHttpFlowId: false, HTTPFlowId: [] },
    PluginName: params.ScriptName,
    ExecParams: [],
  }
  await apiDebugPlugin({
    params: executeParams,
    token: streamToken,
    pluginCustomParams: params.Params,
    isShowStartInfo: false,
  })
}

const documentType = [
  {
    label: 'Entities',
    value: 'entity',
  },
  {
    label: 'Relationships',
    value: 'relationship',
  },
  {
    label: 'Knowledge',
    value: 'knowledge',
  },
  {
    label: 'Graph',
    value: 'khop',
  },
  {
    label: 'Question Index',
    value: 'question_index',
  },
]

interface BackendEntity {
  ID: string
  Name: string
  HiddenIndex: string
  BaseIndex: string
  Type?: string
}

interface BackendRelationship {
  SourceEntityIndex: string
  TargetEntityIndex: string
  Attributes: { Key: string; Value: string }[]
  Type?: string
}

interface BackendData {
  Entities: BackendEntity[]
  Relationships: BackendRelationship[]
}

export interface GraphNode {
  id: string
  name: string
  category?: string
  symbolSize: number
  x: number
  y: number
  value: number
  fixed: boolean
}

export interface GraphLink {
  source: string
  target: string
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

const transformToGraphData = (data: BackendData): GraphData => {
  const total = data.Entities.length

  // map HiddenIndex → 连续 index
  const indexMap = new Map(data.Entities.map((entity, idx) => [entity.HiddenIndex, idx.toString()]))

  // 计算度数（决定节点大小）
  const degreeMap = new Map<string, number>()
  data.Entities.forEach((_, idx) => degreeMap.set(idx.toString(), 0))
  data.Relationships.forEach((rel) => {
    const s = indexMap.get(rel.SourceEntityIndex)
    const t = indexMap.get(rel.TargetEntityIndex)
    if (s && t) {
      degreeMap.set(s, (degreeMap.get(s) ?? 0) + 1)
      degreeMap.set(t, (degreeMap.get(t) ?? 0) + 1)
    }
  })

  // 构造节点
  const nodesTemp: GraphNode[] = data.Entities.map((entity, index) => {
    const degree = degreeMap.get(index.toString()) ?? 1
    const size = Math.log(degree + 1) * 10 + 10
    return {
      id: index.toString(),
      BaseIndex: entity?.BaseIndex,
      HiddenIndex: entity?.HiddenIndex,
      name: entity.Name ?? `Entity-${index}`,
      category: entity.Type ?? 'default',
      symbolSize: size,
      x: 0,
      y: 0,
      value: degree,
      fixed: true,
    }
  })

  // 最大节点设上限
  const maxSymbol = Math.max(...nodesTemp.map((n) => n.symbolSize))
  const maxSize = maxSymbol < 40 ? 40 : maxSymbol

  // 哪些是被指向的节点？其他节点放外围
  const targetIds = new Set(data.Relationships.map((rel) => indexMap.get(rel.TargetEntityIndex)).filter(Boolean))

  // 存放已分配位置，避免堆叠
  const occupiedPositions: { x: number; y: number; r: number }[] = []

  const isOverlapping = (x: number, y: number, r: number) => {
    return occupiedPositions.some((pos) => {
      const dx = pos.x - x
      const dy = pos.y - y
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance < pos.r + r + 20
    })
  }

  // 多层环状布局生成位置
  const generateLayeredPosition = (layerCount: number, idx: number, total: number) => {
    const nodesPerLayer = Math.ceil(total / layerCount)
    const layer = Math.floor(idx / nodesPerLayer)
    const angle = (idx % nodesPerLayer) * ((2 * Math.PI) / nodesPerLayer) + Math.random() * 0.5
    const radius = 200 + layer * 300 + Math.random() * 100 // 每层间距 300 + 随机扰动
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
  }

  const layerCount = Math.ceil(Math.sqrt(total)) // 根据总量设置层数

  // 生成最终节点位置
  const nodes: GraphNode[] = nodesTemp.map((node, idx) => {
    const isOuter = !targetIds.has(node.id)
    let x = 0,
      y = 0,
      size = node.symbolSize

    if (isOuter) {
      size = maxSize + Math.random() * 5
      let pos
      let attempt = 0
      do {
        const angle = Math.random() * 2 * Math.PI
        const radius = 1000 + idx * 15 + Math.random() * 300 // 外环半径更大
        pos = { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
        attempt++
      } while (isOverlapping(pos.x, pos.y, size) && attempt < 100)
      x = pos.x
      y = pos.y
    } else {
      let pos
      let attempt = 0
      do {
        pos = generateLayeredPosition(layerCount, idx, total)
        attempt++
      } while (isOverlapping(pos.x, pos.y, size) && attempt < 100)
      x = pos.x
      y = pos.y
    }

    occupiedPositions.push({ x, y, r: size })
    return { ...node, x, y, symbolSize: size }
  })

  // 生成边
  const links: GraphLink[] = data.Relationships.map((rel) => ({
    source: indexMap.get(rel.SourceEntityIndex) ?? '',
    target: indexMap.get(rel.TargetEntityIndex) ?? '',
  })).filter((l) => l.source && l.target)

  return { nodes, links }
}

const extractAddedHistory = <T extends { token: string }>(
  current: { historyGenerateKnowledgeList: T[] },
  previous: { historyGenerateKnowledgeList: T[] },
): T | null => {
  const currentList = current.historyGenerateKnowledgeList ?? []
  const previousTokens = new Set(previous.historyGenerateKnowledgeList?.map((item) => item.token))
  return currentList.find((item) => !previousTokens.has(item.token)) ?? null
}

const extractStreamTokenChangedItem = (currentList, previousList) => {
  const prevMap = new Map(previousList.map((item) => [item.ID, item.streamToken]))

  return (
    currentList.find((item) => {
      const prevToken = prevMap.get(item.ID)
      return prevToken !== undefined && prevToken !== item.streamToken
    }) ?? null
  )
}

const answerOptions = [
  {
    value: 'hypothetical_answer',
    label: 'Hypothetical Answer',
    // description: "这里是改模式的简短介绍"
  },
  {
    value: 'generalize_query',
    label: 'Generalized Answer',
    // description: "这里是改模式的简短介绍"
  },
  {
    value: 'split_query',
    label: 'Multiple Queries',
    // description: "这里是改模式的简短介绍"
  },
  {
    value: 'hypothetical_answer_with_split',
    label: 'Hypothetical + Multiple Queries',
    // description: "这里是改模式的简短介绍"
  },
]

const prioritizeProcessingItems = (items: Array<KnowledgeBaseItem & { CreatedFromUI?: boolean }>) => {
  return [...items].sort((a, b) => {
    const aIsProcessing = a.streamstep === 1 || a.streamstep === 2
    const bIsProcessing = b.streamstep === 1 || b.streamstep === 2

    if (aIsProcessing && !bIsProcessing) return -1
    if (!aIsProcessing && bIsProcessing) return 1

    // 保持稳定排序
    return 0
  })
}

const extractFileName = (filePath: string) => {
  if (!filePath) return ''

  // 兼容 win/mac
  const parts = filePath.split(/[/\\]/)
  const fullName = parts[parts.length - 1]

  return fullName.replace(/\.[^/.]+$/, '')
}

type KnowledgeBase = Record<string, any>

const DEFAULT_EXTRA = {
  streamstep: 'success' as 1 | 2 | 'success',
  addManuallyItem: false,
  historyGenerateKnowledgeList: [],
}

const mergeKnowledgeBaseList = (list1: KnowledgeBaseItem[], list2: KnowledgeBaseItem[]): KnowledgeBaseItem[] => {
  // 用 ID 构建 map，方便 O(1) 查找
  const map2 = new Map<string, KnowledgeBase>(list2.map((item) => [item.ID, item]))

  return list1.map((item1) => {
    const item2 = map2.get(item1.ID) || {}

    return {
      ...DEFAULT_EXTRA,
      ...item2,
      ...item1,
    }
  })
}

/** 获取消息中心数据 */
export const apiFetchQueryMessage: () => Promise<any> = () => {
  return new Promise((resolve, reject) => {
    try {
      NetWorkApi<{}, API.MessageLogResponse>({
        method: 'get',
        url: 'https://oss-qn.yaklang.com/rag/rags-latest.json',
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
        .finally(() => {})
    } catch (error) {
      reject(error)
    }
  })
}

export interface OnlieRageLatestResponse {
  name: string
  name_zh: string
  version: string
  file: string
  hashfile: string
  hashtype: string
  hash: string
  file_size: number
  installToken: string
}

// 获取线上知识库数据
export const apiFetchQueryOnlieRageLatest: () => Promise<any> = () => {
  return new Promise((resolve, reject) => {
    try {
      NetWorkApi<{}, OnlieRageLatestResponse[]>({
        method: 'get',
        url: 'https://oss-qn.yaklang.com/rag/rags-latest.json',
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
        .finally(() => {})
    } catch (error) {
      reject(error)
    }
  })
}

const stopList = [
  {
    title: 'AI Recall',
    description: 'Use this to verify whether generated knowledge-base content is accurate.',
    images: knowledgeJoyrideFirst,
  },
  {
    title: 'Generate Knowledge from Entities',
    description:
      'Select existing entities or knowledge to generate related knowledge again when the current content feels incomplete.',
    images: knowledgeJoyrideLast,
  },
  {
    title: 'Knowledge Graph Demo',
    description: 'Select entities to dynamically render a knowledge graph and inspect their relationships.',
    images: knowledgeJoyrideThree,
  },
]

// Joyride 步骤定义
const joyrideSteps: Step[] = [
  {
    target: '.first-step',
    disableBeacon: true,
    placement: 'right',
    spotlightPadding: 5,
    title: 'Add Model',
    content: (
      <div className={styles['joyride-steps-content']}>
        <div>
          Select a provider, enter the API key, and choose the model to use. (Note: a <span>vision model</span> is
          required.)
        </div>
        <div className={styles['joyride-steps-img-wrapper']}>
          <img src={joyrideFirstStepImg} alt="" style={{ width: '351px' }} />
        </div>
      </div>
    ),
  },
  {
    target: '.second-step',
    disableBeacon: true,
    spotlightPadding: 2,
    title: 'Knowledge Base Availability Check',
    content: (
      <div className={styles['joyride-steps-content']}>
        <div>After adding a model, run the availability check to verify whether it can generate a knowledge base.</div>
      </div>
    ),
  },
  {
    target: '.third-step',
    disableBeacon: true,
    spotlightPadding: 2,
    title: 'Create Knowledge Base',
    content: (
      <div className={styles['joyride-steps-content']}>
        <div>Enter a knowledge base name, then drag in files to create it.</div>
      </div>
    ),
  },
]

const downloadWithEvents = (invokeChannel: string, invokeArgs: any, token: string, onData?: (data: any) => void) => {
  return new Promise<void>((resolve, reject) => {
    let settled = false

    const safeResolve = () => {
      if (!settled) {
        settled = true
        resolve()
      }
    }

    const safeReject = (err) => {
      if (!settled) {
        settled = true
        reject(err)
      }
    }

    ipcRenderer.invoke(invokeChannel, invokeArgs, token).catch(safeReject)

    if (onData) {
      ipcRenderer.on(`${token}-data`, (_, data) => {
        console.log(data, 'data')
        onData(data)
      })
    }

    ipcRenderer.once(`${token}-end`, () => {
      safeResolve()
    })

    ipcRenderer.once(`${token}-error`, (_, error) => {
      safeReject(error)
    })
  })
}

const downloadOnlineRagWithEvents = (
  ragName: string | undefined,
  all: boolean,
  token: string,
  onData?: (data: any) => void,
) => {
  const invokeArgs = all ? { Force: true, All: true } : { RagName: ragName, Force: true, All: false }
  return downloadWithEvents('DownloadRAGs', invokeArgs, token, onData)
}

const exclude = ['llama-server', 'model-Qwen3-Embedding-0.6B-Q4']

type TValidatorFilePath = (_: RuleObject, value: string) => Promise<any>

const ValidatorFilePath: TValidatorFilePath = (_, value) => {
  if (!value) {
    return Promise.reject('Please upload a file')
  }

  const files = value.split(',').map((i) => i.trim())

  for (const file of files) {
    // 兼容 windows/mac
    const fileName = file.split('/').pop()?.split('\\').pop()

    // 必须存在扩展名
    const reg = /^.+\.[^.]+$/

    if (!fileName || !reg.test(fileName)) {
      return Promise.reject('Please upload a valid file')
    }
  }

  return Promise.resolve()
}

export {
  targetInstallList,
  getFileInfoList,
  createMenuList,
  manageMenuList,
  targetIcon,
  mergeKnowledgeBaseData,
  compareKnowledgeBaseChange,
  BuildingKnowledgeBase,
  BuildingKnowledgeBaseEntry,
  tableHeaderGroupOptions,
  apiSearchKnowledgeBaseEntry,
  apiListVectorStoreEntries,
  apiQueryEntity,
  documentType,
  findChangedObjects,
  transformToGraphData,
  extractAddedHistory,
  answerOptions,
  prioritizeProcessingItems,
  knowledgeTypeOptions,
  compareKnowledgeBaseChangeList,
  extractFileName,
  ClearAllKnowledgeBase,
  insertModaOptions,
  checkAIModelAvailability,
  mergeKnowledgeBaseList,
  totalKeyMap,
  BuildingOnlineKnowledgeBase,
  stopList,
  joyrideSteps,
  extractStreamTokenChangedItem,
  downloadWithEvents,
  downloadOnlineRagWithEvents,
  exclude,
  ValidatorFilePath,
}
