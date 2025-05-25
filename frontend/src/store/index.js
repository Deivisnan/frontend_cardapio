import { createStore } from "vuex";
import axios from "axios";

export default createStore({
    state: {
        perfil: null,  // Estado para armazenar o perfil
        carrinho: [],
        token: localStorage.getItem("authToken") || null,
        isAuthenticated: !!localStorage.getItem("authToken"),
        user: null,
        userId: localStorage.getItem("userId") || null,  // Armazena o ID do usuário
        isAdmin: false,
        carrinhoAberto: false,
    },
    mutations: {
        setUserId(state, userId) {
            state.userId = userId;
            localStorage.setItem("userId", userId); // Armazena o ID do usuário no localStorage
        },
        setIsAdmin(state, isAdmin) {
            state.isAdmin = isAdmin;
        },
        setUser(state, user) {
            state.user = user;
        },
        setPerfil(state, perfil) {
            state.perfil = perfil;  // Atualiza o perfil no estado
        },
        setToken(state, token) {
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem("authToken", token);
        },
        clearToken(state) {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.carrinhoAberto = false;
            localStorage.removeItem("authToken");
            localStorage.removeItem("userId"); // Remove o ID do usuário do localStorage
        },
        atualizarQuantidade(state, { produtoId, quantidade }) {
            const item = state.carrinho.find(i => i.produtoId === produtoId);
            if (item) {
                item.quantidade = quantidade;
            }
            const userId = state.user?._id || "guest";
            localStorage.setItem(`carrinho_${userId}`, JSON.stringify(state.carrinho));
        },
        adicionarItem(state, item) {
            const index = state.carrinho.findIndex(i => i.produtoId === item.produtoId);
            if (index !== -1) {
                state.carrinho[index].quantidade += item.quantidade || 1;
            } else {
                state.carrinho.push({ ...item, quantidade: item.quantidade || 1 });
            }

            const userId = state.user?._id || "guest";
            localStorage.setItem(`carrinho_${userId}`, JSON.stringify(state.carrinho));
        },
        atualizarCarrinho(state, carrinho) {
            if (Array.isArray(carrinho)) {
                state.carrinho = [...carrinho];
                const userId = state.user?._id || "guest";
                localStorage.setItem(`carrinho_${userId}`, JSON.stringify(state.carrinho));
            } else {
                console.error("Carrinho não está no formato correto:", carrinho);
            }
        },
        removerItem(state, itemId) {
            state.carrinho = state.carrinho.filter(item => item._id !== itemId);
            const userId = state.user?._id || "guest";
            localStorage.setItem(`carrinho_${userId}`, JSON.stringify(state.carrinho));
        },
        limparCarrinho(state) {
            state.carrinho = [];
            state.carrinhoAberto = false;
            localStorage.removeItem("carrinho");
        },
        toggleCarrinho(state) {
            state.carrinhoAberto = !state.carrinhoAberto;
        },
        resetCarrinho(state) {
            state.carrinho = [];
            localStorage.removeItem("carrinho");
        },
    },
    actions: {
        async login({ commit, dispatch }, credentials) {
            try {
                const response = await axios.post(`${process.env.VUE_APP_API_URL}/login`, credentials);
                const user = response.data.user;
                const token = response.data.token;

                if (user && token) {
                    commit("setUser", user);
                    commit("setToken", token);
                    commit("setUserId", user._id);  // Armazena o ID do usuário no Vuex e localStorage
                    await dispatch("carregarCarrinho"); // Carrega o carrinho do servidor
                } else {
                    throw new Error("Dados de usuário ou token não recebidos!");
                }
            } catch (error) {
                console.error("Erro no login:", error.response?.data || error.message);
                throw error;
            }
        },
        async finalizarCompra({ commit }) {
            try {
                const apiUrl = process.env.VUE_APP_API_URL;
                await axios.delete(`${apiUrl}/carrinho`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                commit("limparCarrinho");
            } catch (error) {
                console.error("Erro ao finalizar compra:", error);
            }
        },
        async adicionarAoCarrinho({ commit, state, dispatch }, item) {
            const userId = state.user?._id || "guest";
            const localStorageKey = `carrinho_${userId}`;

            try {
                if (!item._id) {
                    throw new Error("O item não possui um ID válido.");
                }

                const itemExistente = state.carrinho.find(i => i.produtoId === item._id);
                if (itemExistente) {
                    commit("atualizarQuantidade", { produtoId: item._id, quantidade: itemExistente.quantidade + 1 });
                } else {
                    const itemComDetalhes = {
                        ...item,
                        quantidade: 1,
                        imagem: item.imagem ? `${process.env.VUE_APP_SERVER_URL}/uploads/${item.imagem}` : null,
                    };
                    commit("adicionarItem", itemComDetalhes);
                }

                localStorage.setItem(localStorageKey, JSON.stringify(state.carrinho));

                if (state.user) {
                    const apiUrl = process.env.VUE_APP_API_URL;
                    await axios.post(
                        `${apiUrl}/carrinho`,
                        {
                            itens: state.carrinho.map(item => ({
                                produtoId: item._id,
                                nome: item.nome,
                                preco: item.preco,
                                imagem: item.imagem,
                                quantidade: item.quantidade,
                            })),
                        },
                        {
                            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                        }
                    );
                }

                await dispatch("carregarCarrinho");
            } catch (error) {
                console.error("Erro ao adicionar ao carrinho:", error);
                throw error;
            }
        },
        async removerItemCarrinho({ commit }, itemId) {
            if (!itemId) {
                console.error("O itemId é inválido ou não foi fornecido.");
                return;
            }

            try {
                const apiUrl = process.env.VUE_APP_API_URL;
                await axios.delete(`${apiUrl}/carrinho/${itemId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                commit("removerItem", itemId);
                await this.dispatch("carregarCarrinho");
            } catch (error) {
                console.error("Erro ao remover item do carrinho:", error);
            }
        },
        async carregarCarrinho({ commit }) {
            try {
                const apiUrl = process.env.VUE_APP_API_URL;
                const response = await axios.get(`${apiUrl}/carrinho`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                commit("atualizarCarrinho", response.data.itens);
            } catch (error) {
                console.error("Erro ao carregar o carrinho:", error);
                commit("atualizarCarrinho", []);
            }
        },
        carregarCarrinhoDoLocalStorage({ commit, state }) {
            const userId = state.user?._id || "guest";
            const savedCart = localStorage.getItem(`carrinho_${userId}`);
            if (savedCart) {
                commit("atualizarCarrinho", JSON.parse(savedCart));
            }
        },
        async aumentarQuantidade({ commit }, item) {
            try {
                const apiUrl = process.env.VUE_APP_API_URL;
                const response = await axios.patch(`${apiUrl}/carrinho/aumentar/${item._id}`, null, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                commit("atualizarCarrinho", response.data.itens);
            } catch (error) {
                console.error("Erro ao aumentar quantidade:", error);
            }
        },
        async diminuirQuantidade({ commit }, item) {
            try {
                const apiUrl = process.env.VUE_APP_API_URL;
                const response = await axios.patch(`${apiUrl}/carrinho/diminuir/${item._id}`, null, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                commit("atualizarCarrinho", response.data.itens);
            } catch (error) {
                console.error("Erro ao diminuir quantidade:", error);
            }
        },
        async carregarPerfil({ commit }) {
            try {
                const response = await axios.get('/perfil');
                commit('setPerfil', response.data);
            } catch (error) {
                console.error("Erro ao carregar o perfil:", error);
            }
        },
        logout({ commit }) {
            commit("clearToken");
            commit("resetCarrinho");
        },
        toggleCarrinho({ commit }) {
            commit("toggleCarrinho");
        },
    },
    getters: {
        perfil: (state) => state.perfil,
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.isAdmin,
        userId: (state) => state.userId,
        totalCarrinho: (state) =>
            state.carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0),
        quantidadeTotal: (state) =>
            state.carrinho.reduce((total, item) => total + item.quantidade, 0),
        itensCarrinho: (state) =>
            state.carrinho.map((item) => ({
                ...item,
                total: item.preco * item.quantidade,
            })),
        carrinhoAberto: (state) => state.carrinhoAberto,
    },
});

