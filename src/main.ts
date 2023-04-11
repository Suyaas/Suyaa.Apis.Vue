import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

console.log(import.meta.env.MODE)

var app = createApp(App)
app.mount('#app')
