<template>
  <t-form ref="form" :class="['item-container', `register-${type}`]" :data="formData" :rules="FORM_RULES"
    label-width="0" @submit="onSubmit">
    <template v-if="type == 'phone'">
      <t-form-item name="phone">
        <t-input v-model="formData.phone" :maxlength="11" size="large" placeholder="请输入您的手机号">
          <template #prefix-icon>
            <user-icon />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <template v-if="type == 'email'">
      <t-form-item name="email">
        <t-input v-model="formData.email" type="text" size="large" placeholder="请输入您的邮箱">
          <template #prefix-icon>
            <mail-icon />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <t-form-item name="password">
      <t-input v-model="formData.password" size="large" :type="showPsw ? 'text' : 'password'" clearable
        placeholder="请输入登录密码">
        <template #prefix-icon>
          <lock-on-icon />
        </template>
        <template #suffix-icon>
          <browse-icon v-if="showPsw" key="browse" @click="showPsw = !showPsw" />
          <browse-off-icon v-else key="browse-off" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <template v-if="type == 'phone'">
      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="formData.verifyCode" size="large" placeholder="请输入验证码" />
        <t-button variant="outline" :disabled="countDown > 0" @click="handleCounter">
          {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

    <t-form-item class="check-container" name="checked">
      <t-checkbox v-model="formData.checked">我已阅读并同意 </t-checkbox>
      <span>TDesign服务协议</span> 和
      <span>TDesign 隐私声明</span>
    </t-form-item>

    <t-form-item>
      <t-button block size="large" type="submit"> 注册 </t-button>
    </t-form-item>

    <div class="switch-container">
      <span class="tip" @click="switchType(type == 'phone' ? 'email' : 'phone')">{{ type == 'phone' ? '使用邮箱注册' :
        '使用手机号注册'
        }}</span>
    </div>
  </t-form>
</template>

<script lang="ts" setup>
import {
  UserIcon,
  MailIcon,
  BrowseIcon,
  BrowseOffIcon,
  LockOnIcon,
} from 'tdesign-icons-vue-next'
import type { TdFormProps } from 'tdesign-vue-next'

const FORM_RULES = {
  phone: [{ required: true, message: '手机号必填', type: 'error' }],
  email: [{ required: true, email: true, message: '邮箱必填', type: 'error' }],
  password: [{ required: true, message: '密码必填', type: 'error' }],
  verifyCode: [{ required: true, message: '验证码必填', type: 'error' }],
}
const INITIAL_DATA = {
  phone: '',
  email: '',
  password: '',
  verifyCode: '',
  checked: false,
}
const formData = ref(INITIAL_DATA)
const formRef = ref()
const type = ref('phone')
let intervalTimer: NodeJS.Timeout
const showPsw = ref(false)
const countDown = ref(0)
const onSubmit: TdFormProps['onSubmit'] = ({ validateResult }) => {
  if (validateResult === true) {
    console.log('注册成功')
  }
}

const switchType = (val: string) => {
  type.value = val
  formRef.value.reset()
}
const handleCounter = () => {
  countDown.value = 60
  intervalTimer = setInterval(() => {
    if (countDown.value > 0) {
      countDown.value -= 1
    } else {
      clearInterval(intervalTimer)
      countDown.value = 0
    }
  }, 1000)
}

onBeforeUnmount(() => {
  clearInterval(intervalTimer)
})
</script>
