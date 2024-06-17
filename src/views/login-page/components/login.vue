<template>
  <t-form
    ref="formRef"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'password'">
      <t-form-item name="username">
        <t-input
          v-model="formData.username"
          size="large"
          placeholder="请输入账号：admin"
        >
          <template #prefix-icon>
            <user-icon />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          key="password"
          placeholder="请输入登录密码：admin"
        >
          <template #prefix-icon>
            <lock-on-icon />
          </template>
          <template #suffix-icon>
            <browse-icon
              v-if="showPsw"
              @click="showPsw = !showPsw"
              key="browse"
            />
            <browse-off-icon
              v-else
              @click="showPsw = !showPsw"
              key="browse-off"
            />
          </template>
        </t-input>
      </t-form-item>

      <div class="check-container remember-pwd">
        <t-checkbox>记住账号</t-checkbox>
        <span class="tip">忘记账号？</span>
      </div>
    </template>

    <!-- 扫码登陆 -->
    <template v-else-if="type == 'qrcode'">
      <div class="tip-container">
        <span class="tip">请使用微信扫一扫登录</span>
        <span class="refresh"
          >刷新
          <refresh-icon color="#0052D9" />
        </span>
      </div>
      <qrcode-vue value="" :size="192" level="H" />
    </template>

    <!-- 手机号登陆 -->
    <template v-else>
      <t-form-item name="phone">
        <t-input
          v-model="formData.phone"
          size="large"
          placeholder="请输入您的手机号"
        >
          <template #prefix-icon>
            <user-icon />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item class="verification-code" name="verifyCode">
        <t-input
          v-model="formData.verifyCode"
          size="large"
          placeholder="请输入验证码"
          key="verifyCode"
        />
        <t-button
          variant="outline"
          :disabled="countDown > 0"
          @click="handleCounter"
        >
          {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit"> 登录 </t-button>
    </t-form-item>

    <div class="switch-container">
      <span
        v-if="type !== 'password'"
        class="tip"
        @click="switchType('password')"
        >使用账号密码登录</span
      >
      <span v-if="type !== 'qrcode'" class="tip" @click="switchType('qrcode')"
        >使用微信扫码登录</span
      >
      <span v-if="type !== 'phone'" class="tip" @click="switchType('phone')"
        >使用手机号登录</span
      >
    </div>
  </t-form>
</template>

<script lang="ts" setup>
import QrcodeVue from 'qrcode.vue'
import {
  UserIcon,
  LockOnIcon,
  BrowseOffIcon,
  BrowseIcon,
  RefreshIcon,
} from 'tdesign-icons-vue-next'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import type { TdFormProps } from 'tdesign-vue-next'

let intervalTimer: NodeJS.Timeout
const FORM_RULES = {
  phone: [{ required: true, message: '手机号必填', type: 'error' }],
  username: [{ required: true, message: '账号必填', type: 'error' }],
  password: [{ required: true, message: '密码必填', type: 'error' }],
  verifyCode: [{ required: true, message: '验证码必填', type: 'error' }],
}
const INITIAL_DATA = {
  phone: '',
  username: 'admin@shkong.cc',
  password: 'Admin@123456',
  verifyCode: '',
  checked: false,
}
const formData = ref(INITIAL_DATA)
const type = ref('password')
const showPsw = ref(false)
const countDown = ref(0)
const userStore = useUserStore()
const router = useRouter()

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

const formRef = ref()
const switchType = (val: string) => {
  type.value = val
  formRef.value.reset()
}
const onSubmit: TdFormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult === true) {
    await userStore.login(formData.value)
    router.push('/timer-detect-sniffer')
  }
}
onBeforeUnmount(() => {
  clearInterval(intervalTimer)
})
</script>
