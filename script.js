// ================================
// SCRIPT PRINCIPAL CRAZY HEART
// ================================

// Referências do DOM
const destaquesGrid = document.getElementById("destaques");
const produtosGrid = document.getElementById("produtos-grid");
const verTodosBtn = document.getElementById("ver-todos");
const buscaInput = document.getElementById("busca-produto");
const iconeCarrinho = document.getElementById("icone-carrinho");
const qtdCarrinho = document.getElementById("quantidade-carrinho");

// ================================
// FUNÇÃO PARA CRIAR CARD DO PRODUTO
// ================================
function criarCardProduto(produto, mostrarAcoes = false) {
  const card = document.createElement("div");
  card.classList.add("card");

  let acoesHTML = "";

  // Se mostrarAcoes for true, adiciona select de tamanho e qtd
  if (mostrarAcoes && produto.tamanhos) {
    const opcoesTamanho = produto.tamanhos.map(t => `<option>${t}</option>`).join("");
    acoesHTML = `
      <div class="acoes">
        <label>Tamanho: 
          <select>${opcoesTamanho}</select>
        </label>
        <label>Qtd: <input type="number" min="1" value="1"></label>
        <button>Adicionar ao Carrinho</button>
      </div>
    `;
  }

  card.innerHTML = `
    <img src="${produto.imagens[0]}" alt="${produto.nome}">
    <h3>${produto.nome}</h3>
    <p>${produto.descricao}</p>
    <span>R$ ${produto.preco.toFixed(2)}</span>
    ${acoesHTML}
  `;

  // Clique no card abre página de detalhe
  card.addEventListener("click", (e) => {
    if (!e.target.closest("button") && !e.target.closest("select") && !e.target.closest("input")) {
      window.location.href = `produto.html?id=${produto.id}`;
    }
  });

  // Botão de adicionar ao carrinho
  if (mostrarAcoes) {
    const btn = card.querySelector("button");
    const select = card.querySelector("select");
    const qtdInput = card.querySelector("input[type='number']");
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      adicionarAoCarrinho(produto, select.value, parseInt(qtdInput.value));
    });
  }

  return card;
}

// ================================
// MOSTRAR DESTAQUES
// ================================
function getDestaquesSemana() {
  const produtosCopy = [...produtos];
  const destaques = [];
  while(destaques.length < 3 && produtosCopy.length > 0) {
    const index = Math.floor(Math.random() * produtosCopy.length);
    destaques.push(produtosCopy.splice(index, 1)[0]);
  }
  return destaques;
}

function mostrarDestaques() {
  if (!destaquesGrid) return;
  destaquesGrid.innerHTML = "";
  const destaques = getDestaquesSemana();
  destaques.forEach(produto => {
    // Destaques **não mostram tamanho e quantidade**
    destaquesGrid.appendChild(criarCardProduto(produto, false));
  });
}

// ================================
// MOSTRAR PRODUTOS NA HOME
// ================================
function mostrarProdutos(lista = produtos, limitar = true) {
  produtosGrid.innerHTML = "";
  const listaExibir = limitar ? lista.slice(0, 4) : lista;
  listaExibir.forEach(produto => {
    // Home também **não mostra tamanho e quantidade**
    produtosGrid.appendChild(criarCardProduto(produto, false));
  });
}

// ================================
// FILTRO DE PESQUISA
// ================================
if (buscaInput) {
  buscaInput.addEventListener("input", () => {
    const termo = buscaInput.value.toLowerCase();
    const filtrados = produtos.filter(p => 
      p.nome.toLowerCase().includes(termo) ||
      (p.time && p.time.toLowerCase().includes(termo))
    );
    produtosGrid.innerHTML = "";
    filtrados.forEach(produto => produtosGrid.appendChild(criarCardProduto(produto, false)));
  });
}

// ================================
// BOTÃO VER TODOS
// ================================
if (verTodosBtn) {
  verTodosBtn.addEventListener("click", () => {
    mostrarProdutos(produtos, false);
    verTodosBtn.style.display = "none";
  });
}

// ================================
// CARRINHO
// ================================
function adicionarAoCarrinho(produto, tamanho, qtd) {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const idx = carrinho.findIndex(p => p.id === produto.id && p.tamanho === tamanho);
  if (idx > -1) {
    carrinho[idx].qtd += qtd;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      tamanho: tamanho,
      qtd: qtd,
      imagem: produto.imagens[0]
    });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarIconeCarrinho();
  alert(`${produto.nome} adicionado ao carrinho!`);
}

function atualizarIconeCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
  if (qtdCarrinho) qtdCarrinho.innerText = totalItens;
}

if (iconeCarrinho) {
  iconeCarrinho.addEventListener("click", () => {
    window.location.href = "carrinho.html";
  });
}

// ================================
// INICIALIZAÇÃO
// ================================
mostrarDestaques();
mostrarProdutos(produtos, true);
atualizarIconeCarrinho();
