<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="120px"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          class="!w-240px"
          clearable
          placeholder="请输入标题"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="新闻公告类型" prop="type">
        <el-select v-model="queryParams.type" class="!w-240px" clearable placeholder="请选择类型">
          <el-option label="新闻" :value="1" />
          <el-option label="公告" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否置顶" prop="isTop">
        <el-select
          v-model="queryParams.isTop"
          class="!w-240px"
          clearable
          placeholder="请选择是否置顶"
        >
          <el-option label="置顶" :value="true" />
          <el-option label="不置顶" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动地点" prop="activityPlace">
        <el-input
          v-model="queryParams.activityPlace"
          class="!w-240px"
          clearable
          placeholder="请输入活动地点"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动时间" prop="activityTime">
        <el-date-picker
          v-model="queryParams.activityTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-date-picker
          v-model="queryParams.updateTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-10px">
      <el-button type="primary" @click="openForm('create')">
        <Icon class="mr-5px" icon="ep:plus" />
        新增新闻公告
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="标题" prop="title" min-width="150px" />
      <el-table-column align="center" label="内容" prop="content" min-width="200px" />
      <el-table-column align="center" label="图片" prop="imageUrl" width="100px">
        <template #default="scope">
          <el-image
            v-if="scope.row.imageUrl"
            :src="scope.row.imageUrl"
            fit="cover"
            class="w-50px h-50px"
            :preview-src-list="[scope.row.imageUrl]"
            preview-teleported
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动时间" prop="activityTime" width="180px" />
      <el-table-column align="center" label="活动地点" prop="activityPlace" width="150px" />
      <el-table-column align="center" label="类型" prop="type" width="100px">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 1" type="success">新闻</el-tag>
          <el-tag v-else-if="scope.row.type === 2" type="info">公告</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否置顶" prop="isTop" width="100px">
        <template #default="scope">
          <el-tag v-if="scope.row.isTop" type="warning">置顶</el-tag>
          <el-tag v-else type="info">不置顶</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="创建时间"
        prop="createTime"
        width="180px"
      />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="更新时间"
        prop="updateTime"
        width="180px"
      />
      <el-table-column
        :show-overflow-tooltip="false"
        align="center"
        fixed="right"
        label="操作"
        width="150px"
      >
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <AnnouncementForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as AnnouncementApi from '@/api/member/announcement'
import AnnouncementForm from './AnnouncementForm.vue'

defineOptions({ name: 'MemberAnnouncement' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  title: null,
  type: null,
  isTop: null,
  activityPlace: null,
  activityTime: [],
  createTime: [],
  updateTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AnnouncementApi.getAnnouncementPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await AnnouncementApi.deleteAnnouncement(id)
    message.success('删除成功')
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
