<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="formData.userName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="入学年份" prop="enrollmentYear">
        <el-select
          v-model="formData.enrollmentYear"
          placeholder="请选择入学年份"
          clearable
          style="width: 100%"
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
          v-model="formData.semester"
          placeholder="请选择入学期数"
          clearable
          style="width: 100%"
        >
          <el-option v-for="sem in semesterOptions" :key="sem" :label="`第${sem}期`" :value="sem" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as WhitelistApi from '@/api/member/whitelist'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  userName: undefined,
  enrollmentYear: undefined,
  semester: undefined
})
const formRules = reactive({
  userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  enrollmentYear: [{ required: true, message: '入学年份不能为空', trigger: 'blur' }],
  semester: [{ required: true, message: '入学学期数不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

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
      formData.value = await WhitelistApi.getWhitelist(id)
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
    const data = formData.value as unknown as WhitelistApi.WhitelistVO
    if (formType.value === 'create') {
      await WhitelistApi.createWhitelist(data)
      message.success(t('common.createSuccess'))
    } else {
      await WhitelistApi.updateWhitelist(data)
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
    userName: undefined,
    enrollmentYear: undefined,
    semester: undefined
  }
  formRef.value?.resetFields()
}
</script>
