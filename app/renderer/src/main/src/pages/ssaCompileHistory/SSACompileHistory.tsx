import React, { useEffect, useRef, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { failed, success, yakitFailed } from '@/utils/notification'
import { YakitButton } from '@/components/yakitUI/YakitButton/YakitButton'
import { genDefaultPagination, QueryGeneralResponse } from '../invoker/schema'
import { formatTimestamp } from '@/utils/timeUtil'
import classNames from 'classnames'
import { Divider, Tooltip } from 'antd'
import {
  OutlineArrowcirclerightIcon,
  OutlineRefreshIcon,
  OutlineSearchIcon,
  OutlineTrashIcon,
} from '@/assets/icon/outline'
import { TrashIcon } from '@/assets/newIcon'
import { YakitRoute } from '@/enums/yakitRoute'
import emiter from '@/utils/eventBus/eventBus'
import { SSAProgram } from '../yakRunnerScanHistory/YakRunnerScanHistory'
import { AuditCodePageInfoProps } from '@/store/pageInfo'
import styles from './SSACompileHistory.module.scss'
import { YakitVirtualList } from '@/components/yakitUI/YakitVirtualList/YakitVirtualList'
import { VirtualListColumns } from '@/components/yakitUI/YakitVirtualList/YakitVirtualListType'
import { YakitInput } from '@/components/yakitUI/YakitInput/YakitInput'
import { YakitTag } from '@/components/yakitUI/YakitTag/YakitTag'
import { YakitHint } from '@/components/yakitUI/YakitHint/YakitHint'
import { Paging } from '@/utils/yakQueryHTTPFlow'
import { IRifyUpdateProjectManagerModal } from '../YakRunnerProjectManager/YakRunnerProjectManager'
import { YakitCheckbox } from '@/components/yakitUI/YakitCheckbox/YakitCheckbox'

const { ipcRenderer } = window.require('electron')

interface SSAProgramFilter {
  ProgramNames?: string[]
  Languages?: string[]
  Ids?: number[]
  BeforeUpdatedAt?: number
  AfterUpdatedAt?: number
  Keyword?: string
  AfterID?: number
  BeforeID?: number
  ProjectIds?: number[]
}

interface QuerySSAProgramRequest {
  Pagination: Paging
  Filter: SSAProgramFilter
}

interface DeleteSSAProgramRequest {
  DeleteAll?: boolean
  Filter?: SSAProgramFilter
}

interface SSACompileHistoryProps {}

const SSACompileHistory: React.FC<SSACompileHistoryProps> = (props) => {
  const [params, setParams] = useState<SSAProgramFilter>({
    Keyword: '',
  })
  const [pagination, setPagination] = useState<Paging>({
    ...genDefaultPagination(20),
    Order: 'desc',
    OrderBy: 'updated_at',
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<SSAProgram[]>([])
  const [total, setTotal] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [refresh, setRefresh] = useState<boolean>(false)

  const [isAllSelect, setIsAllSelect] = useState<boolean>(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [deleteParams, setDeleteParams] = useState<{
    title: string
    params: DeleteSSAProgramRequest
  }>()
  const [isAllowIRifyUpdate, setIsAllowIRifyUpdate] = useState<boolean>(false)
  const [filterNoProject, setFilterNoProject] = useState<boolean>(false)

  const isGrpcRef = useRef<boolean>(false)
  const afterId = useRef<number>()

  useEffect(() => {
    update(true)
  }, [])

  const onSelectAll = useMemoizedFn(() => {
    if (isAllSelect) {
      setIsAllSelect(false)
      setSelectedRowKeys([])
    } else {
      setIsAllSelect(true)
      setSelectedRowKeys(data.map((item) => item.Id))
    }
  })

  const onSelectChange = useMemoizedFn((c: boolean, keys: string, rows: SSAProgram) => {
    if (c) {
      setSelectedRowKeys([...selectedRowKeys, rows.Id])
    } else {
      setIsAllSelect(false)
      const newSelectedRowKeys = selectedRowKeys.filter((ele) => ele !== rows.Id)
      setSelectedRowKeys(newSelectedRowKeys)
    }
  })

  const update = useMemoizedFn(async (reload?: boolean, page?: number, limit?: number) => {
    if (isGrpcRef.current) return
    isGrpcRef.current = true
    const paginationProps = {
      ...pagination,
      Page: page || 1,
      Limit: limit || pagination.Limit,
    }
    if (reload) {
      afterId.current = undefined
      setLoading(true)
      setRefresh(!refresh)
    }

    const finalParams = {
      ...params,
      ...(filterNoProject ? { ProjectIds: [0] } : {}),
    }

    ipcRenderer
      .invoke('QuerySSAPrograms', {
        Filter: finalParams,
        Pagination: { ...paginationProps, AfterId: reload ? undefined : parseInt(afterId.current + '') },
      })
      .then((item: QueryGeneralResponse<SSAProgram>) => {
        const newData = reload ? item.Data : data.concat(item.Data)
        const isMore = item.Data.length < item.Pagination.Limit || newData.length === total
        setHasMore(!isMore)
        if (isAllSelect) setSelectedRowKeys(newData.map((item) => item.Id))
        setData(newData)
        setPagination(item.Pagination || genDefaultPagination(20))
        if (reload) {
          setTotal(item.Total)
        } else {
          getTotalFun()
        }
      })
      .catch((e) => {
        yakitFailed('获取列表数据失败：' + e, true)
      })
      .finally(() =>
        setTimeout(() => {
          setLoading(false)
          isGrpcRef.current = false
        }, 300),
      )
  })

  const getTotalFun = useMemoizedFn(() => {
    const paginationProps = {
      ...pagination,
      Page: 1,
      Limit: pagination.Limit,
    }
    const finalParams = {
      ...params,
      ...(filterNoProject ? { ProjectIds: [0] } : {}),
    }
    ipcRenderer
      .invoke('QuerySSAPrograms', {
        Filter: finalParams,
        Pagination: paginationProps,
      })
      .then((item: QueryGeneralResponse<SSAProgram>) => {
        setTotal(item.Total)
      })
  })

  const onDelete = useMemoizedFn(async (params: DeleteSSAProgramRequest) => {
    try {
      setLoading(true)
      ipcRenderer.invoke('DeleteSSAPrograms', params).then(() => {
        update(true)
        setIsAllSelect(false)
        setSelectedRowKeys([])
        setDeleteParams(undefined)
        success('删除成功')
      })
    } catch (error) {
      setLoading(false)
      failed(`删除失败${error}`)
    }
  })

  const columns: VirtualListColumns<SSAProgram>[] = [
    {
      title: 'Program Name',
      dataIndex: 'Name',
      render: (text) => {
        return (
          <Tooltip title={text}>
            <div className={classNames('yakit-content-single-ellipsis', styles['audit-text'])}>{text}</div>
          </Tooltip>
        )
      },
    },
    {
      title: 'Language',
      dataIndex: 'Language',
      width: 120,
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      render: (text) => {
        return (
          <Tooltip title={text} overlayClassName={styles['tooltip-line-feed']}>
            <div className={classNames('yakit-content-single-ellipsis', styles['audit-text'])}>{text || '-'}</div>
          </Tooltip>
        )
      },
    },
    {
      title: 'Updated At',
      dataIndex: 'UpdateAt',
      width: 180,
      render: (text) => <div>{text === 0 ? '-' : formatTimestamp(text)}</div>,
    },
    {
      title: 'Critical',
      dataIndex: 'CriticalRiskNumber',
      render: (text) => {
        try {
          const countNum = parseInt(text + '')
          return <>{countNum !== 0 ? <YakitTag color="danger">{countNum}</YakitTag> : '-'}</>
        } catch (error) {
          return '-'
        }
      },
      width: 80,
    },
    {
      title: 'High',
      dataIndex: 'HighRiskNumber',
      render: (text) => {
        try {
          const countNum = parseInt(text + '')
          return <>{countNum !== 0 ? <YakitTag color="warning">{countNum}</YakitTag> : '-'}</>
        } catch (error) {
          return '-'
        }
      },
      width: 80,
    },
    {
      title: 'Medium',
      dataIndex: 'WarnRiskNumber',
      render: (text) => {
        try {
          const countNum = parseInt(text + '')
          return <>{countNum !== 0 ? <YakitTag color="info">{countNum}</YakitTag> : '-'}</>
        } catch (error) {
          return '-'
        }
      },
      width: 80,
    },
    {
      title: 'Low',
      dataIndex: 'LowRiskNumber',
      render: (text) => {
        try {
          const countNum = parseInt(text + '')
          return <>{countNum !== 0 ? <YakitTag color="success">{countNum}</YakitTag> : '-'}</>
        } catch (error) {
          return '-'
        }
      },
      width: 80,
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      width: 120,
      render: (text, record) => {
        return (
          <div className={styles['audit-opt']} onClick={(e) => e.stopPropagation()}>
            <Tooltip title={'Open Project'}>
              <YakitButton
                type="text"
                icon={<OutlineArrowcirclerightIcon />}
                onClick={(e) => {
                  e.stopPropagation()
                  const params: AuditCodePageInfoProps = {
                    Schema: 'syntaxflow',
                    Location: record.Name,
                    Path: `/`,
                  }
                  emiter.emit(
                    'openPage',
                    JSON.stringify({
                      route: YakitRoute.YakRunner_Audit_Code,
                      params,
                    }),
                  )
                }}
              />
            </Tooltip>
            <YakitButton
              type="text"
              danger
              icon={<OutlineTrashIcon />}
              onClick={(e) => {
                e?.stopPropagation()
                setDeleteParams({
                  title: `Confirm deletion of ${record.Name}?`,
                  params: {
                    Filter: {
                      Ids: [record.Id],
                    },
                  },
                })
              }}
            />
          </div>
        )
      },
    },
  ]

  const loadMoreData = useMemoizedFn(() => {
    if (data.length > 0) {
      afterId.current = data[data.length - 1].Id
      update()
    }
  })

  return (
    <div className={styles['ssa-compile-history']} id="ssa-compile-history">
      <div className={styles['header']}>
        <div className={styles['main']}>
          <div className={styles['title']}>SSA Project Compile History</div>
          <div className={styles['sub-title']}>
            <div className={styles['text']}>Total</div>
            <div className={styles['number']}>{total}</div>
          </div>
          <Divider type={'vertical'} style={{ margin: 0 }} />
          <div className={styles['sub-title']}>
            <div className={styles['text']}>Selected</div>
            <div className={styles['number']}>{selectedRowKeys.length}</div>
          </div>
        </div>
        <div className={styles['extra']}>
          <YakitCheckbox
            checked={filterNoProject}
            onChange={(e) => {
              setFilterNoProject(e.target.checked)
              setTimeout(() => {
                update(true)
              }, 100)
            }}
          >
            仅显示无项目配置
          </YakitCheckbox>

          <YakitInput.Search
            prefix={<OutlineSearchIcon className={styles['search-icon']} />}
            placeholder="Search by keyword"
            value={params.Keyword}
            onChange={(e) => {
              setParams({ ...params, Keyword: e.target.value })
            }}
            onSearch={() => {
              setTimeout(() => {
                update(true)
              }, 100)
            }}
          />

          <YakitButton
            type="outline1"
            colors="danger"
            icon={<TrashIcon />}
            onClick={() => {
              setDeleteParams({
                title:
                  selectedRowKeys.length === 0
                    ? 'Confirm clearing the list data?'
                    : 'Confirm deleting the selected data?',
                params:
                  selectedRowKeys.length === 0
                    ? { DeleteAll: true }
                    : {
                        Filter: {
                          Ids: selectedRowKeys,
                        },
                      },
              })
            }}
          >
            {selectedRowKeys.length > 0 ? '删除' : '清空'}
          </YakitButton>

          <YakitButton type="outline1" onClick={() => setIsAllowIRifyUpdate(true)}>
            迁移旧项目数据
          </YakitButton>

          <YakitButton type="text2" icon={<OutlineRefreshIcon />} onClick={(e) => update(true)} />
        </div>
      </div>

      <div className={styles['table']}>
        <YakitVirtualList<SSAProgram>
          className={styles['audit-virtual-list']}
          loading={loading}
          refresh={refresh}
          hasMore={hasMore}
          columns={columns}
          data={data}
          page={pagination.Page}
          loadMoreData={loadMoreData}
          renderKey="Id"
          rowSelection={{
            isAll: isAllSelect,
            type: 'checkbox',
            selectedRowKeys,
            onSelectAll: onSelectAll,
            onChangeCheckboxSingle: onSelectChange,
          }}
        />
      </div>

      <YakitHint
        visible={!!deleteParams}
        title={deleteParams?.title}
        content={
          selectedRowKeys.length === 0 ? 'Deleted data cannot be recovered.' : 'Deleted data cannot be recovered.'
        }
        onOk={() => deleteParams && onDelete(deleteParams.params)}
        onCancel={() => setDeleteParams(undefined)}
      />

      <IRifyUpdateProjectManagerModal visible={isAllowIRifyUpdate} onClose={() => setIsAllowIRifyUpdate(false)} />
    </div>
  )
}

export default SSACompileHistory
