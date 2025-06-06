<template>
  <div class="cardapio-container">
    <div class="menu-lateral">
      <ul>
        <li v-for="(itens, categoria) in cardapioPorCategoria" :key="categoria">
          <a
              :href="`#${categoria}`"
              @click.prevent="scrollToSection(categoria)"
              :class="{ active: isActive(categoria) }"
              class="gradient-text"
          >
            {{ categoria }}
          </a>
        </li>
      </ul>
    </div>

    <div class="cardapio-content">
      <section class="cards">
        <div
            v-for="(itens, categoria) in cardapioPorCategoria"
            :key="categoria"
            :id="categoria"
            class="categoria-container"
        >
          <h2 class="categoria-titulo">{{ categoria }}</h2>

          <div v-if="swiperReady" class="swiper-instance-wrapper">
            <div class="swiper-button-prev" :id="'swiper-button-prev-' + categoria"></div>
            <div class="swiper-button-next" :id="'swiper-button-next-' + categoria"></div>

            <swiper
                :modules="swiperModules" :slides-per-view="3"
                :space-between="20"
                :navigation="{
                  nextEl: '#swiper-button-next-' + categoria,
                  prevEl: '#swiper-button-prev-' + categoria
                }"
                :breakpoints="{
                      0: { slidesPerView: 1, spaceBetween: 10 },  // de 0 até <400px -> 2 cards
                       300: { slidesPerView: 2, spaceBetween: 10 },  // de 0 até <400px -> 2 cards
                       550: { slidesPerView: 3, spaceBetween: 10 },            // de 550 até 599
                       600: { slidesPerView: 3, spaceBetween: 10 },
                       800: { slidesPerView: 2, spaceBetween: 15 },            // de 800 até 899
                       1000: { slidesPerView: 3, spaceBetween: 20 },           // de 1000 até 1199
                       1200: { slidesPerView: 4, spaceBetween: 20 },
                       1400: { slidesPerView: 5, spaceBetween: 20 },           // de 1400 até 1599
                       1650: { slidesPerView: 6, spaceBetween: 20 }            // de 1650 até 1799
                }"
                :pagination="{ clickable: true }" class="card-carousel"
            >
              <swiper-slide
                  v-for="(item, index) in itens"
                  :key="index"
              >
                <div
                    class="card gradient-border"
                    :class="{ flipped: isFlipped(categoria, index) }"
                    @click="toggleFlip(categoria, index)"
                >
                  <i class="plus-btn-details" @click.stop="toggleFlip(categoria, index)"></i>
                  <div class="card-inner">
                    <div class="card-front">
                      <img :src="item.imagem" :alt="item.nome" class="service-image" />
                      <div class="card-content">
                        <h3 class="item-nome">{{ item.nome }}</h3>
                        <p class="item-preco">R$ {{ item.preco.toFixed(2) }}</p>
                      </div>
                      <button
                          class="animated-button raise fixed-button"
                          @click.stop="adicionarAoCarrinho(item)"
                      >
                        <span></span><span></span><span></span><span></span>
                        Adicionar ao Carrinho
                      </button>
                    </div>
                    <div class="card-back">
                      <h3>{{ item.nome }}</h3>
                      <p>{{ item.descricao }}</p>
                    </div>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { reactive } from 'vue';
import '../assets/css/animated-buttons.css';

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
// Import Swiper modules
import { Navigation, Pagination } from 'swiper/modules'; // These were already imported

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default {
  name: "CardapioPage",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      cardapio: [],
      cardapioPorCategoria: {},
      flippedCards: reactive({}),
      activeCategory: null,
      swiperReady: false,
      // SOLUTION: Make the imported Swiper modules available to the template
      swiperModules: [Navigation, Pagination],
    };
  },
  computed: {
    carrinho() {
      return this.$store.state.carrinho;
    },
    carrinhoVazio() {
      return this.carrinho.length === 0;
    }
  },
  methods: {
    async carregarCardapio() {
      try {
        const resposta = await axios.get(`${process.env.VUE_APP_API_URL}/cardapio`);
        this.cardapio = resposta.data;
        this.cardapioPorCategoria = this.agruparPorCategoria(this.cardapio);
        await this.$nextTick(); // Ensures DOM is updated before Swiper initializes
        this.swiperReady = true;
      } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
      }
    },

    async adicionarAoCarrinho(item) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Você precisa estar logado para adicionar ao carrinho.");
          return;
        }

        const itemExistente = this.$store.state.carrinho.find(i => i.produtoId === item._id);
        let quantidadeAtualizada;

        if (itemExistente) {
          quantidadeAtualizada = itemExistente.quantidade + 1;
          this.$store.commit("atualizarQuantidade", {
            produtoId: item._id,
            quantidade: quantidadeAtualizada
          });
        } else {
          quantidadeAtualizada = 1;
          const itemComDetalhes = {
            ...item,
            quantidade: quantidadeAtualizada,
            // Assuming item.imagem is just the filename, construct full URL if needed
            imagem: item.imagem.startsWith('http') ? item.imagem : `${process.env.VUE_APP_SERVER_URL}/uploads/${item.imagem}`,
          };
          this.$store.commit("adicionarItem", itemComDetalhes);
        }

        // Update backend
        await axios.post(
            `${process.env.VUE_APP_API_URL}/carrinho`,
            {
              itens: [
                {
                  produtoId: item._id,
                  nome: item.nome,
                  preco: item.preco,
                  // Ensure correct image path for backend
                  imagem: item.imagem.startsWith('http') ? item.imagem : `${process.env.VUE_APP_SERVER_URL}/uploads/${item.imagem}`,
                  quantidade: quantidadeAtualizada, // Send the updated total quantity for this item
                }
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        console.log(`${item.nome} adicionado ao carrinho!`);
        await this.$store.dispatch("carregarCarrinho"); // Refresh cart from backend
      } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error.response ? error.response.data : error);
        alert("Ocorreu um erro ao adicionar ao carrinho.");
      }
    },

    agruparPorCategoria(itens) {
      return itens.reduce((agrupados, item) => {
        const categoria = item.categoria || "Sem Categoria";
        if (!agrupados[categoria]) {
          agrupados[categoria] = [];
        }
        // Construct full image URL here if not already done
        const itemComImagemCompleta = {
          ...item,
          imagem: item.imagem.startsWith('http') ? item.imagem : `${process.env.VUE_APP_SERVER_URL}/uploads/${item.imagem}`
        };
        agrupados[categoria].push(itemComImagemCompleta);
        return agrupados;
      }, {});
    },

    scrollToSection(categoria) {
      const section = document.getElementById(categoria);
      const title = section?.querySelector('h2.categoria-titulo');
      if (title) {
        const offset = 90.97; // Adjust as needed for your fixed header or other elements
        const elementPosition = title.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        this.activeCategory = categoria;
      }
    },

    isActive(categoria) {
      return this.activeCategory === categoria;
    },

    onScroll() {
      const categorias = Object.keys(this.cardapioPorCategoria);
      let currentCategory = null;
      for (let i = categorias.length - 1; i >= 0; i--) {
        const categoria = categorias[i];
        const section = document.getElementById(categoria);
        if (section) {
          const sectionTop = section.offsetTop;
          // Adjust offset to match scrollToSection or general preference
          if (window.scrollY >= sectionTop - 150) {
            currentCategory = categoria;
            break;
          }
        }
      }
      this.activeCategory = currentCategory;
    },

    toggleFlip(categoria, index) {
      const key = `${categoria}-${index}`;
      // Create a new object for reactivity if you want to clear others
      // If you want multiple cards to be flipped, this logic needs adjustment
      if (this.flippedCards[key]) {
        this.flippedCards = {}; // This will unflip all other cards
        // delete this.flippedCards[key]; // Use this if you want to toggle individually without affecting others
      } else {
        this.flippedCards = {}; // Ensures only one card is flipped at a time
        this.flippedCards[key] = true;
      }
    },

    isFlipped(categoria, index) {
      return !!this.flippedCards[`${categoria}-${index}`];
    }
  },
  mounted() {
    this.carregarCardapio();
    window.addEventListener('scroll', this.onScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }
};
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css?family=Raleway:200');

/* Definição das propriedades CSS customizadas */
@property --color-1 {
  syntax: "<color>";
  inherits: false;
  initial-value: hsl(98 100% 62%);
}

@property --color-2 {
  syntax: "<color>";
  inherits: false;
  initial-value: hsl(204 100% 59%);
}

/* Keyframes que mudam a variável de cor */
@keyframes gradient-change {
  to {
    --color-1: hsl(210 100% 59%);
    --color-2: hsl(310 100% 59%);
  }
}

/* Layout Geral */
.cardapio-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}

/* Menu Lateral */
.menu-lateral {
  width: 250px;
  position: sticky;
  top: 80px;
  height: 100vh;
  background: linear-gradient(45deg, #0f3255, #999089);
  padding: 20px;
  color: #fff;
}

.menu-lateral ul {
  list-style: none;
  padding: 0;
}

.menu-lateral ul li {
  margin-bottom: 15px;
}

.menu-lateral ul li a {
  text-decoration: none;
  color: #fff;
  padding: 12px;
  display: block;
  font-weight: bold;
  transition: background 0.3s, transform 0.3s;
  border-radius: 8px;
}

.menu-lateral ul li a:hover,
.menu-lateral ul li a.active {
  transform: scale(1.2); /* Efeito de escala ao pressionar */
}

/* Gradiente nos textos dos links do menu */
.gradient-text {
  animation: gradient-change 2s linear infinite alternate;
  background: linear-gradient(to right in oklch, var(--color-1), var(--color-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

/* Estilo da borda gradiente dos cards */
.gradient-border {
  --borderWidth: 3px;
  background: #1D1F20;
  position: relative;
  border-radius: var(--borderWidth);
}

.gradient-border:after {
  content: '';
  position: absolute;
  top: calc(-1 * var(--borderWidth));
  left: calc(-1 * var(--borderWidth));
  height: calc(100% + var(--borderWidth) * 2);
  width: calc(100% + var(--borderWidth) * 2);
  background: linear-gradient(60deg, #d3b8a1, #e3ccc3, #b8b0b3, #a0a7b3, #97a1a3, #92bdb8, #8aa591);
  border-radius: calc(2 * var(--borderWidth));
  z-index: -1;
  animation: animatedgradient 3s ease alternate infinite;
  background-size: 300% 300%;
}

@keyframes animatedgradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Conteúdo do Cardápio */
.cardapio-content {
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
  overflow-x: hidden;
  margin-top: 52px;
  max-width: 100%;
}

/* Categorias */
.categoria-container {
  margin-bottom: 40px;
}

.categoria-titulo {
  font-size: 1.8rem;
  color: #333;
  border-bottom: 2px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

/* Cards */

.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Adicionando estilos para a funcionalidade de flip */
.card-container {
  perspective: 1000px; /* Adicione perspectiva para o efeito de flip */
}
.card-inner {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Mantém o botão fixo no final */
  width: 100%;
  height: 400px;
  transform-style: preserve-3d;
  transition: transform 0.8s;
}


.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  width: 100%;
  backface-visibility: hidden;
  position: absolute;
  backface-visibility: hidden; /* Oculta o lado oposto */
  border-radius: 12px;
  flex-grow: 1; /* Faz com que a parte da frente ocupe o espaço disponível */
}
.card-content {
  flex-grow: 1; /* Garante que o conteúdo ocupe espaço disponível */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}


.item-nome {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-preco {
  font-size: 1rem;
  color: #555;
  margin-bottom: 15px;
}


.card .card-back {
  transform: rotateY(180deg);
}


.card:hover {
  transform: translateY(-10px);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

.service-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.card h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

.card p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 15px;
}

.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative; /* Importante para o posicionamento absoluto */
}

.plus-btn-details {
  border-radius: 5px;
  padding: 4px;
  display: inline-block;
  transform: translate(0%, 0%);
  overflow: hidden;
  font-size: 10px;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  position: absolute;
  top: 0.1rem;
  right: 0.1rem;
  border: none;
  cursor: pointer;
  margin-right: 1px;
  transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.plus-btn-details::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: #8592ad;
  opacity: 0;
  transition: .2s opacity ease-in-out;
}

.plus-btn-details:hover::before {
  opacity: 0.2;
}

.plus-btn-details::after {
  content: '+';
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}
.card-carousel {
  padding: 10px 0;
}


.swiper-instance-wrapper {
  position: relative; /* Necessário para posicionar os botões dentro */
  padding: 0 20px; /* Espaçamento opcional para evitar que os botões encostem nas bordas */
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

/* Estilo base dos botões */
.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Posição dos botões */
.swiper-button-prev {
  left: -30px; /* ajuste conforme necessário */
}

.swiper-button-next {
  right: -10px; /* ajuste conforme necessário */
}
.cards {
  width: 100%;       /* Ocupa toda a largura disponível do pai */
  max-width: 1500px; /* Ou ajuste para o tamanho que quiser */
  margin: 0 auto;    /* Centraliza no contêiner */
  box-sizing: border-box;
}



@media (max-width: 800px) {
  .cardapio-container {
    flex-direction: column;
  }

  .menu-lateral {
    width: 100%;
    height: auto;
    position: fixed;
    top: 63px;
    left: 0;
    z-index: 1000;
    background: linear-gradient(45deg, #0f3255, #999089);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
  }

  .menu-lateral ul {
    display: flex;
    flex-direction: row;
    gap: 15px;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .menu-lateral ul li {
    margin: 0;
  }

  .menu-lateral ul li a {
    padding: 8px 10px;
    font-size: 0.9rem;
    text-align: center;
  }

  .cardapio-content {
    margin-top: 80px; /* Para não cobrir o conteúdo com o menu fixo */
  }
  .card-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 3 cards por linha */
    gap: 10px; /* reduz o gap para caber mais */
  }

  .card {
    width: 100%;
    aspect-ratio: 330 / 477; /* mantém proporção */
    padding: 10px;
    border-radius: 8px;
    background: #eee;
    box-sizing: border-box;
  }
}
.cards {
  width: 100%;       /* Ocupa toda a largura disponível do pai */
  max-width: 1500px; /* Ou ajuste para o tamanho que quiser */
  margin: 0 auto;    /* Centraliza no contêiner */
  box-sizing: border-box;
}

</style>

