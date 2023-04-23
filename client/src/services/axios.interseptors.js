import axios from 'axios'

axios.interceptors.request.use(request => {
    if (!request.url.includes('registration'))
        request.headers.common["Authorization"] = `Bearer ${localStorage.getItem('access_token')}`;
})

axios.interceptors.response.use(response => response, async error => {
    if (error.response.status === 401) {
        const {status, data} = await axios.post('/refresh', {}, {
            withCredentials: true
        })

        if (status === 200) {
            localStorage.setItem('access_token', data)
            // axios.defaults.headers.common['Authorization'] = `Bearee ${data}`

            return axios(error.config)
        }
    }

    return error
})