import { createApp } from 'vue'
import ContentView from '@/view/ContentView.vue'
import '@/assets/root.css'
import '@/assets/iconfont/iconfont.css'

const div: HTMLElement = document.createElement('div');
div.id = 'note-extension-app';
document.body.appendChild(div);

const app = createApp(ContentView);
app.mount('#note-extension-app');