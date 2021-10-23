import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.noProxyUrl.dev : ''
//const baseUrl = process.env.NODE_ENV === ''

const axios = new HttpRequest(baseUrl)
export default axios
