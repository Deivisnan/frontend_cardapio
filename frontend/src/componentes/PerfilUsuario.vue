<template>
  <div class="perfil-container">
    <h1 class="perfil-title">Meu Perfil</h1>
    <div class="perfil-card" v-if="perfil.nome">
      <div class="perfil-header">
        <h2 class="perfil-name">{{ perfil.nome }}</h2>
        <p class="perfil-phone"><i class="fas fa-phone"></i> {{ perfil.telefone }}</p>
      </div>
      <div class="perfil-info">
        <h3><i class="fas fa-map-marker-alt"></i> Endereço:</h3>
        <p v-if="perfil.endereco">
          {{ perfil.endereco.rua }}, {{ perfil.endereco.numeroCasa }}
        </p>
        <p v-if="perfil.endereco.bairro">
          Bairro: {{ perfil.endereco.bairro }}
        </p>
        <p v-if="perfil.endereco.complemento && perfil.endereco.complemento !== ''">
          Complemento: {{ perfil.endereco.complemento }}
        </p>
        <p v-else>Endereço não disponível.</p>
      </div>
      <div class="actions">
        <router-link to="/EditarPerfil" class="edit-btn">Editar Perfil</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PerfilUsuario",
  data() {
    return {
      perfil: {},
    };
  },
  created() {
    this.carregarPerfil();
  },
  methods: {
    async carregarPerfil() {
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
          },
        });

        this.perfil = response.data;
        console.log("Dados do perfil:", this.perfil);
      } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
      }
    },
  },
};
</script>

<style scoped>
.perfil-container {
  max-width: 800px;
  margin: 125px auto; /* Adiciona espaçamento superior e inferior */
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.perfil-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.perfil-card {
  border: 1px solid #ddd;
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
}

.perfil-header {
  text-align: center;
  margin-bottom: 30px;
}

.perfil-name {
  font-size: 2rem;
  font-weight: bold;
}

.perfil-phone {
  font-size: 1.5rem;
  color: #555;
  margin-top: 10px;
}

.perfil-info {
  margin-bottom: 30px;
  font-size: 1.2rem;
}

.perfil-info h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.perfil-info p {
  font-size: 1.2rem;
  color: #666;
}

.actions {
  text-align: center;
}

.edit-btn {
  padding: 15px 30px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background-color: #0056b3;
}
</style>