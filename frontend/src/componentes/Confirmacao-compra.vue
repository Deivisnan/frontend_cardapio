<template>
  <div class="confirmation-container">
    <div class="confirmation-box">
      <h1>Enviar Pedido</h1>
      <p>Obrigado por sua compra, {{ user.name }}!</p>
      <h2>Detalhes da Compra</h2>
      <div v-if="carrinho.length">
        <ul>
          <li v-for="item in carrinho" :key="item.produtoId">
            {{ item.nome }} - {{ item.quantidade }} x R$ {{ item.preco.toFixed(2) }} = R$ {{ (item.quantidade * item.preco).toFixed(2) }}
          </li>
        </ul>
        <p><strong>Total: R$ {{ totalCarrinho.toFixed(2) }}</strong></p>
      </div>
      <router-link to="/" class="home-link">Voltar para a Página Inicial</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmationPage",
  computed: {
    carrinho() {
      return this.$store.state.carrinho;
    },
    user() {
      return this.$store.state.user || { name: "Visitante" };
    },
    totalCarrinho() {
      return this.$store.getters.totalCarrinho;
    },
  },
};
</script>


<style scoped>
.confirmation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}

.confirmation-box {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 400px; /* Define a altura da caixa */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centraliza o conteúdo verticalmente dentro da caixa */
}

.home-link {
  display: inline-block;
  margin-top: 20px;
  text-decoration: none;
  color: #fff;
  background-color: #42b983;
  padding: 10px 20px;
  border-radius: 5px;
}

.home-link:hover {
  background-color: #369f6c;
}
</style>