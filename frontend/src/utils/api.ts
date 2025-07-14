import axios from 'axios'

const api = axios.create({
    baseURL: process.env.DJANGO_API,
    withCredentials: true
})

api.interceptors.response.use(
    // forward response
    response => response,
    // if there is unauthenticated error, try refresh token
    async err => {
        if(err.response?.status !== 401){
            return Promise.reject(err)
        }

        try {
            await axios.get('/api/refresh') 
            // retry original request
            return api(err.config)
        } catch (refreshError) {
            console.error('Refresh failed', refreshError)
            return Promise.reject(refreshError)
        }
    }
)

export default api