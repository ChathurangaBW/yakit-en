import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import { VectorStoreEntry } from '../TKnowledgeBase'
import { YakitDrawer } from '@/components/yakitUI/YakitDrawer/YakitDrawer'
import classNames from 'classnames'
import styles from '../knowledgeBase.module.scss'
import { Descriptions } from 'antd'
import { useRequest } from 'ahooks'
import { useTheme } from '@/hook/useTheme'
import { YakitTag } from '@/components/yakitUI/YakitTag/YakitTag'
import { SafeMarkdown } from '@/pages/assetViewer/reportRenders/markdownRender'

const { ipcRenderer } = window.require('electron')

interface VectorDetailDrawerProps {
  openVectorDetailDrawerData: {
    vectorDetailModalVisible: boolean
    selectedVectorDetail?: VectorStoreEntry | undefined
  }
  setOpenVectorDetailDrawerData: Dispatch<
    SetStateAction<{
      vectorDetailModalVisible: boolean
      selectedVectorDetail?: VectorStoreEntry
    }>
  >
  knowledgeBaseId: string
}

const VectorDetailDrawer: FC<VectorDetailDrawerProps> = ({
  openVectorDetailDrawerData,
  setOpenVectorDetailDrawerData,
  knowledgeBaseId,
}) => {
  const { theme } = useTheme()

  const { data: entryDocument, run } = useRequest(
    async () => {
      const result = await ipcRenderer.invoke('GetDocumentByVectorStoreEntryID', {
        ID: openVectorDetailDrawerData.selectedVectorDetail?.ID,
      })
      return result?.Document
    },
    {
      manual: true,
    },
  )

  useEffect(() => {
    openVectorDetailDrawerData.vectorDetailModalVisible && openVectorDetailDrawerData.selectedVectorDetail?.ID && run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openVectorDetailDrawerData.selectedVectorDetail])

  return (
    <YakitDrawer
      placement="right"
      width="80%"
      onClose={() => setOpenVectorDetailDrawerData((preValue) => ({ ...preValue, vectorDetailModalVisible: false }))}
      visible={openVectorDetailDrawerData.vectorDetailModalVisible}
      title={'Vector Details'}
      maskClosable={true}
      destroyOnClose={true}
      footer={null}
      className={classNames(styles['vector-detail-drawer'])}
    >
      <div className={styles['vector-drawer-container']}>
        <div className={styles['vector-drawer-box']}>
          <div className={styles['title']}>Basic Information</div>
          <div className={styles['box-content']}>
            <Descriptions bordered column={5}>
              <Descriptions.Item label="Entry ID">
                {openVectorDetailDrawerData.selectedVectorDetail?.ID ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Collection ID">{knowledgeBaseId}</Descriptions.Item>
              <Descriptions.Item label="Vector Dimensions">
                {openVectorDetailDrawerData.selectedVectorDetail?.Embedding
                  ? openVectorDetailDrawerData.selectedVectorDetail.Embedding.length
                  : 0}
              </Descriptions.Item>
              <Descriptions.Item label="Content Length">
                {openVectorDetailDrawerData.selectedVectorDetail?.Content
                  ? openVectorDetailDrawerData.selectedVectorDetail.Content.length
                  : 0}{' '}
                字符
              </Descriptions.Item>
              <Descriptions.Item label="Metadata Length">
                {openVectorDetailDrawerData.selectedVectorDetail?.Metadata
                  ? openVectorDetailDrawerData.selectedVectorDetail.Metadata.length
                  : 0}{' '}
                字符
              </Descriptions.Item>
              <Descriptions.Item label="UID" span={4}>
                {openVectorDetailDrawerData.selectedVectorDetail?.UID ?? '-'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <div className={styles['vector-drawer-box']}>
          <div className={styles['title']}>Content Preview</div>
          <SafeMarkdown
            source={openVectorDetailDrawerData.selectedVectorDetail?.Content}
            className={classNames(styles['box-content'], styles['markdown-box'])}
          />
        </div>
        <div className={styles['vector-drawer-box']}>
          <div className={styles['title']}>Metadata</div>
          <SafeMarkdown
            source={openVectorDetailDrawerData.selectedVectorDetail?.Metadata}
            className={classNames(styles['box-content'], styles['markdown-box'])}
          />
        </div>
        {entryDocument ? (
          <div className={styles['vector-drawer-box']}>
            <div className={styles['title']}>Related Knowledge Base Entry</div>
            <div className={styles['box-content']}>
              <Descriptions bordered column={3}>
                <Descriptions.Item label="Title:" span={2}>
                  {entryDocument?.KnowledgeTitle ?? '-'}
                </Descriptions.Item>

                <Descriptions.Item label="Type:">{entryDocument?.KnowledgeType ?? '-'}</Descriptions.Item>

                <Descriptions.Item label="Importance:">{entryDocument?.ImportanceScore ?? '-'}</Descriptions.Item>

                <Descriptions.Item label="Source Page:">{entryDocument?.SourcePage ?? '-'}</Descriptions.Item>

                <Descriptions.Item label="Potential Issues:">
                  {entryDocument?.PotentialQuestions?.join('; ') ?? '-'}
                </Descriptions.Item>

                <Descriptions.Item label="Detailed Content" span={3}>
                  {entryDocument.KnowledgeDetails ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Summary:" span={3}>
                  {entryDocument?.Summary ?? '-'}
                </Descriptions.Item>

                <Descriptions.Item label="Keywords:" span={3}>
                  {entryDocument?.Keywords?.join(', ') ?? '-'}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        ) : null}
        <div className={classNames(styles['vector-drawer-box'])}>
          <div className={styles['title']}>Vector Data (First 20 Dimensions)</div>
          {openVectorDetailDrawerData.selectedVectorDetail?.Embedding &&
          openVectorDetailDrawerData.selectedVectorDetail?.Embedding.length > 0 ? (
            <div className={classNames(styles['box-content'], styles['vector-drawer-tag'])}>
              <div className={styles['vector-display']}>
                {openVectorDetailDrawerData.selectedVectorDetail.Embedding.slice(0, 20).map((value, index) => (
                  <YakitTag key={index} size="small">
                    {index}: {typeof value === 'number' ? value.toFixed(6) : value}
                  </YakitTag>
                ))}
                {openVectorDetailDrawerData.selectedVectorDetail.Embedding.length > 20 && (
                  <YakitTag size="small">
                    ...还有 {openVectorDetailDrawerData.selectedVectorDetail.Embedding.length - 21}维
                  </YakitTag>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </YakitDrawer>
  )
}

export { VectorDetailDrawer }
