import { YakitDrawer } from '@/components/yakitUI/YakitDrawer/YakitDrawer'
import { useMemoizedFn } from 'ahooks'
import { Form } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './CodeScanExtraParamsDrawer.module.scss'
import { YakitInputNumber } from '@/components/yakitUI/YakitInputNumber/YakitInputNumber'
import { YakitSwitch } from '@/components/yakitUI/YakitSwitch/YakitSwitch'
export interface CodeScanExtraParam {
  Concurrency: number
  Memory: boolean
}

interface CodeScanExtraParamsDrawerProps {
  extraParamsValue: CodeScanExtraParam
  visible: boolean
  onSave: (v: CodeScanExtraParam) => void
}

const CodeScanExtraParamsDrawer: React.FC<CodeScanExtraParamsDrawerProps> = React.memo((props) => {
  const { extraParamsValue, visible, onSave } = props
  const [form] = Form.useForm()
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ ...extraParamsValue })
    }
  }, [visible, extraParamsValue])

  const onClose = useMemoizedFn(() => {
    const formValue = form.getFieldsValue()
    form.validateFields().then(() => {
      onSave(formValue)
    })
  })

  return (
    <YakitDrawer
      className={styles['code-scan-execute-extra-params-drawer']}
      visible={visible}
      onClose={onClose}
      width="40%"
      title="Additional Parameters"
    >
      <Form labelWrap={true} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={form} style={{ marginBottom: 8 }}>
        <Form.Item label="Concurrency" name="Concurrency" initialValue={5}>
          <YakitInputNumber type="horizontal" min={1} />
        </Form.Item>
        <Form.Item
          label="Memory Scan"
          name="Memory"
          tooltip="Memory scan stores only vulnerabilities and does not store process data"
        >
          <YakitSwitch size="large" checkedChildren="On" unCheckedChildren="Off" />
        </Form.Item>
      </Form>
      <div className={styles['to-end']}>You have reached the end.</div>
    </YakitDrawer>
  )
})

export default CodeScanExtraParamsDrawer
