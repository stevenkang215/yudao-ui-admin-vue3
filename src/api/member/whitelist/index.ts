import request from '@/config/axios'

export interface WhitelistVO {
  id: number
  userName: string
  enrollmentYear: number
  semester: number
  createTime: number | undefined
}

// 查询白名单人员列表
export const getWhitelistPage = async (params) => {
  return await request.get({ url: `/member/user-whitelist/page`, params })
}

// 查询白名单人员详情
export const getWhitelist = async (id: number) => {
  return await request.get({ url: `/member/user-whitelist/get?id=` + id })
}

// 新增白名单人员
export const createWhitelist = async (data: WhitelistVO) => {
  return await request.post({ url: `/member/user-whitelist/create`, data })
}

// 修改白名单人员
export const updateWhitelist = async (data: WhitelistVO) => {
  return await request.put({ url: `/member/user-whitelist/update`, data })
}

// 删除白名单人员
export const deleteWhitelist = async (id: number) => {
  return await request.delete({ url: `/member/user-whitelist/delete?id=` + id })
}

// 下载白名单人员导入模板
export const importWhitelistTemplate = () => {
  return request.download({ url: '/member/user-whitelist/get-import-template' })
}
