import request from '@/config/axios'

export interface AnnouncementVO {
  id: number
  title: string
  content: string
  imageUrl: string
  activityTime: string
  activityPlace: string
  type: number // 1是新闻，2是公告
  isTop: boolean // true是置顶，false是不置顶
  createTime: number | undefined
  updateTime: number | undefined
}

// 查询新闻公告列表
export const getAnnouncementPage = async (params) => {
  return await request.get({ url: `/member/announcement/page`, params })
}

// 查询新闻公告详情
export const getAnnouncement = async (id: number) => {
  return await request.get({ url: `/member/announcement/get?id=` + id })
}

// 新增新闻公告
export const createAnnouncement = async (data: AnnouncementVO) => {
  return await request.post({ url: `/member/announcement/create`, data })
}

// 修改新闻公告
export const updateAnnouncement = async (data: AnnouncementVO) => {
  return await request.put({ url: `/member/announcement/update`, data })
}

// 删除新闻公告
export const deleteAnnouncement = async (id: number) => {
  return await request.delete({ url: `/member/announcement/delete?id=` + id })
}
