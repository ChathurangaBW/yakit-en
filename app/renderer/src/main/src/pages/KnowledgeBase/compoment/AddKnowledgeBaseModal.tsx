import { YakitFormDragger } from '@/components/yakitUI/YakitForm/YakitForm'
import { YakitInput } from '@/components/yakitUI/YakitInput/YakitInput'
import { YakitInputNumber } from '@/components/yakitUI/YakitInputNumber/YakitInputNumber'
import { YakitModal } from '@/components/yakitUI/YakitModal/YakitModal'
import { Collapse, Form } from 'antd'
import { Dispatch, FC, SetStateAction } from 'react'
import { getFileInfoList, ValidatorFilePath } from '../utils'
import { randomString } from '@/utils/randomUtil'
import { useKnowledgeBase } from '../hooks/useKnowledgeBase'
import { success } from '@/utils/notification'
import { YakitRadioButtons } from '@/components/yakitUI/YakitRadioButtons/YakitRadioButtons'
import styles from '../knowledgeBase.module.scss'
import { YakitSelect } from '@/components/yakitUI/YakitSelect/YakitSelect'
import YakitCollapse from '@/components/yakitUI/YakitCollapse/YakitCollapse'

interface AddKnowledgeBaseModalProps {
  addModalData: { visible: boolean; KnowledgeBaseName: string }
  setAddModalData: Dispatch<
    SetStateAction<{
      visible: boolean
      KnowledgeBaseName: string
    }>
  >
  addManuallyItem?: boolean
}

const AddKnowledgeBaseModal: FC<AddKnowledgeBaseModalProps> = ({
  addModalData,
  setAddModalData,
  addManuallyItem = true,
}) => {
  const [form] = Form.useForm()
  const { editKnowledgeBase, knowledgeBases } = useKnowledgeBase()
  const watchDisableERM = Form.useWatch('disableERM', form)

  const onOk = async () => {
    const findKnowledgeBase = knowledgeBases.find((it) => it.KnowledgeBaseName === addModalData.KnowledgeBaseName)
    const resultFormData = await form.validateFields()
    const file = getFileInfoList(resultFormData.KnowledgeBaseFile)

    const streamToken = randomString(50)
    const transformFormData = {
      ...resultFormData,
      ...findKnowledgeBase,
      KnowledgeBaseLength: resultFormData.KnowledgeBaseLength,
      KnowledgeBaseFile: file,
      streamToken,
      streamstep: 1,
      addManuallyItem,
      historyGenerateKnowledgeList: [],
    }
    if (findKnowledgeBase?.ID) {
      editKnowledgeBase(findKnowledgeBase?.ID, transformFormData)
      setAddModalData({
        visible: false,
        KnowledgeBaseName: '',
      })
      form.resetFields()
      success('AddKnowledge成功')
    }
  }
  const onCancel = () => {
    form.resetFields()
    setAddModalData({ visible: false, KnowledgeBaseName: '' })
  }
  return (
    <YakitModal
      title="Add"
      visible={addModalData.visible}
      onCancel={onCancel}
      onOk={onOk}
      className={styles['create-knowledge-from']}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ disableERM: 'true' }}
        className={styles['create-knowledge-from-container']}
      >
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
          </Collapse.Panel>
        </YakitCollapse>
      </Form>
    </YakitModal>
  )
}

export { AddKnowledgeBaseModal }
