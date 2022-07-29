import { createApp } from 'vue'
import contentView from '../view/content.vue'

const div = document.createElement('div');
div.id = 'collect-plugin-app';
document.body.appendChild(div);

const app = createApp(contentView);
app.mount('#collect-plugin-app');