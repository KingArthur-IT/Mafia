import axios from 'axios'
import router from '@/router/index'
import store from '@/store/index'

axios.defaults.baseURL = 'http://localhost:3000/api'//process.env.VUE_APP_BASE_URL;
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers['Accept'] = 'application/json'

// Request interceptor
axios.interceptors.request.use(request => {
    if ( !request.url.includes('registration') && !request.url.includes('refresh'))
        request.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;

    return request
})

// Response interceptor
axios.interceptors.response.use(response => response, async error => {
    if (error.response.status === 401) {
        const { status, data } = await axios.post('/auth/refresh', {}, {
            withCredentials: true
        })

        if (status === 200) {
            localStorage.setItem('access_token', data.data)
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.data}`

            return axios(error.config)
        } else {
            router.push({ name: 'home' })
            store.dispatch('toast/showToast', { text: 'Не удалось обновить токен доступа. Попробуйте войти еще раз', type: 'error' }, { root: true })
        }
    }

    return error
})