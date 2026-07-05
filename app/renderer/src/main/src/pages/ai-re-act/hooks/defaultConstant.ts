import { cloneDeep } from 'lodash'
import type { AIToolResult, PlanItemDetailsData, TodoListCardData } from './aiRender'
import type { AIOutputI18n, AIAgentGrpcApi } from './grpcApi'
import type { AIQuestionQueues, PlanLoadingStatus, CurrentExecTaskTree } from './type'

/** 工具ExecuteResult-默认值 */
export const DefaultAIToolResult: AIToolResult = {
  type: 'create',
  callToolId: '',
  toolName: '-',
  toolDescription: '',
  startTime: 0,
  startTimeMS: 0,
  endTime: 0,
  endTimeMS: 0,
  durationMS: 0,
  durationSeconds: 0,
  stream: { EventUUID: '' },
  tool: {
    status: 'default',
    summary: '',
    toolStdoutContent: {
      content: '',
      isShowAll: false,
    },
    execError: '',
    dirPath: '',
    resultDetails: '',
    reason: '',
  },
  httpFlowDataCount: 0,
  riskFlowDataCount: 0,
  isProcessingParams: false,
}
/** 工作ExecuteResultSummary-不同阶段的默认展示内容 */
export const DefaultToolResultSummary: Record<string, { wait: string; result: string }> = {
  failed: { wait: '获取失败原因中...', result: 'Execute失败' },
  success: { wait: 'ExecuteResult正在Summary中...', result: 'Execute成功' },
  user_cancelled: { wait: 'Tool Calls取消中...', result: '用户取消' },
}

/** AI 流式输出中, NodeId 对应展示的内容 */
const AIStreamNodeIdToLabel: Record<string, { label: string }> = {
  're-act-loop': { label: 'Reasoning and Action' },
  'call-forge': { label: 'Smart App' },
  'call-tools': { label: 'Tool Calls' },
  review: { label: 'Review System' },
  liteforge: { label: 'Lightweight Smart App' },
  directly_answer: { label: 'Direct Answer' },
  'memory-reducer': { label: 'Memory Trimming' },
  'memory-timeline': { label: 'Memory Condensation' },
  execute: { label: 'Execute' },
  summary: { label: 'Summary' },
  'create-subtasks': { label: 'Create Subtasks' },
  'freedom-plan-review': { label: 'Plan Review' },
  'dynamic-plan': { label: 'Dynamic Planning' },
  're-act-verify': { label: 'Verify Result' },
  result: { label: 'Result Output' },
  plan: { label: 'Task Planning' },
  decision: { label: 'Decision' },
  output: { label: 'General Output' },
  forge: { label: 'Smart App' },
  're-act-loop-thought': { label: 'Thinking' },
  're-act-loop-answer-payload': { label: 'AI Response' },
  'enhance-query': { label: 'Knowledge Enhancement' },
}
/** 传入 NodeId, 输出展示内容的18n 结构 */
export const convertNodeIdToVerbose = (nodeId: string) => {
  const label = AIStreamNodeIdToLabel[nodeId]?.label || nodeId
  const verbose18n: AIOutputI18n = {
    Zh: label,
    En: label,
  }
  return verbose18n
}

/** AI 判断 review 的风险阈值Severity对应的展示内容 */
export const AIReviewJudgeLevelMap: Record<string, { label: string }> = {
  low: { label: 'Auto-Approve Low Risk' },
  middle: { label: 'Wait for User Veto' },
  high: { label: 'Manual Confirmation Required' },
}

/**流内容的展示Type枚举 */
export enum AIStreamContentType {
  /** 默认 */
  DEFAULT = 'default',
  /** md格式 */
  TEXT_MARKDOWN = 'text/markdown',
  /** 卡片/多行 */
  TEXT_PLAIN = 'text/plain',
  /** tool 紫色卡片 */
  LOG_TOOL = 'log/tool',
  /** tool 错误输出 */
  LOG_TOOL_ERROR_OUTPUT = 'log/tool-error-output',

  //TIP - 下面Type都展示为编辑器,截取后面得type为编辑器的语言TypeType, 例如 code/yaklang 展示为编辑器, 编辑器Type为 yak
  /** YakitEditor */
  CODE_YAKLANG = 'code/yaklang',
  /** YakitEditor */
  CODE_PYTHON = 'code/python',
  /** 请求包 */
  CODE_HTTP_REQUEST = 'code/http-request',
  /** 代码/语法 */
  TEXT_SYNTAXFLOW = 'text/syntaxflow',
}

/** 问题队列-默认值 */
export const DefaultAIQuestionQueues: AIQuestionQueues = {
  total: 0,
  data: [],
}

/** 记忆列表默认值 */
export const DefaultMemoryList: AIAgentGrpcApi.MemoryEntryList = {
  memories: [],
  memory_pool_limit: 0,
  memory_session_id: 'default',
  total_memories: 0,
  total_size: 0,
  score_overview: {
    A_total: 0,
    C_total: 0,
    E_total: 0,
    O_total: 0,
    P_total: 0,
    R_total: 0,
    T_total: 0,
  },
}

/** Task Planningloading-默认值 */
export const DefaultPlanLoadingStatus: PlanLoadingStatus = {
  loading: false,
  plan: '加载中...',
  task: '加载中...',
}

export const DefaultPlanHistoryList: AIAgentGrpcApi.PlanHistoryList = {
  records: [],
  total: 0,
  session_id: '',
}

/** 当前正在Execute的任务树 */
export const DefaultCurrentExecTaskTree: CurrentExecTaskTree = {
  task_tree: [],
  root_task_name: '',
}

/** 待办清单卡片数据-默认值 */
export const DefaultTodoListCardData: TodoListCardData = {
  items: [],
  stats: {
    deleted: 0,
    doing: 0,
    done: 0,
    pending: 0,
    skipped: 0,
  },
  uuid: '',
}

export const DefaultPlanItemDetailsData: PlanItemDetailsData = {
  uuid: '',
  taskId: '',
  todoList: { ...DefaultTodoListCardData },
  tool: {
    fixed: [],
    dynamic: [],
  },
  forges: {
    fixed: [],
    dynamic: [],
  },
  skills: {
    fixed: [],
    dynamic: [],
  },
  plugins: {
    fixed: [],
    dynamic: [],
  },
  mcp: {
    fixed: [],
    dynamic: [],
  },
  mcpServices: {
    fixed: [],
    dynamic: [],
  },
  perception: {
    summary: '',
    topics: [],
    keywords: [],
    changed: false,
    confidence: 0,
    trigger: '',
    epoch: 0,
    intent_shift: 'none',
    timestamp: 0,
  },
  execution: {
    task_name: '',
    status: '',
    started_at: 0,
    ended_at: 0,
    tool_call_success: 0,
    tool_call_failed: 0,
    tool_call_total: 0,
    execution_minutes: 0,
    http_flow_count: 0,
    risk_count: 0,
    modified_file_count: 0,
  },
  backgroundProcesses: [],
}
