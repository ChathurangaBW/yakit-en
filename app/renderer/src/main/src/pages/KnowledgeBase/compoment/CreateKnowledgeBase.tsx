import React, { type FC } from 'react'

import { useUpdateEffect } from 'ahooks'
import { Collapse, Form } from 'antd'

import { YakitInput } from '@/components/yakitUI/YakitInput/YakitInput'
import { YakitSelect } from '@/components/yakitUI/YakitSelect/YakitSelect'

import { YakitInputNumber } from '@/components/yakitUI/YakitInputNumber/YakitInputNumber'
import { YakitFormDragger } from '@/components/yakitUI/YakitForm/YakitForm'

import type { FormInstance } from 'antd/es/form/Form'
import YakitCollapse from '@/components/yakitUI/YakitCollapse/YakitCollapse'
import styles from '../knowledgeBase.module.scss'
import { extractFileName, knowledgeTypeOptions, ValidatorFilePath } from '../utils'
import { useKnowledgeBase } from '../hooks/useKnowledgeBase'
import { YakitRadioButtons } from '@/components/yakitUI/YakitRadioButtons/YakitRadioButtons'
import classNames from 'classnames'

const CreateKnowledgeBase: FC<{ form: FormInstance<any>; type?: 'new' }> = ({ form, type }) => {
  const { knowledgeBases } = useKnowledgeBase()
  const KnowledgeBaseFileValue = Form.useWatch('KnowledgeBaseFile', form)
  const watchDisableERM = Form.useWatch('disableERM', form)

  useUpdateEffect(() => {
    const result = KnowledgeBaseFileValue
      ? KnowledgeBaseFileValue.split(/[/\\]/) // 按 / 或 \ 分割
          .pop()! // 最后一个就是文件名 + 扩展名
          .replace(/\.[^/.]+$/, '') // 去掉扩展名
      : undefined
    const getKnowledgeBaseName = form.getFieldValue('KnowledgeBaseName')
    if (result && (!getKnowledgeBaseName || getKnowledgeBaseName?.trim() === '')) {
      form.setFieldsValue({ KnowledgeBaseName: result })
    }
  }, [KnowledgeBaseFileValue])

  return (
    <Form
      form={form}
      layout="vertical"
      className={classNames(styles['create-knowledge-from'], styles['create-knowledge-from-container'])}
      initialValues={{ disableERM: 'true' }}
      onValuesChange={(changedValues) => {
        if (changedValues.importPath) {
          const fileName = extractFileName(changedValues.importPath)
          form.setFieldsValue({ knowledgeBaseName: fileName })
        }
      }}
    >
      <Form.Item
        label="Knowledge Base Name:"
        name="KnowledgeBaseName"
        required
        rules={[
          {
            validator: (_, value) => {
              if (!value || value.trim() === '') {
                return Promise.reject(new Error('Enter a knowledge base name'))
              }
              if (type !== 'new') {
                const exists = knowledgeBases.some((it) => it.KnowledgeBaseName === value)
                if (exists) {
                  return Promise.reject(new Error('Knowledge Base名称重复，请重新输入'))
                }
              }

              return Promise.resolve()
            },
          },
        ]}
      >
        <YakitInput placeholder="Enter a knowledge base name" />
      </Form.Item>

      <YakitFormDragger
        formItemProps={{
          name: 'KnowledgeBaseFile',
          label: 'Upload File',
          rules: [
            {
              validator: ValidatorFilePath,
            },
          ],
        }}
        renderType="textarea"
        textareaProps={{
          rows: 2,
        }}
        size="large"
        help="可将文件拖入框内或"
        selectType="file"
        multiple={true}
      />

      <Form.Item
        label="Build Mode"
        name="disableERM"
        help={
          watchDisableERM === 'true'
            ? '仅存储Knowledge和Vectors，不会存储Entities，构建速度更快'
            : '会存储Entities、Knowledge和Vectors全部内容，构建速度较慢'
        }
      >
        <YakitRadioButtons
          size="middle"
          buttonStyle="solid"
          options={[
            {
              value: 'false',
              label: 'Enhanced Knowledge Graph Index',
            },
            {
              value: 'true',
              label: 'Build Knowledge Index Only',
            },
          ]}
        />
      </Form.Item>

      <Form.Item label="Tags：" name="Tags">
        <YakitSelect mode="tags" placeholder="Please select" options={knowledgeTypeOptions} />
      </Form.Item>
      {type === 'new' ? (
        <React.Fragment>
          <Form.Item label="Supplemental Prompt:" name="prompt">
            <YakitInput placeholder="Enter a supplemental prompt" />
          </Form.Item>
          <Form.Item
            label="Description:"
            name="KnowledgeBaseDescription"
            rules={[{ max: 500, message: 'Description cannot exceed 500 characters' }]}
          >
            <YakitInput.TextArea maxLength={500} placeholder="Enter a description" rows={2} showCount />
          </Form.Item>

          <Form.Item label="Knowledge Entry Length Limit:" name="KnowledgeBaseLength" initialValue={300}>
            <YakitInputNumber />
          </Form.Item>
          <Form.Item label="Analysis Concurrency:" name="concurrency" initialValue={10}>
            <YakitInputNumber />
          </Form.Item>

          <Form.Item label="Chunk Size:" name="chunk" initialValue={'Medium'}>
            <YakitSelect
              options={[
                {
                  label: 'Ultra Fine 4k',
                  value: 'UltraFine',
                },
                {
                  label: 'Fine 10k',
                  value: 'Fine',
                },
                {
                  label: 'Medium 20k',
                  value: 'Medium',
                },
                {
                  label: 'Coarse 40k',
                  value: 'Coarse',
                },
              ]}
            />
          </Form.Item>
        </React.Fragment>
      ) : (
        <YakitCollapse bordered={false} className={styles['create-knowledge-configuration']}>
          <Collapse.Panel header="高级配置" key="1">
            <Form.Item label="Supplemental Prompt:" name="prompt">
              <YakitInput placeholder="Enter a supplemental prompt" />
            </Form.Item>
            <Form.Item
              label="Description:"
              name="KnowledgeBaseDescription"
              rules={[{ max: 500, message: 'Description cannot exceed 500 characters' }]}
            >
              <YakitInput.TextArea maxLength={500} placeholder="Enter a description" rows={3} showCount />
            </Form.Item>

            <Form.Item label="Knowledge Entry Length Limit:" name="KnowledgeBaseLength" initialValue={300}>
              <YakitInputNumber />
            </Form.Item>
            <Form.Item label="Analysis Concurrency:" name="concurrency" initialValue={10}>
              <YakitInputNumber />
            </Form.Item>

            <Form.Item label="Chunk Size:" name="chunk" initialValue={'Medium'}>
              <YakitSelect
                options={[
                  {
                    label: 'Ultra Fine 4k',
                    value: 'UltraFine',
                  },
                  {
                    label: 'Fine 10k',
                    value: 'Fine',
                  },
                  {
                    label: 'Medium 20k',
                    value: 'Medium',
                  },
                  {
                    label: 'Coarse 40k',
                    value: 'Coarse',
                  },
                ]}
              />
            </Form.Item>
          </Collapse.Panel>
        </YakitCollapse>
      )}
    </Form>
  )
}

export { CreateKnowledgeBase }
