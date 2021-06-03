import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const http = axios.create({
  // baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
  baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
})

http.interceptors.request.use(
  (config) => {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
http.interceptors.response.use(
  (config) => {
    NProgress.done()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default http
