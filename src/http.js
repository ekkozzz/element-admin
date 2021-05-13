import axios from 'axios'
const http = axios.create({
  baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
})

export default http
