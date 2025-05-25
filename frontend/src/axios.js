// src/axios.js
import axios from 'axios';
import store from './store';
import router from './router';

// Crie uma instância do Axios
const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL, // Certifique-se de definir a URL base corretamente
});

// Adicione um interceptor de resposta
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Token expirado ou não autorizado
            store.commit('clearToken'); // Limpa o token do estado Vuex
            router.push('/login'); // Redireciona para a tela de login
        }
        return Promise.reject(error);
    }
);

export default api;