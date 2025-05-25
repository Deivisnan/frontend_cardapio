<template>
  <div class="div-banner">
    <img class="banner" :src="require('../assets/img/banner.jpg')" alt="logo" height="50">
  </div>

  <div class="saudacao-container">
    <!-- Mensagem de boas-vindas com o nome do usuário -->
    <h1 class="saudacao-texto">Bem-vindo, {{ nomeUsuario || 'Carregando...' }}!</h1>
  </div>
  <div class="page">
    <main class="d-flex justify-content-center align-items-center">
      <!-- Card do Carrossel -->
      <div class="card carousel-card">
        <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img class="d-block" :src="require('../assets/img/acai.jpeg')" alt="First slide">
            </div>
            <div class="carousel-item">
              <img class="d-block" :src="require('../assets/img/batata.jpeg')" alt="Second slide">
            </div>
            <div class="carousel-item">
              <img class="d-block" :src="require('../assets/img/pastel.jpeg')" alt="Third slide">
            </div>
          </div>
          <!-- Botões de navegação -->
          <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
      </div>
    </main>
  </div>

  <section>
    <div class="mapa">
      <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.475748721151!2d-38.35054804177044!3d-12.877101125329375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7161677f934f7a3%3A0xbe03a1816188c9ba!2sResidencial%20Brisas%20de%20Itinga!5e0!3m2!1spt-BR!2sbr!4v1732039514815!5m2!1spt-BR!2sbr"
          width="700"
          height="450"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nomeUsuario: '',
      userData: null
    };
  },
  created() {
    this.carregarUsuario();
  },
  methods: {
    async carregarUsuario() {
      try {
        const apiUrl = `${process.env.VUE_APP_API_URL}/perfil`;
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.$router.push("/login");
          return;
        }

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        // Aqui você usa o nome do usuário que vem da resposta da API
        this.userData = response.data;
        this.nomeUsuario = this.userData.nome; // Armazena o nome para mostrar na mensagem de boas-vindas

      } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
      }
    }
  }
};
</script>

<style scoped>
.banner {
  margin-top: 90px;
  background-image: url('../assets/img/banner.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 300px;
}

.mapa {
  margin: 0 auto;
  text-align: center;
  max-width: 80%;
  padding: 20px;
}

iframe {
  display: block;
  margin: 0 auto;
}

.page {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-card {
  width: 700px;
  height: 700px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.carousel-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popup span {
  margin-right: 10px;
}

.saudacao-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5vh;
  text-align: center;
  padding: 20px;
}

.saudacao-texto {
  font-size: 3rem;
  font-weight: bold;
  color: #8f5407;
  text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  animation: fadeIn 2s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 420px) {
  .banner {
    margin-top: 50px;
    height: 150px;
    background-position: center;
  }

  .mapa {
    max-width: 100%;
    padding: 10px;
  }
  .page {
    height: auto; /* <- aqui você anula o height fixo */
    align-items: flex-start; /* opcional: evita centralização vertical */
  }
  .carousel-card {
    width: 100%;
    height: auto;
  }

  .saudacao-texto {
    font-size: 1.8rem;
    padding: 0 10px;
  }

  .saudacao-container {
    flex-direction: column;
    height: auto;
  }

  iframe {
    width: 100%;
    height: auto;
  }
}

</style>