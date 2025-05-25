<template>
  <div class="adm-form-container">
    <h1 class="adm-form-title">Gerenciar Produtos e Sessões</h1>

    <!-- Formulário para adicionar produto -->
    <form @submit.prevent="adicionarProduto" class="adm-form-fields">
      <input v-model="nome" type="text" placeholder="Nome do Produto" required class="adm-input-field" />
      <textarea v-model="descricao" type="text" placeholder="Descrição" required class="adm-input-field"> </textarea>
      <input
          v-model="preco"
          type="text"
          placeholder="Preço (R$)"
          required
          class="adm-input-field"
          pattern="^[0-9]+(\.[0-9]{1,2})?$"
          title="Use o formato correto, ex: 10.00"
          @input="formatarPreco"
      />


      <!-- Campo de seleção de categoria (seção) -->
      <select v-model="categoria" class="adm-input-field" required>
        <option v-for="sessao in sessoes" :key="sessao" :value="sessao">{{ sessao }}</option>
      </select>

      <!-- Campo de seleção de imagem -->
      <input type="file" @change="handleFileChange" required class="adm-file-input" />
      <button type="submit" class="adm-submit-button" :disabled="isLoading">Adicionar Produto</button>
    </form>

    <!-- Adicionar nova sessão -->
    <div class="adm-section-actions">
      <input v-model="novaSessao" type="text" placeholder="Nova Sessão" class="adm-input-field" />
      <button @click="adicionarSessao" class="adm-add-section-button">Adicionar Sessão</button>
    </div>

    <!-- Remover sessão existente -->
    <div class="adm-section-actions">
      <select v-model="sessaoSelecionada" class="adm-input-field">
        <option v-for="sessao in sessoes" :key="sessao" :value="sessao">{{ sessao }}</option>
      </select>
      <button @click="removerSessao" class="adm-remove-section-button">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>

    <!-- Lista de produtos cadastrados -->
    <div v-if="produtos.length" class="adm-products-list">
      <h2 class="adm-products-title">Produtos Cadastrados</h2>
      <ul>
        <li v-for="produto in produtos" :key="produto._id" class="adm-product-item">
          <span>{{ produto.nome }} ({{ produto.categoria }})</span>
          <div class="adm-product-actions">
            <i class="fas fa-edit adm-edit-icon" @click="iniciarEdicao(produto)"></i>
            <i class="fas fa-trash-alt adm-remove-icon" @click="confirmarRemocao(produto._id)"></i>
          </div>
        </li>
      </ul>
    </div>

    <!-- Formulário de edição de produto -->
    <div v-if="produtoEditando" class="adm-edit-form">
      <h2 class="adm-products-title">Editar Produto</h2>
      <form @submit.prevent="editarProduto" class="adm-form-fields">
        <input v-model="produtoEditando.nome" type="text" placeholder="Nome do Produto" required class="adm-input-field" />
        <textarea
            v-model="produtoEditando.descricao"
            placeholder="Descrição"
            required
            class="adm-input-field"
        ></textarea>
        <input
            v-model="preco"
            type="text"
            placeholder="Preço (R$)"
            required
            class="adm-input-field"
            pattern="^[0-9]+(\.[0-9]{1,2})?$"
            title="Use o formato correto, ex: 10.00"
            @input="formatarPreco"
        />

        <!-- Campo de seleção de categoria (seção) -->
        <select v-model="produtoEditando.categoria" class="adm-input-field" required>
          <option v-for="sessao in sessoes" :key="sessao" :value="sessao">{{ sessao }}</option>
        </select>

        <button type="submit" class="adm-submit-button" :disabled="isLoading">Salvar Alterações</button>
        <button @click="cancelarEdicao" class="adm-cancel-button">Cancelar</button>
      </form>
    </div>

    <!-- Pop-up de confirmação para exclusão -->
    <div v-if="produtoParaRemover" class="adm-confirm-popup">
      <p>Tem certeza de que deseja remover este produto?</p>
      <button @click="removerProduto(produtoParaRemover)" class="adm-confirm-button">Confirmar</button>
      <button @click="cancelarRemocao" class="adm-cancel-button">Cancelar</button>
    </div>

    <p v-if="erro" class="adm-error-message">{{ erro }}</p>
    <p v-if="isLoading" class="loading-message">Carregando...</p>
  </div>
</template>

<script>
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css"; // Importa os ícones do Font Awesome

export default {
  data() {
    return {
      nome: "",
      descricao: "",
      preco: "",
      categoria: "",
      imagem: null,
      erro: null,
      isLoading: false,
      sessoes: ["Lanches", "Bebidas", "Sobremesas","Batata", "Sorvete"],
      novaSessao: "",
      sessaoSelecionada: "",
      produtos: [], // Lista de produtos cadastrados
      produtoEditando: null, // Produto atualmente sendo editado
      produtoParaRemover: null, // Produto aguardando confirmação de remoção
    };
  },
  created() {
    this.carregarProdutos();
  },
  methods: {
    handleFileChange(event) {
      this.imagem = event.target.files[0];
      if (this.imagem && !this.imagem.type.startsWith("image")) {
        this.erro = "Por favor, selecione uma imagem.";
        this.imagem = null;
      } else {
        this.erro = null;
      }
    },
    async adicionarProduto() {
      if (!this.imagem) {
        this.erro = "Selecione uma imagem para o produto.";
        return;
      }
      if (this.preco <= 0) {
        this.erro = "O preço deve ser maior que 0.";
        return;
      }

      // Verifica se a categoria já está presente e usa a existente
      if (!this.sessoes.includes(this.categoria)) {
        this.sessoes.push(this.categoria);
      }

      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append("nome", this.nome);
        formData.append("descricao", this.descricao);
        formData.append("preco", this.preco);
        formData.append("categoria", this.categoria);
        formData.append("imagem", this.imagem);

        await axios.post(`${process.env.VUE_APP_API_URL}/cardapio`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Produto adicionado com sucesso!");
        this.carregarProdutos();
        this.nome = "";
        this.descricao = "";
        this.preco = "";
        this.categoria = "";
        this.imagem = null;
      } catch (error) {
        this.erro = "Erro ao adicionar produto: " + error.message;
      } finally {
        this.isLoading = false;
      }
    },
    formatarPreco() {
      // Substitui a vírgula por ponto no campo de preço, se necessário
      this.preco = this.preco.replace(',', '.');
    },
    adicionarSessao() {
      if (this.novaSessao && !this.sessoes.includes(this.novaSessao)) {
        this.sessoes.push(this.novaSessao);
        this.novaSessao = "";
      } else {
        alert("Seção inválida ou já existente.");
      }
    },
    removerSessao() {
      if (this.sessaoSelecionada) {
        this.sessoes = this.sessoes.filter((sessao) => sessao !== this.sessaoSelecionada);
        this.sessaoSelecionada = "";
      } else {
        alert("Selecione uma seção para remover.");
      }
    },
    async carregarProdutos() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/cardapio`);
        this.produtos = response.data;
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        this.erro = "Erro ao carregar produtos.";
      }
    },
    confirmarRemocao(produtoId) {
      this.produtoParaRemover = produtoId;
    },
    cancelarRemocao() {
      this.produtoParaRemover = null;
    },
    async removerProduto(produtoId) {
      if (!produtoId) {
        this.erro = "ID do produto não encontrado!";
        return;
      }

      try {
        await axios.delete(`${process.env.VUE_APP_API_URL}/cardapio/${produtoId}`);
        this.carregarProdutos(); // Atualiza a lista após remoção
        alert("Produto removido com sucesso!");
      } catch (error) {
        console.error("Erro ao remover produto:", error);
        this.erro = "Erro ao remover produto.";
      } finally {
        this.produtoParaRemover = null;
      }
    },
    iniciarEdicao(produto) {
      this.produtoEditando = { ...produto };
    },
    cancelarEdicao() {
      this.produtoEditando = null;
    },
    async editarProduto() {
      if (!this.produtoEditando) {
        this.erro = "Nenhum produto selecionado para edição.";
        return;
      }

      this.isLoading = true;
      try {
        await axios.put(`${process.env.VUE_APP_API_URL}/cardapio/${this.produtoEditando._id}`, this.produtoEditando);
        alert("Produto atualizado com sucesso!");
        this.carregarProdutos();
        this.cancelarEdicao();
      } catch (error) {
        console.error("Erro ao editar produto:", error);
        this.erro = "Erro ao editar produto.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Contêiner Principal */
.adm-form-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Títulos */
.adm-form-title,
.adm-products-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Campos de formulário */
.adm-form-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.adm-input-field,
.adm-file-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

.adm-input-field:focus,
.adm-file-input:focus {
  border-color: #5c6bc0;
}

/* Botões */
.adm-submit-button,
.adm-add-section-button {
  background-color: #5c6bc0;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 3px;
}

.adm-submit-button:hover,
.adm-add-section-button:hover {
  background-color: #3f4b8e;
  transform: scale(1.05);
}

.adm-submit-button:disabled {
  background-color: #b0b0b0;
  cursor: not-allowed;
}

/* Ações de Seção */
.adm-section-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.adm-section-actions input,
.adm-section-actions button {
  width: 48%;
}

/* Ícones */
.adm-edit-icon,
.adm-remove-icon {
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s, color 0.3s;
}

.adm-edit-icon:hover {
  color: #5c6bc0;
  transform: scale(1.2);
}

.adm-remove-icon:hover {
  color: red;
  transform: scale(1.2);
}

/* Lista de Produtos */
.adm-products-list {
  margin-top: 30px;
}

.adm-product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.adm-product-item span {
  font-size: 16px;
}

/* Pop-up de Confirmação */
.adm-confirm-popup {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-align: center;
}

.adm-confirm-popup p {
  margin-bottom: 20px;
  font-size: 16px;
}

.adm-confirm-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.adm-confirm-button:hover {
  background-color: #388e3c;
  transform: scale(1.05);
}

.adm-cancel-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.adm-cancel-button:hover {
  background-color: #d32f2f;
  transform: scale(1.05);
}
</style>
