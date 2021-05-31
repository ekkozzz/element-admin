import axios from 'axios'
const http = axios.create({
  // baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
  baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
})

http.interceptors.request.use(
  (config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

export default http
