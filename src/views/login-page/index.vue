<template>
  <div class="login-wrapper">
    <login-header />
    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">登录到</h1>
        <h1 class="title">DNS隐秘隧道检测系统</h1>
        <div class="sub-title">
          <p class="tip">
            {{ type == 'register' ? '已有账号?' : '没有账号吗?' }}
          </p>
          <p class="tip" @click="switchType(type == 'register' ? 'login' : 'register')">
            {{ type == 'register' ? '登录' : '注册新账号' }}
          </p>
        </div>
      </div>

      <login v-if="type === 'login'" />
      <register v-else @register-success="switchType('login')" />
      <tdesign-setting />
    </div>

    <footer class="copyright">
      Copyright @ 2021-2022 Tencent. All Rights Reserved
    </footer>
  </div>
</template>

<script lang="ts" setup>
import Login from './components/login.vue'
import LoginHeader from './components/login-header.vue'
import Register from './components/register.vue'

const type = ref('login')
const switchType = (val: string) => {
  type.value = val
}
</script>
<style lang="less">
@import url('./index.less');
</style>
