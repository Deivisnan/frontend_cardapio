<template>
  <div class="cadastro-perfil-container">
    <h1>Cadastro de Perfil do Usuário</h1>
    <form @submit.prevent="cadastrarPerfil">
      <input v-model="nome" type="text" placeholder="Nome" required class="input-field" />
      <input v-model="telefone" type="tel" placeholder="Número de Telefone" required class="input-field" :pattern="telefonePattern" />
      <input v-model="endereco" type="text" placeholder="Bairro" required class="input-field" />
      <input v-model="rua" type="text" placeholder="Rua" required class="input-field" />
      <input v-model="numeroCasa" type="text" placeholder="Número da Casa" required class="input-field" />
      <input v-model="complemento" type="text" placeholder="Complemento" class="input-field" />
      <button
          :class="buttonState"
          @click="handleButtonClick"
          :disabled="isSubmitting"
      >
        {{ buttonLabel }}
      </button>
    </form>

    <!-- Exibir mensagens de erro ou sucesso -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CadastroPerfilUsuario",
  data() {
    return {
      nome: "",
      telefone: "",
      endereco: "",
      rua: "",
      numeroCasa: "",
      complemento: "",
      isSubmitting: false,
      errorMessage: "",
      successMessage: "", // Nova variável para mensagens de sucesso
      telefonePattern: "^[0-9]{10,11}$",
      buttonState: "", // 'onclic', 'validate' ou vazio
      buttonLabel: "Salvar",
    };
  },
  mounted() {
    this.carregarPerfil();
  },
  methods: {
    handleButtonClick() {
      // Valida se todos os campos obrigatórios estão preenchidos
      const isFormValid = this.nome.trim() && this.telefone.trim() && this.rua.trim() && this.numeroCasa.trim();

      if (!isFormValid) {
        this.errorMessage = "Por favor, preencha todos os campos obrigatórios!";
        return;
      }

      if (this.isSubmitting) return;

      // Animação do botão
      this.buttonState = "onclic";
      setTimeout(() => {
        this.buttonState = "validate";
        this.buttonLabel = "✔";
        setTimeout(() => {
          this.buttonState = "";
          this.buttonLabel = "Salvar";
        }, 1250);
      }, 2250);
    },
    async carregarPerfil() {
      try {
        const apiUrl = `${process.env.VUE_APP_API_URL}/perfil`;
        const token = localStorage.getItem("authToken");
        if (!token) {
          this.errorMessage = "Token de autenticação não encontrado!";
          return;
        }
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          this.nome = response.data.nome;
          this.telefone = response.data.telefone;
          this.rua = response.data.endereco.rua;
          this.numeroCasa = response.data.endereco.numeroCasa;
          this.complemento = response.data.endereco.complemento;
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        this.errorMessage = "Erro ao carregar perfil. Tente novamente.";
      }
    },
    async cadastrarPerfil() {
      const apiUrl = `${process.env.VUE_APP_API_URL}/perfil`;
      const token = localStorage.getItem("authToken");
      if (!token) {
        this.errorMessage = "Token de autenticação não encontrado!";
        return;
      }
      try {
        this.isSubmitting = true;
        this.handleButtonClick(); // Animação ao clicar

        // Enviar os dados para o backend, incluindo o campo bairro
        const response = await axios.post(
            apiUrl,
            {
              nome: this.nome,
              telefone: this.telefone,
              endereco: {
                bairro: this.endereco, // Agora o valor de 'endereco' será passado como 'bairro'
                rua: this.rua,
                numeroCasa: this.numeroCasa,
                complemento: this.complemento,
              },
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
        );

        // Armazenar a mensagem de sucesso
        this.successMessage = response.data.message || "Cadastro/atualização realizado com sucesso!";
        this.errorMessage = ""; // Limpar a mensagem de erro

        // Esperar a animação do botão terminar antes de redirecionar
        setTimeout(() => {
          this.$router.push("/perfil");
        }, 3000); // Ajuste o tempo conforme necessário (3 segundos, por exemplo)

      } catch (error) {
        console.error("Erro ao cadastrar/editar perfil:", error);
        this.errorMessage = "Erro ao realizar cadastro/atualização. Tente novamente.";
        this.successMessage = ""; // Limpar a mensagem de sucesso
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
@keyframes clickAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes validateAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}

.cadastro-perfil-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #120a00, #623605);
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.input-field {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: none;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-field:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(98, 54, 5, 0.8);
}

button {
  outline: none;
  height: 40px;
  text-align: center;
  width: 130px;
  border-radius: 40px;
  background: #fff;
  border: 2px solid #8f5407;
  color: #8f5407;
  letter-spacing: 1px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    color: white;
    background: #7b480b;
  }

  &:active {
    letter-spacing: 2px;
  }
}

.onclic {
  width: 40px;
  border-color: #bbbbbb;
  border-width: 3px;
  font-size: 0;
  border-left-color: #603a0d;
  animation: clickAnimation 2s 0.25s linear infinite;

  &::after {
    content: "";
  }

  &:hover {
    color: #5c2d06;
    background: white;
  }
}

.validate {
  font-size: 13px;
  color: white;
  background: #1ECD97;
}
</style>
