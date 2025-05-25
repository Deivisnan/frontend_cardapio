<template>
  <div class="editar-perfil-container">
    <h1>Editar Perfil</h1>
    <form @submit.prevent="editarPerfil">
      <div class="form-group">
        <label for="nome">Nome</label>
        <input v-model="nome" type="text" id="nome" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="telefone">Telefone</label>
        <input v-model="telefone" type="text" id="telefone" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="bairro">Bairro</label>
        <input v-model="bairro" type="text" id="bairro" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="rua">Rua</label>
        <input v-model="rua" type="text" id="rua" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="numeroCasa">Número</label>
        <input v-model="numeroCasa" type="text" id="numeroCasa" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="complemento">Complemento</label>
        <input v-model="complemento" type="text" id="complemento" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Salvar Alterações</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "EditarPerfil",
  data() {
    return {
      nome: '',
      telefone: '',
      bairro: '', // Adicionamos o campo para bairro
      rua: '',
      numeroCasa: '',
      complemento: '',
      errorMessage: ''
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
          }
        });

        // Preenchendo os campos com os dados do perfil
        this.nome = response.data.nome;
        this.telefone = response.data.telefone;
        this.bairro = response.data.endereco.bairro; // Carregando o bairro
        this.rua = response.data.endereco.rua;
        this.numeroCasa = response.data.endereco.numeroCasa;
        this.complemento = response.data.endereco.complemento;

      } catch (error) {
        console.error("Erro ao carregar perfil para edição:", error);
      }
    },

    async editarPerfil() {
      try {
        const apiUrl = `${process.env.VUE_APP_API_URL}/perfil`;
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.$router.push("/login");
          return;
        }

        const response = await axios.put(apiUrl, {
          nome: this.nome,
          telefone: this.telefone,
          endereco: {
            bairro: this.bairro, // Enviando o bairro
            rua: this.rua,
            numeroCasa: this.numeroCasa,
            complemento: this.complemento
          }
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        alert(response.data.message || "Perfil atualizado com sucesso!");
        this.$router.push("/perfil");

      } catch (error) {
        console.error("Erro ao editar perfil:", error);
        this.errorMessage = "Erro ao salvar as alterações. Tente novamente.";
      }
    }
  }
};
</script>

<style scoped>
.editar-perfil-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.editar-perfil-container h1 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  font-size: 16px;
}

input.form-control {
  width: 100%;
  padding: 12px 15px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
  outline: none;
}

button.btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.btn:hover {
  background-color: #0056b3;
}

button.btn:focus {
  outline: none;
}

.error-message {
  color: #ff4d4d;
  font-size: 14px;
  text-align: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .editar-perfil-container {
    padding: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  input.form-control, button.btn {
    font-size: 14px;
  }
}
</style>
