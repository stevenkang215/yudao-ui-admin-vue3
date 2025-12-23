<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="100px"
    >
      <el-form-item label="姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          class="!w-240px"
          clearable
          placeholder="请输入姓名"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入学年份" prop="enrollmentYear">
        <el-select
          v-model="queryParams.enrollmentYear"
          class="!w-240px"
          clearable
          placeholder="请选择入学年份"
        >
          <el-option
            v-for="year in enrollmentYearOptions"
            :key="year"
            :label="year + '年'"
            :value="year"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入学期数" prop="semester">
        <el-select
          v-model="queryParams.semester"
          class="!w-240px"
          clearable
          placeholder="请选择入学期数"
        >
          <el-option v-for="sem in semesterOptions" :key="sem" :label="`第${sem}期`" :value="sem" />
        </el-select>
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
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button type="warning" plain @click="handleImport">
          <Icon class="mr-5px" icon="ep:upload" />
          导入
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="用户ID" prop="id" width="120px" />
      <el-table-column align="center" label="姓名" prop="userName" width="160px" />
      <el-table-column align="center" label="入学年份" prop="enrollmentYear" width="120px">
        <template #default="scope">
          {{ scope.row.enrollmentYear ? scope.row.enrollmentYear + '年' : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="入学期数" prop="semester" width="120px">
        <template #default="scope">
          {{ scope.row.semester ? scope.row.semester + '期' : '' }}
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="创建时间"
        prop="createTime"
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
  <WhitelistForm ref="formRef" @success="getList" />
  <!-- 白名单人员导入弹窗 -->
  <WhitelistImportForm ref="importFormRef" @success="getList" />
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as WhitelistApi from '@/api/member/whitelist'
import WhitelistForm from './WhitelistForm.vue'
import WhitelistImportForm from './WhitelistImportForm.vue'

defineOptions({ name: 'MemberWhitelist' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userName: null,
  enrollmentYear: null,
  semester: null,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 生成入学年份选项：从2015年到当前年份 */
const enrollmentYearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let year = 2015; year <= currentYear; year++) {
    years.push(year)
  }
  return years
})

/** 生成入学期数选项：与入学年份数量保持一致 */
const semesterOptions = computed(() => {
  // 入学期数与入学年份数量一致，从1开始
  const count = enrollmentYearOptions.value.length
  return Array.from({ length: count }, (_, i) => i + 1)
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WhitelistApi.getWhitelistPage(queryParams)
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

/** 白名单人员导入 */
const importFormRef = ref()
const handleImport = () => {
  importFormRef.value.open()
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await WhitelistApi.deleteWhitelist(id)
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
