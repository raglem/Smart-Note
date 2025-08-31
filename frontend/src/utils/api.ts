import axios from 'axios'

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DJANGO_API,
  withCredentials: true,
})

api.interceptors.request.use(config => {
  const csrfToken = getCookie('csrftoken')
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken
  }
  return config
})

api.interceptors.response.use(
  response => response,
  async err => {
    if (err.response?.status !== 401) {
      return Promise.reject(err)
    }

    if (err.config.url.includes('/api/refresh/')) {
      return Promise.reject(err)
    }

    try {
      await axios.get('/api/refresh/', { withCredentials: true })
      return api.request(err.config)
    } catch (refreshError) {
      console.error('Refresh failed', refreshError)
      return Promise.reject(refreshError)
    }
  }
)

export default api
