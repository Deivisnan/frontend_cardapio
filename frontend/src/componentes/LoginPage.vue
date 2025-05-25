<!--pagian de login-->
<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <input
            v-model="email"
            type="email"
            placeholder="E-mail"
            required
            class="input-field"
        />
        <input
            v-model="password"
            type="password"
            placeholder="Senha"
            required
            class="input-field"
        />
        <button type="submit" class="login-button">Entrar</button>
      </form>

      <!-- Botão para redirecionar para a página de cadastro -->
      <p>Não tem uma conta? <router-link to="/cadastro" class="signup-link">Cadastre-se</router-link></p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        console.log("Enviando dados para o backend...");
        const response = await axios.post(`${process.env.VUE_APP_SERVER_URL}/api/usuarios/login`, {
          email: this.email,
          senha: this.password,
        });
        console.log("Resposta recebida:", response);
        const token = response.data.token;
        if (token) {
          console.log("Token recebido:", token);
          localStorage.setItem("token", token);
          this.$store.commit("setToken", token);

          const user = response.data.user;
          this.$store.commit("setUser", user);

          // Verificar se o perfil do usuário existe
          const profileResponse = await axios.get(`${process.env.VUE_APP_API_URL}/perfil/checkUserProfile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (profileResponse.data.registered) {
            // Redireciona para a página de perfil (mypage) se o perfil existir
            this.$router.push("/mypage");
          } else {
            // Redireciona para a página de cadastro se o perfil não existir
            this.$router.push("/CadastroPerfil");
          }

          await this.$store.dispatch("carregarCarrinhoDoLocalStorage");
          await this.$store.dispatch("carregarCarrinho");
          alert("Login bem-sucedido!");
        } else {
          console.error("Token não recebido!");
          alert("Erro ao autenticar: Token não recebido.");
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error.response?.data || error.message);
        alert("Credenciais inválidas ou erro ao tentar fazer login!");
      }
    }
  }

  };
</script>
<style scoped>
/* Container principal */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #120a00, #623605);
  font-family: 'Roboto', sans-serif;
  color: #fff;
}

/* Caixa de login */
.login-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

/* Título */
.login-box h1 {
  margin-bottom: 20px;
  font-size: 2.5rem;
  color: #fff;
}

/* Campos de entrada */
.input-field {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1rem;
  transition: background 0.3s, transform 0.2s;
}

.input-field:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.02);
}

/* Botão de login */
.login-button {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  border: none;
  border-radius: 8px;
  background: #2575fc;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.login-button:hover {
  background: #1b5ecc;
  transform: scale(1.05);
}

.login-button:active {
  transform: scale(0.98);
}

/* Link do cadastro */
.signup-link {
  color: #2575fc;
  text-decoration: none;
  font-weight: bold;
}

.signup-link:hover {
  text-decoration: underline;
}

/* Responsividade */
@media (max-width: 768px) {
  .login-box {
    padding: 30px;
  }

  .login-box h1 {
    font-size: 2rem;
  }

  .input-field {
    font-size: 0.9rem;
  }

  .login-button {
    font-size: 0.9rem;
  }
}
</style>
