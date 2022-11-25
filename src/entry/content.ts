import { createApp } from 'vue'
import contentView from '@/view/content-view.vue'

const div: HTMLElement = document.createElement('div');
div.id = 'note-extension-app';
document.body.appendChild(div);

const app = createApp(contentView);
app.mount('#note-extension-app');