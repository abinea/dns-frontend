import { request } from '@/utils/request'
import { MessagePlugin } from 'tdesign-vue-next'
import { TOKEN_NAME } from '@/config/global'
import { getUserProfile } from '@/api'

interface UserState {
  username: string
  email: string
  isSuperuser: boolean
  roles: string[]
  token: string
}

interface UserInfo {
  username: string
  password: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem(TOKEN_NAME) || '')
  const userInfo = ref<UserState>({
    username: '',
    email: '',
    isSuperuser: false,
    roles: [],
    token: '',
  })

  function setUserInfo(info: Partial<UserState>) {
    userInfo.value = { ...userInfo.value, ...info }
  }

  const setToken = (payload: string) => {
    token.value = payload
    localStorage.setItem(TOKEN_NAME, payload)
  }
  const removeToken = () => {
    token.value = ''
    localStorage.removeItem(TOKEN_NAME)
  }

  async function login(payload: UserInfo) {
    try {
      const res = await request.post('login/access-token', payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      console.log('Response:', res)
      const {
        code,
        data: { token },
      } = res.data
      if (code === 200) {
        setToken(token)
        MessagePlugin.success('登录成功')
        sessionStorage.setItem('isLogin', 'true')
        sessionStorage.setItem('username', payload.username)
        sessionStorage.setItem('token', token)
      } else {
        MessagePlugin.warning('验证失败，请输入正确的用户名和密码')
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error(error)
      MessagePlugin.error('登录失败，请稍后再试')
      throw error
    }
  }

  async function getUserInfo() {
    const res = await getUserProfile()
    if (res.data.code === 200) {
      const userInfo = res.data.data
      setUserInfo({
        isSuperuser: userInfo.is_superuser,
        username: userInfo.full_name,
        email: userInfo.email,
      })
    }

    const mockRemoteUserInfo = () => {
      if (userInfo.value.isSuperuser) {
        return ['ALL_ROUTERS']
      }
      return ['ALL_ROUTERS']
    }
    userInfo.value.roles = mockRemoteUserInfo()
  }

  async function logout() {
    userInfo.value.token = ''
    userInfo.value.roles = []
  }

  return {
    token,
    userInfo,
    removeToken,
    getUserInfo,
    login,
    logout,
  }
})
