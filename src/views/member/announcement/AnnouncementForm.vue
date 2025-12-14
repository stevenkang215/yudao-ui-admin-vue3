<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="新闻公告图片" prop="imageUrl">
        <UploadImg v-model="formData.imageUrl" :limit="1" :is-show-tip="false" />
      </el-form-item>
      <el-form-item label="新闻公告标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入新闻公告标题" />
      </el-form-item>
      <el-form-item label="新闻公告内容" prop="content">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="4"
          placeholder="请输入新闻公告内容"
        />
      </el-form-item>
      <el-form-item label="活动时间" prop="activityTime">
        <el-date-picker
          v-model="formData.activityTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择活动时间"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="活动地点" prop="activityPlace">
        <el-input v-model="formData.activityPlace" placeholder="请输入活动地点" />
      </el-form-item>
      <el-form-item label="新闻公告类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :value="1">新闻</el-radio>
          <el-radio :value="2">公告</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否置顶" prop="isTop">
        <el-radio-group v-model="formData.isTop">
          <el-radio :value="true">置顶</el-radio>
          <el-radio :value="false">不置顶</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as AnnouncementApi from '@/api/member/announcement'
import { UploadImg } from '@/components/UploadFile'
import dayjs from 'dayjs'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  title: undefined,
  content: undefined,
  imageUrl: undefined,
  activityTime: undefined,
  activityPlace: undefined,
  type: 1,
  isTop: false
})
const formRules = reactive({
  title: [{ required: true, message: '新闻公告标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '新闻公告内容不能为空', trigger: 'blur' }],
  activityTime: [{ required: true, message: '活动时间不能为空', trigger: 'change' }],
  activityPlace: [{ required: true, message: '活动地点不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '新闻公告类型不能为空', trigger: 'change' }],
  isTop: [{ required: true, message: '是否置顶不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await AnnouncementApi.getAnnouncement(id)
      formData.value = {
        ...data,
        // 将时间戳转换为 YYYY-MM-DD HH:mm:ss 格式用于回显
        activityTime: data.activityTime
          ? dayjs(data.activityTime).format('YYYY-MM-DD HH:mm:ss')
          : undefined
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      ...formData.value,
      // 将 YYYY-MM-DD HH:mm:ss 格式转换为时间戳
      activityTime: formData.value.activityTime
        ? dayjs(formData.value.activityTime).valueOf()
        : undefined
    } as unknown as AnnouncementApi.AnnouncementVO
    if (formType.value === 'create') {
      await AnnouncementApi.createAnnouncement(data)
      message.success(t('common.createSuccess'))
    } else {
      await AnnouncementApi.updateAnnouncement(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    title: undefined,
    content: undefined,
    imageUrl: undefined,
    activityTime: undefined,
    activityPlace: undefined,
    type: 1,
    isTop: false
  }
  formRef.value?.resetFields()
}
</script>
