<template>
  <el-card shadow="never">
    <template #header>
      <slot name="header"></slot>
    </template>
    <el-row v-if="mode === 'member'">
      <el-col :span="4">
        <ElAvatar :size="140" :src="user.avatar || undefined" shape="square" />
      </el-col>
      <el-col :span="20">
        <el-descriptions :column="2">
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:user" label="用户名" />
            </template>
            {{ user.name || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:user" label="昵称" />
            </template>
            {{ user.nickname }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            <template #label>
              <descriptions-item-label icon="ep:phone" label="手机号" />
            </template>
            {{ user.mobile }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="fa:mars-double" label="性别" />
            </template>
            <dict-tag :type="DICT_TYPE.SYSTEM_USER_SEX" :value="user.sex" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:location" label="所在地" />
            </template>
            {{ user.areaName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:position" label="注册 IP" />
            </template>
            {{ user.registerIp }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="fa:birthday-cake" label="生日" />
            </template>
            {{ user.birthday ? formatDate(user.birthday as any) : '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:calendar" label="注册时间" />
            </template>
            {{ user.createTime ? formatDate(user.createTime as any) : '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:calendar" label="最后登录时间" />
            </template>
            {{ user.loginDate ? formatDate(user.loginDate as any) : '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:message" label="邮箱" />
            </template>
            {{ user.email || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:calendar" label="入学年份" />
            </template>
            {{ user.enrollmentYear ? `${user.enrollmentYear}年` : '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:reading" label="入学期数" />
            </template>
            {{ user.enrollmentSemester ? `${user.enrollmentSemester}期` : '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:briefcase" label="所属行业" />
            </template>
            {{ user.industry || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:office-building" label="在职公司" />
            </template>
            {{ user.company || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:suitcase" label="职位" />
            </template>
            {{ user.position || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:user" label="MBTI" />
            </template>
            {{ user.mbti || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:star" label="兴趣爱好" />
            </template>
            {{ user.hobbies || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:chat-line-square" label="微信号" />
            </template>
            {{ user.wechatNumber || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:location" label="居住城市" />
            </template>
            {{ user.city || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:school" label="学士毕业院校" />
            </template>
            {{ user.university || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:school" label="硕士毕业院校" />
            </template>
            {{ user.masterUniversity || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:school" label="博士毕业院校" />
            </template>
            {{ user.doctorUniversity || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:office-building" label="曾就职公司1" />
            </template>
            {{ user.company1 || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:office-building" label="曾就职公司2" />
            </template>
            {{ user.company2 || '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:office-building" label="曾就职公司3" />
            </template>
            {{ user.company3 || '空' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <template v-if="mode === 'kefu'">
      <ElAvatar :size="140" :src="user.avatar || undefined" shape="square" />
      <el-descriptions :column="1" class="kefu-descriptions">
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:user" label="用户名" />
          </template>
          {{ user.name || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:user" label="昵称" />
          </template>
          {{ user.nickname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:phone" label="手机号" />
          </template>
          {{ user.mobile }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="fa:mars-double" label="性别" />
          </template>
          <dict-tag :type="DICT_TYPE.SYSTEM_USER_SEX" :value="user.sex" />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:location" label="所在地" />
          </template>
          {{ user.areaName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:position" label="注册 IP" />
          </template>
          {{ user.registerIp }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="fa:birthday-cake" label="生日" />
          </template>
          {{ user.birthday ? formatDate(user.birthday as any) : '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:calendar" label="注册时间" />
          </template>
          {{ user.createTime ? formatDate(user.createTime as any) : '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:calendar" label="最后登录时间" />
          </template>
          {{ user.loginDate ? formatDate(user.loginDate as any) : '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:message" label="邮箱" />
          </template>
          {{ user.email || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:calendar" label="入学年份" />
          </template>
          {{ user.enrollmentYear || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:reading" label="入学期数" />
          </template>
          {{ user.enrollmentSemester ? `第${user.enrollmentSemester}学期` : '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:briefcase" label="所属行业" />
          </template>
          {{ user.industry || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:office-building" label="在职公司" />
          </template>
          {{ user.company || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:suitcase" label="职位" />
          </template>
          {{ user.position || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:user" label="MBTI" />
          </template>
          {{ user.mbti || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:star" label="兴趣爱好" />
          </template>
          {{ user.hobbies || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:chat-line-square" label="微信号" />
          </template>
          {{ user.wechatNumber || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:location" label="居住城市" />
          </template>
          {{ user.city || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:school" label="学士毕业院校" />
          </template>
          {{ user.university || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:school" label="硕士毕业院校" />
          </template>
          {{ user.masterUniversity || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:school" label="博士毕业院校" />
          </template>
          {{ user.doctorUniversity || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:office-building" label="曾就职公司1" />
          </template>
          {{ user.company1 || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:office-building" label="曾就职公司2" />
          </template>
          {{ user.company2 || '空' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:office-building" label="曾就职公司3" />
          </template>
          {{ user.company3 || '空' }}
        </el-descriptions-item>
      </el-descriptions>
    </template>
  </el-card>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import * as UserApi from '@/api/member/user'
import { DescriptionsItemLabel } from '@/components/Descriptions/index'

withDefaults(defineProps<{ user: UserApi.UserVO; mode?: string }>(), {
  mode: 'member'
})
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::v-deep(.kefu-descriptions) {
  .el-descriptions__cell {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-descriptions__label {
      width: 120px;
      display: block;
      text-align: left;
    }

    .el-descriptions__content {
      flex: 1;
      text-align: end;
    }
  }
}
</style>
