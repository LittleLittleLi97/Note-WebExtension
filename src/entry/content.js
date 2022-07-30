import { createApp } from 'vue'
import contentView from '../view/content.vue'
import '@/assets/root.css';
import '@/assets/iconfont/iconfont.css'

const div = document.createElement('div');
div.id = 'note-extension-app';
document.body.appendChild(div);

const app = createApp(contentView);
app.mount('#note-extension-app');