import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router'; // Importa o router configurado
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles.css';

// Verifica se existe um token armazenado e restaura no Vuex
const token = localStorage.getItem("authToken");
if (token) {
    store.commit("setToken", token); // Restaura o token no Vuex
}

createApp(App)
    .use(store)
    .use(router)
    .mount('#app');
