<template>
  <div class="cadastro-container">
    <h1>Cadastro de Usuário</h1>
    <form @submit.prevent="cadastrarUsuario">
      <input
          v-model="nome"
          type="text"
          placeholder="Nome"
          required
          class="input-field"
      />
      <input
          v-model="email"
          type="email"
          placeholder="E-mail"
          required
          class="input-field"
      />
      <div class="password-container">
        <input
            v-model="senha"
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Senha"
            required
            class="input-field"
        />
        <button
            type="button"
            class="toggle-password"
            @click="togglePasswordVisibility"
        >
          <i :class="isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
      <input
          v-model="confirmarSenha"
          :type="isPasswordVisible ? 'text' : 'password'"
          placeholder="Confirme a Senha"
          required
          class="input-field"
      />
      <button type="submit" class="submit-button" :disabled="isSubmitting">
        Cadastrar
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
    <p class="login-prompt">
      Já tem uma conta?
      <router-link to="/" class="signup-link">Entre</router-link>
    </p>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "CadastroUsuario",
  data() {
    return {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "", // Adicionar campo de confirmação de senha
      isPasswordVisible: false, // Controle de visibilidade da senha
      isSubmitting: false, // Flag para desabilitar o botão durante o envio
      errorMessage: "", // Para armazenar o erro
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    async cadastrarUsuario() {
      // Validações de campos
      if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
        this.errorMessage = "Todos os campos são obrigatórios!";
        return;
      }

      // Validação do formato de email
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(this.email)) {
        this.errorMessage = "Por favor, insira um e-mail válido!";
        return;
      }

      // Verificar se as senhas coincidem
      if (this.senha !== this.confirmarSenha) {
        this.errorMessage = "As senhas não coincidem!";
        return;
      }

      try {
        this.isSubmitting = true; // Desabilita o botão de enviar enquanto processa

        // Enviar os dados para a API de cadastro
        const response = await axios.post(
            `${process.env.VUE_APP_API_URL}/usuarios/cadastro`,
            {
              nome: this.nome,
              email: this.email,
              senha: this.senha,
            }
        );

        alert(response.data.message); // Exibe mensagem do sucesso
        this.$router.push("/"); // Redireciona para a página de login após cadastro
      } catch (error) {
        console.error(
            "Erro ao cadastrar usuário:",
            error.response ? error.response.data.error : error.message
        );

        // Exibe o erro específico retornado pelo backend, se existir
        this.errorMessage = error.response
            ? error.response.data.error
            : "Erro ao realizar cadastro. Tente novamente.";
      } finally {
        this.isSubmitting = false; // Reabilita o botão de envio
      }
    },
  },
};
</script>

<style scoped>
/* Estilo geral do container */
.cadastro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Altura total da viewport */
  background: linear-gradient(135deg, #120a00, #623605); /* Gradiente do fundo */
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  font-size: 2rem;
  color: #fff; /* Título branco */
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px; /* Largura máxima */
  background-color: rgba(255, 255, 255, 0.2); /* Fundo translúcido */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra do formulário */
}

.input-field {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: none;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.9); /* Fundo branco */
  color: #000; /* Texto escuro */
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.password-container {
  display: flex;
  align-items: center;
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: -10px;               /* sempre no canto direito */
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #623605;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  z-index: 10;
}
.input-field:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(98, 54, 5, 0.8); /* Destaque no foco */
}

.submit-button {
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #623605; /* Botão marrom */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #3d2403; /* Tom mais escuro no hover */
}

.submit-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.login-prompt {
  margin-top: 20px;
  color: #fff;
  font-size: 1rem;
}

.signup-link {
  color: #ffd700; /* Link amarelo */
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

.error-message {
  color: #ff4d4d;
  font-size: 0.9rem;
  margin-top: 10px;
}

@media (max-width: 600px) {
  .cadastro-container {
    padding: 10px;
  }

  h1 {
    font-size: 1.5rem;
    text-align: center;
  }

  form {
    padding: 15px;
    width: 100%;
  }

  .input-field {
    font-size: 0.95rem;
    padding: 10px;
  }

  .submit-button {
    font-size: 0.95rem;
    padding: 10px;
  }

  .password-container .input-field {
    padding-right: 40px; /* mantém espaço pro olho no mobile */
  }


  .toggle-password {
    position: absolute;
    top: 50%;
    left: 150px;               /* sempre no canto direito */
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #623605;
    cursor: pointer;
    font-weight: bold;
    font-size: 1.2rem;
    z-index: 10;
  }

  .login-prompt {
    font-size: 0.9rem;
    text-align: center;
  }
}




</style>