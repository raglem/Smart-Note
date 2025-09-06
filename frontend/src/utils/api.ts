import axios from 'axios'

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
}

// Create axios object
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DJANGO_API,
  withCredentials: true,
})

// Attach tokens
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ACCESS_TOKEN')
  const csrfToken = getCookie('csrftoken')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken
  }
  return config
})

export default api
