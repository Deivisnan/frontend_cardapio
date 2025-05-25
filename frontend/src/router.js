import { createRouter, createWebHistory } from 'vue-router';
import store from './store'; // Importa o Vuex Store
import LoginPage from './componentes/LoginPage.vue';
import MyPage from './componentes/MyPage.vue';
import AboutPage from './componentes/AboutPage.vue';
import ServicesPage from './componentes/ServicesPage.vue';
import CadastroUsuario from './componentes/CadastroUsuario.vue';
import AdminPage from "./Ingest/AdminPage.vue"; // Alterado para o nome correto
import LoginAdm from './Ingest/LoginAdm.vue';
import ConfirmacaoCompra from "./componentes/Confirmacao-compra.vue";
import CadastroPerfil from "./componentes/CadastroPerfil.vue";
import PerfilUsuario from "./componentes/PerfilUsuario.vue";
import EditarPerfil from "./componentes/EditarPerfil.vue";

const routes = [
    { path: '/', component: LoginPage }, // Página inicial -> Login
    { path: '/mypage', component: MyPage, meta: { requiresAuth: true } }, // Protegida
    { path: '/CadastroPerfil', component: CadastroPerfil, meta: { requiresAuth: true } }, // Protegida
    { path: '/perfil', component: PerfilUsuario, meta: { requiresAuth: true } }, // Protegida
    { path: '/EditarPerfil', component: EditarPerfil, meta: { requiresAuth: true } }, // Protegida
    { path: '/sobre', component: AboutPage, meta: { requiresAuth: true } }, // Protegida
    { path: '/servicos', component: ServicesPage, meta: { requiresAuth: true } }, // Protegida
    {path: '/ConfirmacaoCompra',component: ConfirmacaoCompra, meta: { requiresAuth: true } }, // Protegida}
    { path: '/cadastro', name: 'CadastroUsuario', component: CadastroUsuario },
    { path: '/loginAdm', component: LoginAdm },  // Rota para login do administrador
    { path: '/adm', name: 'Adm', component: AdminPage, meta: { requiresAuth: true, requiresAdmin: true } }, // Rota para a página de administração
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Guard de navegação para verificar autenticação
router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated;

    console.log("Navegando para:", to.path);
    console.log("Usuário autenticado:", isAuthenticated);

    if (to.meta.requiresAuth && !isAuthenticated) {
        console.log("Acesso bloqueado! Redirecionando para login.");
        next('/'); // Redireciona para a página de login
    } else if (to.path === '/' && isAuthenticated) {
        console.log("Usuário já autenticado. Redirecionando para MyPage.");
        next('/mypage'); // Redireciona para MyPage
    } else {
        console.log("Acesso permitido.");
        next(); // Permite a navegação
    }
});

export default router;
