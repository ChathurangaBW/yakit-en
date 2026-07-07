import { PluginLogTabInfo, PluginLogTypeToInfoProps } from './PluginLogType'
import {
  LogNodeStatusAuditFailedIcon,
  LogNodeStatusCommentIcon,
  LogNodeStatusDeleteIcon,
  LogNodeStatusInfoIcon,
  LogNodeStatusModifyIcon,
  LogNodeStatusNewIcon,
  LogNodeStatusRecoverIcon,
  LogNodeStatusSuccessIcon,
} from '@/assets/icon/colors'

import styles from './PluginLog.module.scss'

/** 插件日志-所有列表类型和对应名称 */
export const PluginLogTabBars: PluginLogTabInfo[] = [
  {
    key: 'all',
    name: 'All Logs',
  },
  {
    key: 'check',
    name: 'Review',
  },
  {
    key: 'update',
    name: 'Edit',
  },
  {
    key: 'comment',
    name: 'Comment',
  },
]

/** 日志类型-对应展示Info和样式类 */
export const PluginLogTypeToInfo: Record<string, PluginLogTypeToInfoProps> = {
  submit: {
    key: 'submit',
    content: 'Create Plugin',
    className: styles['plugin-log-type-info'],
    icon: <LogNodeStatusNewIcon />,
  },
  applyMerge: {
    key: 'applyMerge',
    content: 'Request Plugin Edit',
    className: styles['plugin-log-type-info'],
    icon: <LogNodeStatusModifyIcon />,
  },
  mergePass: {
    key: 'mergePass',
    content: 'Merged',
    className: styles['plugin-log-type-success'],
    icon: <LogNodeStatusSuccessIcon />,
  },
  mergeNoPass: {
    key: 'mergeNoPass',
    content: 'Rejected',
    className: styles['plugin-log-type-failed'],
    icon: <LogNodeStatusAuditFailedIcon />,
  },
  update: {
    key: 'update',
    content: 'Edit Plugin',
    className: styles['plugin-log-type-info'],
    icon: <LogNodeStatusModifyIcon />,
  },
  checkPass: {
    key: 'checkPass',
    content: 'Review Approved',
    className: styles['plugin-log-type-success'],
    icon: <LogNodeStatusSuccessIcon />,
  },
  checkNoPass: {
    key: 'checkNoPass',
    content: 'Review Rejected',
    className: styles['plugin-log-type-failed'],
    icon: <LogNodeStatusAuditFailedIcon />,
  },
  delete: {
    key: 'delete',
    content: 'Delete Plugin',
    className: styles['plugin-log-type-info'],
    icon: <LogNodeStatusDeleteIcon />,
  },
  recover: {
    key: 'recover',
    content: 'Restore Plugin',
    className: styles['plugin-log-type-info'],
    icon: <LogNodeStatusRecoverIcon />,
  },
  comment: {
    key: 'comment',
    content: 'Post Comment',
    className: styles['plugin-log-type-comment'],
    icon: <LogNodeStatusCommentIcon />,
  },
  reply: {
    key: 'reply',
    content: 'Reply',
    className: styles['plugin-log-type-comment'],
    icon: <LogNodeStatusCommentIcon />,
  },
  default: {
    key: 'default',
    content: 'Unknown Log',
    className: styles['plugin-log-type-info'],
    icon: <LogNodeStatusInfoIcon />,
  },
}
