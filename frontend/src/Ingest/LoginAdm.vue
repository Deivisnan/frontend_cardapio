<template>
  <div class="login-adm-container">
    <div class="login-adm-card">
      <h1 class="login-adm-title">Login do Administrador</h1>
      <form @submit.prevent="loginAdm" class="login-adm-form">
        <input v-model="email" type="email" placeholder="Email" required class="login-adm-input"/>
        <input v-model="senha" type="password" placeholder="Senha" required class="login-adm-input"/>
        <button type="submit" class="login-adm-button">Entrar</button>
      </form>
      <p v-if="erro" class="error-message">{{ erro }}</p>
    </div>
  </div>
</template>

<script>
// src/Ingest/LoginAdm.vue

import { auth } from "../firebaseConfig"; // Ajuste o caminho conforme necessário
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: '',
      senha: '',
      erro: null,
    };
  },
  methods: {
    async loginAdm() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.senha);

        const user = userCredential.user;

        // Verifique se o email corresponde ao administrador
        if (user.email === "bispodeivisnan@gmail.com") {
          this.erro = null;
          // Redirecionar o administrador para a página de administração
          this.$router.push('/adm');
          // Armazene o token para manter o usuário autenticado
          localStorage.setItem("authToken", user.refreshToken);
        } else {
          this.erro = 'Você não tem permissão para acessar esta área.';
        }
      } catch (error) {
        // Log para inspecionar o erro completo
        console.log('Erro de autenticação:', error);

        // Mensagens de erro específicas
        if (error.code === 'auth/user-not-found') {
          this.erro = 'Email não encontrado.';
        } else if (error.code === 'auth/wrong-password') {
          this.erro = 'Senha incorreta.';
        } else if (error.code === 'auth/invalid-email') {
          this.erro = 'O e-mail fornecido é inválido.';
        } else {
          this.erro = 'Ocorreu um erro ao tentar fazer login.';
        }
      }
    },
  },
};
</script>

<style>
/* Container principal */
.login-adm-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

/* Cartão de login */
.login-adm-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Título do formulário */
.login-adm-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

/* Estilo do formulário */
.login-adm-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Campos de entrada */
.login-adm-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: border 0.3s;
}

.login-adm-input:focus {
  border-color: #5c6bc0; /* Cor de foco */
}

/* Botão de envio */
.login-adm-button {
  background-color: #5c6bc0;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-adm-button:hover {
  background-color: #3f4b8e;
}

/* Mensagem de erro */
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
