import { createApp } from 'vue';
import App from './App.vue';
import router from './utils/router.ts';
import '../src/assets/main.css'
import '@mdi/font/css/materialdesignicons.min.css'

const app = createApp(App);

app.use(router);
app.mount('#app');

