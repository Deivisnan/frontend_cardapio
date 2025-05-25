<template>
  <div id="app">
    <!-- Navbar -->
    <header v-if="$route.path !== '/' && $route.path !== '/cadastro' && $route.path !== '/SessaoAdmin' && $route.path !=='/adm' && $route.path !=='/LoginAdm' && $route.path !=='/CadastroPerfil' ">
      <nav class="navbar navbar-expand-lg bg-primary fixed-top">
        <div class="container-fluid">
          <router-link to="/MyPage" class="nav-link">
            <img class="logo me-" :src="require('./assets/img/LogoLanche.jpg')" alt="logo" height="50">
          </router-link>
          <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link to="/MyPage" class="nav-link" aria-current="page">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/sobre" class="nav-link">Sobre</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/servicos" class="nav-link">Cardápio</router-link>
              </li>
              <li class="nav-item dropdown">
                <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                  Mais
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Contato</a></li>
                  <li><a class="dropdown-item" href="#">Localização</a></li>
                  <li><a class="dropdown-item" @click="IrParaPerfil">Perfil do Usuário </a></li>
                  <li><a class="dropdown-item" @click="handleLogout">SAIR</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="rede-social">
          <ul>
            <li class="rede-social-icon">
              <a @click.prevent="irParaWhatsApp">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" class="rede-icon" />
              </a>
            </li>
            <li class="rede-social-icon">
              <a href="https://www.instagram.com/pastelaria_flor_da_chapada?igsh=ZXFiMm82OW43dXV4" >
                <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" class="rede-icon" />
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div class="container-fluid">
            <div class="d-flex">
              <i class="fas fa-shopping-cart carrinho-icon" @click="toggleCarrinho"></i>
              <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Pop-up do Carrinho -->
    <div v-show="carrinhoAberto" class="modal-overlay-carrinho" @click="toggleCarrinho">
      <div class="modal-content-carrinho" @click.stop>
        <!-- Adicione este ícone de fechar -->
        <i class="fas fa-times close-icon" @click="toggleCarrinho"></i>
        <h3>Carrinho de Compras</h3>
        <div v-if="carrinho.length === 0">
          <p>Seu carrinho está vazio.</p>
        </div>
        <div v-else>
          <ul class="carrinho-items-list">
            <li v-for="item in carrinho" :key="item.id" class="carrinho-item">
              <div class="item-info-carrinho">
                <img :src="getImageUrl(item.imagem)" alt="Produto" class="item-imagem-carrinho" />
                <div class="item-details-carrinho">
                  <span class="item-nome-carrinho">{{ item.nome }}</span>
                  <span class="item-quantidade-carrinho">{{ item.quantidade }} x R$ {{ item.preco }}</span>
                  <div class="quantidade-controles">
                    <button @click="diminuirQuantidade(item)" class="quantidade-btn" :disabled="item.quantidade === 1">
                      <i class="fas fa-minus"></i>
                    </button>
                    <button @click="aumentarQuantidade(item)" class="quantidade-btn">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
              <i
                  class="fa fa-trash remover-item-icon"
                  @click="removerItemCarrinho(item._id)">
              </i>
            </li>
          </ul>
          <div class="total-carrinho">
            <p>Total: R$ {{ total }}</p>
            <button @click="finalizarCompra" class="botao-finalizar">Finalizar Compra</button>
          </div>
        </div>
      </div>
    </div>

    <router-view></router-view>

    <!-- Rodapé -->
    <footer class="footer" v-if="$route.path !== '/' && $route.path !== '/cadastro' && $route.path !=='/adm' && $route.path !=='/LoginAdm'&& $route.path !=='/CadastroPerfil' ">
      <div class="footer-container">
        <div class="footer-section sobre">
          <h3 class="footer-titulo">Flor da Chapada</h3>
          <p class="footer-descricao">Um lugar especial para saborear o melhor da Chapada Diamantina. Lanches frescos, ingredientes locais e um ambiente acolhedor.</p>
        </div>
        <div class="footer-section links">
          <h3 class="footer-titulo">Links Úteis</h3>
          <ul class="footer-links">
            <li><router-link to="/sobre" class="nav-link">Sobre Nós</router-link></li>
            <li><router-link to="/servicos" class="nav-link">Cardápio</router-link></li>
            <li><a href="#opinions">Opiniões</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>
        </div>
        <div class="footer-section contato">
          <h3 class="footer-titulo">Fale Conosco</h3>
          <p><strong>Email:</strong> contato@flordachapada.com</p>
          <p><strong>Telefone:</strong> (71) 99290-1499</p>
          <div class="footer-redes">
            <a href="#" class="rede-link">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" class="rede-icon-footer" />
            </a>
            <a href="https://www.instagram.com/pastelaria_flor_da_chapada?igsh=ZXFiMm82OW43dXV4" class="rede-link">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" class="rede-icon-footer" />
            </a>
          </div>
        </div>
      </div>
      <div class="footer-creditos">
        <p>&copy; 2024 Flor da Chapada. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import {mapState, mapActions} from "vuex";
import axios from "axios";
import store from './store'; // importar corretamente o store

store.dispatch('carregarCarrinhoDoLocalStorage');

export default {
  name: "App",
  data() {
    return {
      showPopup: false,
      userData: {
        name: '',
        email: ''
      }
    };
  },
  computed: {
    ...mapState({
      carrinho: state => state.carrinho,
      carrinhoAberto: state => state.carrinhoAberto,
    }),
    total() {
      return this.carrinho.reduce((acc, item) => {
        if (item.preco && item.quantidade) {
          return acc + item.preco * item.quantidade;
        }
        return acc;
      }, 0);
    },
    cartCount() {
      return this.carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    }
  },
  mounted() {
    this.$store.dispatch("carregarCarrinho").then(() => {
      console.log("Carrinho carregado:", this.carrinho);
    }).catch((error) => {
      console.error("Erro ao carregar o carrinho:", error);
    });
  },
  methods: {
    ...mapActions([
      "logout",
      "toggleCarrinho",
      "carregarCarrinho"
    ]),
    getImageUrl(imagem) {
      if (!process.env.VUE_APP_SERVER_URL) {
        console.error('A URL do servidor não está definida.');
        return '';
      }
      return `${process.env.VUE_APP_SERVER_URL}/uploads/${imagem}`;
    },
    handleLogout() {
      this.$store.dispatch("logout");
      this.$store.commit("resetCarrinho");
      this.$router.push("/");
    },
    IrParaPerfil() {
      this.$router.push("/perfil")
    },
    async finalizarCompra() {
      try {
        await this.$store.dispatch('finalizarCompra');
        this.$router.push('/ConfirmacaoCompra');
      } catch (error) {
        console.error("Erro ao finalizar a compra:", error);
      }
    },
    async removerItemCarrinho(itemId) {
      console.log('ID do item:', itemId);
      try {
        const apiUrl = process.env.VUE_APP_API_URL;
        const response = await axios.delete(`${apiUrl}/carrinho/${itemId}`, {
          headers: {Authorization: `Bearer ${localStorage.getItem("authToken")}`},
        });

        if (response.data && Array.isArray(response.data.itens)) {
          console.log('Carrinho após remoção:', response.data);
          this.$store.commit("atualizarCarrinho", response.data.itens);
        } else {
          console.error("Formato de resposta inesperado:", response.data);
        }
      } catch (error) {
        console.error("Erro ao remover item do carrinho:", error);
      }
    },
    async aumentarQuantidade(item) {
      try {
        const apiUrl = process.env.VUE_APP_API_URL;
        const response = await axios.patch(
            `${apiUrl}/carrinho/aumentar/${item._id}`,
            {},
            {
              headers: {Authorization: `Bearer ${localStorage.getItem("authToken")}`},
            }
        );

        if (response.data && response.data.itens) {
          this.$store.commit("atualizarCarrinho", response.data.itens);
        } else {
          console.error("Formato de resposta inesperado:", response.data);
        }
      } catch (error) {
        console.error("Erro ao aumentar a quantidade:", error);
      }
    },
    async diminuirQuantidade(item) {
      if (item.quantidade > 1) {
        try {
          const apiUrl = process.env.VUE_APP_API_URL;
          const response = await axios.patch(
              `${apiUrl}/carrinho/diminuir/${item._id}`,
              {},
              {
                headers: {Authorization: `Bearer ${localStorage.getItem("authToken")}`},
              }
          );

          if (response.data && response.data.itens) {
            this.$store.commit("atualizarCarrinho", response.data.itens);
          } else {
            console.error("Formato de resposta inesperado:", response.data);
          }
        } catch (error) {
          console.error("Erro ao diminuir a quantidade:", error);
        }
      }
    },
  },
};
</script>


<style scoped>
.cart-count {
  position: absolute;
  top: 5px;
  right: 20px;
  background-color: red;
  color: white;
  border-radius: 100%;
  padding: 5px 10px;
  font-size: 10px;
}

/* Estilos para o modal do carrinho */
.modal-overlay-carrinho {
  position: fixed;
  top: 10%;
  right: 10px;
  width: 350px;
  height: auto;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* Estilos para o conteúdo do modal */
.modal-content-carrinho {
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  width: 100%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
}

/* Estilos para o título dentro do modal */
.modal-content-carrinho h3 {
  margin-top: 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

/* Estilos para os itens no carrinho */
.carrinho-items-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Estilo de cada item do carrinho */
.carrinho-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.item-info-carrinho {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.item-imagem-carrinho {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-details-carrinho {
  display: flex;
  flex-direction: column;
}

.item-nome-carrinho {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.item-quantidade-carrinho {
  font-size: 14px;
  color: #777;
  margin-top: 5px;
}

/* Estilo para o total do carrinho */
.total-carrinho {
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* Estilo do botão de finalizar compra */
.botao-finalizar {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.botao-finalizar:hover {
  background-color: #218838;
}

.remover-item-icon {
  font-size: 20px; /* Tamanho do ícone */
  color: #ff0000; /* Cor inicial do ícone */
  cursor: pointer; /* Mostrar o cursor de clique */
  margin-left: 10px; /* Espaçamento ao lado do item */
  transition: color 0.3s, transform 0.3s; /* Transição suave para cor e escala */
}

.remover-item-icon:hover {
  color: #d45d4a; /* Cor do ícone ao passar o mouse */
  transform: scale(1.2); /* Aumenta o ícone em 20% */
}

.quantidade-controles {
  display: flex;
  justify-content: center; /* Centraliza os botões */
  align-items: center;
  margin-top: 7px; /* Espaçamento entre os detalhes e os botões */
  margin-right: 50px;
}

.quantidade-btn {
  background-color: #ddd;
  border: none;
  padding: 5px;
  cursor: pointer;
  margin: 0 5px;
  border-radius: 5px;
  font-size: 8px; /* Tamanho menor para os ícones */
}

.quantidade-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.carrinho-icon {
  margin-top: 10px;
  font-size: 32px;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
}

.carrinho-icon:hover {
  transform: scale(1.2);
}

.close-icon {
  position: absolute;
  top: 20px; /* Ajuste conforme necessário */
  left: 22px; /* Ajuste conforme necessário */
  font-size: 24px; /* Tamanho do ícone */
  cursor: pointer;
  color: #000; /* Cor do ícone */
  transition: transform 0.3s ease, color 0.3s ease;
}

.close-icon:hover {
  color: #7b480b; /* Cor ao passar o mouse */
}

.close-icon:active {
  transform: scale(0.9); /* Efeito de escala ao pressionar */
}

ul {
  list-style-type: none;
  margin: 0 !important;
  padding: 0 !important;
}

/* Estilo básico para a navegação */
.logo {
  width: 70px;
}

.rede-link {
  display: inline-block;
  width: 30px;
  height: 30px;
}

.rede-icon {
  width: 30px; /* Tamanho do ícone */
  height: auto;
  filter: invert(100%); /* Inverte as cores para o modo claro */
  transition: transform 0.3s ease; /* Animação suave ao passar o mouse */
  cursor: pointer; /* Mostra que é clicável */
  transition: transform 0.3s ease; /* Animação suave */
  transform: translateY(-50%); /* Ajusta a centralização vertical */
}

.rede-icon-footer{

  width: 30px; /* Tamanho do ícone */
  height: auto;
  filter: invert(100%); /* Inverte as cores para o modo claro */
  transition: transform 0.3s ease; /* Animação suave ao passar o mouse */
  cursor: pointer; /* Mostra que é clicável */
  transition: transform 0.3s ease; /* Animação suave */
  transform: translateY(-50%); /* Ajusta a centralização vertical */

}


.rede-social {
  position: absolute; /* Posiciona os ícones fora do fluxo normal da página */
  top: 60px; /* Distância do topo da barra de navegação */
  right: 100px; /* Distância da margem direita */
  display: flex; /* Alinha os itens horizontalmente */
  justify-content: flex-end; /* Alinha à direita */
  gap: 19px; /* Espaçamento entre os itens */
  z-index: 100; /* Garante que os ícones fiquem acima de outros elementos */
}

.rede-social ul {
  display: flex; /* Organiza os itens em linha */
  list-style: none; /* Remove os marcadores padrão da lista */
  padding: 0; /* Remove o padding padrão */
  margin: 0; /* Remove a margem padrão */
  gap: 15px; /* Espaçamento entre os itens */
}

.rede-social-icon {
  display: flex; /* Permite que o ícone se comporte como um bloco flexível */
  align-items: center; /* Centraliza verticalmente */
  justify-content: center; /* Centraliza horizontalmente */
  filter: invert(100%); /* Inverte as cores para destaque */
  transition: transform 0.4s ease; /* Animação suave */
  transform: translateY(-50%); /* Centraliza verticalmente */
}

.rede-social-icon:hover {
  transform: scale(1.2); /* Efeito de aumentar ao passar o mouse */
}


.rede-social-icon:hover {
  transform: scale(1.2); /* Aumenta o ícone ao passar o mouse */
}

.carrinho-icon {
  width: 50px; /* Tamanho do ícone */
  height: auto;
  filter: invert(100%); /* Inverte as cores */
  transition: transform 0.3s ease; /* Suaviza o efeito */
  position: absolute; /* Posiciona o ícone em relação ao contêiner pai */
  top: 20px; /* Distância do topo (ajuste conforme necessário) */
  right: 10px; /* Distância da direita (ajuste conforme necessário) */
  z-index: 9999; /* Coloca o ícone acima de outros elementos */
}


nav a {
  color: #333;
  text-decoration: none;
  font-weight: bold;
}

router-link-active {
  color: #4CAF50;
}


/* Estilo do Footer */
.footer {
  background-color: #321a02;
  color: #fff;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  max-width: 1200px;
  width: 100%;
}

.footer-section {
  flex: 1;
  min-width: 250px;
}

.footer-titulo {
  font-size: 20px;
  margin-bottom: 10px;
  border-bottom: 2px solid #fff;
  display: inline-block;
}

.footer-descricao {
  font-size: 14px;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #eef6f2;
  text-decoration: none;
  font-size: 14px;
}

.footer-links a:hover {
  text-decoration: underline;
}

.footer-redes {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.rede-link:hover .rede-icon {
  transform: scale(1.1);
}

.footer-creditos {
  margin-top: 20px;
  font-size: 12px;
  border-top: 1px solid #fff;
  padding-top: 10px;
  width: 100%;
  max-width: 1200px;
  text-align: center;
}


/* Smartphones (até 600px) */
@media (max-width: 600px) {

  .carrinho-icon {
    height: 30px;
    width: 40px;
    top: 10px;
    transform: scale(0.9);
    transform-origin: top right;

  }

  .rede-icon {
    right: 10px;
    gap: 15px;
    margin-top: -23px;
  }

  .rede-icon-footer{
    right: 10px;
    gap: 15px;
  }

  .footer-container {
    gap: 20px; /* Menor espaçamento no rodapé */
  }

  .footer-section {
    min-width: 100%; /* Rodapé ocupa toda a largura */
  }

  .footer-titulo {
    font-size: 18px;
  }

  .footer-descricao {
    font-size: 12px;
  }
  .navbar-toggler {
    display: block;
    background: none;
    border: none;
    margin-right: 280px;
    padding: 0;
    width: auto;
    height: auto;
  }

  .navbar-toggler-icon {
    display: block;
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23ffffff' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255,255,255,1)' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .logo {
    width: 48px;
    height: 48px;
  }

  .cart-count {
    position: absolute;
    top: 2px;
    right: 15px;
    background-color: red;
    color: white;
    border-radius: 100%;
    padding: 2px 6px;
    font-size: 10px;
  }

}

/* Tablets (601px a 1024px) */
@media (min-width: 601px) and (max-width: 1024px) {


  .carrinho-icon {
    height: 45px;
    width: 45px;
  }

  .rede-icon {
    top: 10px;
    right: 20px;
    gap: 25px;
  }

  .footer-container {
    gap: 30px;
  }

  .footer-section {
    min-width: 45%; /* Duas colunas no rodapé */
  }

  .footer-titulo {
    font-size: 19px;
  }

  .footer-descricao {
    font-size: 13px;
  }

  .navbar-container {
    justify-content: flex-start;
  }

  .navbar-toggler {
    display: block;
    border: none;
    background-color: transparent;
    padding: 6px;
    margin-left: 10px;
  }

  .navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23ffffff' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255,255,255,1.0)' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    background-size: contain;
    width: 30px;
    height: 30px;
  }



}

/* Desktops grandes (acima de 1024px) */
@media (min-width: 1025px) {

  .footer-container {
    gap: 40px; /* Espaçamento maior entre seções */
  }

  .footer-section {
    min-width: 250px;
  }

  .footer-titulo {
    font-size: 20px;
  }

  .footer-descricao {
    font-size: 14px;
  }
}
</style>
