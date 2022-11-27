import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PopupView from '@/view/PopupView.vue'
import '@/assets/root.css'
import '@/assets/iconfont/iconfont.css'

const app = createApp(PopupView);
app.use(createPinia());
app.mount('#app');
