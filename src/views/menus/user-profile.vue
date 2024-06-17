<template>
  <t-card title="当前用户信息" style="padding: 20px" :bordered="false">
    <div class="user-wrapper">
      <t-form labt-width="80px" :model="form" ref="formRef">
        <t-form-item label="用户名" prop="username">
          <t-input v-model="form.username" />
        </t-form-item>
        <t-form-item label="邮箱" prop="email">
          <t-input v-model="form.email" />
        </t-form-item>
        <t-form-item label="旧密码" prop="oldPwd">
          <t-input
            class="disable-show-pwd"
            type="password"
            v-model="form.oldPwd"
            :readonly="!isEdit"
            placeholder="请输入密码以确认身份"
          ></t-input>
          <t-button
            v-if="!isEdit"
            size="small"
            @click="toggleEdit"
            style="position: absolute; left: 100%; margin-left: 20px"
          >
            修改</t-button
          >
          <t-button
            v-else
            size="small"
            @click="toggleEdit"
            theme="default"
            style="position: absolute; left: 100%; margin-left: 20px"
          >
            取消</t-button
          >
        </t-form-item>
        <t-form-item v-if="isEdit" label="新密码" prop="newPwd">
          <t-input
            type="password"
            placeholder="请输入新密码"
            v-model="form.newPwd"
          ></t-input>
        </t-form-item>
        <t-form-item>
          <t-space>
            <t-button theme="primary" @click="onSubmit">提交</t-button>
            <t-button theme="default" @click="resetForm">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </div>
  </t-card>
</template>

<script lang="ts" setup>
import { changePwd, getUserProfile, updateUserProfile } from '@/api'
import {
  FormInstanceFunctions,
  MessagePlugin,
  TdFormProps,
} from 'tdesign-vue-next'

const isEdit = ref(false)
const formRef = ref<FormInstanceFunctions>()
const form = ref({
  username: window.sessionStorage.getItem('username') || '',
  email: '',
  isSuperuser: false,
  oldPwd: '',
  newPwd: '',
})

onMounted(async () => {
  const res = await getUserProfile()
  if (res.data.code === 200) {
    form.value = {
      username: res.data.data.full_name,
      email: res.data.data.email,
      isSuperuser: res.data.data.is_superuser,
      oldPwd: '123456',
      newPwd: '',
    }
  }
  // form.value
})

const onSubmit: TdFormProps['onSubmit'] = async () => {
  try {
    if (isEdit.value) {
      const res = await changePwd({
        currentPwd: form.value.oldPwd,
        newPwd: form.value.newPwd,
      })
      if (res.data.code == 200) {
        MessagePlugin.success('密码修改成功')
      } else {
        MessagePlugin.warning('旧密码不匹配')
      }
    }
    const { username: full_name, email } = form.value
    const profileRes = await updateUserProfile({ full_name, email })
    if (profileRes.data.code === 200) {
      MessagePlugin.success('用户信息修改成功')
    } else {
      MessagePlugin.error('更新用户信息失败')
    }
  } catch (e) {
    console.log(e)
  }
}
function toggleEdit() {
  isEdit.value = !isEdit.value
  if (isEdit.value) {
    form.value.oldPwd = ''
  } else {
    MessagePlugin.warning('已取消修改')
    form.value.oldPwd = '123456'
  }
}

function resetForm() {
  formRef.value!.reset()
}
</script>

<style scoped>
.user-wrapper {
  max-width: 700px;
  min-width: 400px;
}

.disable-show-pwd :deep(.t-input__suffix-icon) {
  visibility: hidden;
}
</style>
