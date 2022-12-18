import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import VueSocketIO from 'vue-3-socket.io'
import SocketIO from 'socket.io-client'

import './assets/main.css'

const app = createApp(App)


app.use(router)
app.use(store)
app.use(new VueSocketIO({
    debug: false,
    connection: SocketIO('http://localhost:3000'),
    vuex:{
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))

app.mount('#app')
