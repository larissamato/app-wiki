import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const IP_FETCH_TIMEOUT = 5000;

export const getToken = async () => {
  const cookies = document.cookie.match('---OPEN=(.*)(---)')
  if (cookies && cookies.length > 1) return 'Bearer ' + decodeURI(cookies[1])
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(async config => {
  const token = await getToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export const postLogin = async (email: string, password: string) => {
  let ip = null
  const URL = API_URL + '/session/login'
  const method = 'post'
  await axios.get('https://rp.opendata.center', { timeout: IP_FETCH_TIMEOUT })
    .then(response => {
      ip = response.data.ip;
    })
    .catch(() => {
      ip = null;
    });
  const payload: { email: string; password: string; ip?: string | null } = {
    email,
    password,
  }
  if (ip != null) {
    payload.ip = ip;
  }
  return await axios[method](URL, payload)
    .then(res => {
      return res
    })
    .catch(res => {
      return res.response || res
    })
}
