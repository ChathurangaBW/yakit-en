import { yakitClipboard } from './electronBridge'
import { yakitNotify } from './notification'

interface SetClipboardTextExtraParams {
  /** 是否隐藏Copied successfullyPrompt */
  hiddenHint?: boolean
  /** Copied successfullyPrompt信息(默认: Copied successfully) */
  hintText?: string
  /** Copied successfully后的回调 */
  successCallback?: () => void
  /** 复制失败后的回调 */
  failedCallback?: () => void
  /** 执行完后的回调 */
  finalCallback?: () => void
}
/**
 * @name 设置剪切板文本信息
 * @param text 复制到剪切板的文本信息
 * @param extra 复制功能的额外配置
 */
export const setClipboardText = (text?: string, extra?: SetClipboardTextExtraParams) => {
  const { hiddenHint, hintText, successCallback, failedCallback, finalCallback } = extra || {}
  if (text) {
    yakitClipboard
      .setText(text)
      .then(() => {
        if (!hiddenHint) yakitNotify('success', hintText || 'Copied successfully')
        successCallback && successCallback()
      })
      .catch(() => {
        failedCallback && failedCallback()
      })
      .finally(() => {
        finalCallback && finalCallback()
      })
  } else {
    finalCallback && finalCallback()
  }
}

/** 获取剪切板文本信息 */
export const getClipboardText = async () => {
  try {
    return ((await yakitClipboard.getText()) || '') as string
  } catch (error) {
    return ''
  }
}
