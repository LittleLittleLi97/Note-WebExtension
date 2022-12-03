import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ContentView from '@/view/ContentView.vue'
import '@/assets/root.css'
import '@/assets/iconfont/iconfont.css'

const div: HTMLElement = document.createElement('div');
div.id = 'note-extension-app';
document.body.appendChild(div);

const app = createApp(ContentView);
app.use(createPinia());
app.mount('#note-extension-app');