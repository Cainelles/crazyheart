// Pega o id da URL
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// Busca o produto correspondente
const produto = produtos.find(p => p.id === id);

const nomeEl = document.getElementById("nome");
const descricaoEl = document.getElementById("descricao");
const precoEl = document.getElementById("preco");
const imagemPrincipal = document.getElementById("imagem-principal");
const miniaturasDiv = document.getElementById("miniaturas");
const infoDiv = document.querySelector(".info");
const iconeCarrinho = document.getElementById("icone-carrinho");
const qtdCarrinho = document.getElementById("quantidade-carrinho");

if (!produto) {
  document.querySelector(".produto-detalhe").innerHTML = "<p>Produto não encontrado!</p>";
} else {
  // Preenche informações do produto
  nomeEl.innerText = produto.nome;
  descricaoEl.innerText = produto.descricao;
  precoEl.innerText = `R$ ${produto.preco.toFixed(2)}`;
  imagemPrincipal.src = produto.imagens[0];

  // Limpa e cria miniaturas
  miniaturasDiv.innerHTML = "";
  produto.imagens.forEach(img => {
    const mini = document.createElement("img");
    mini.src = img;
    mini.classList.add("miniatura");
    mini.addEventListener("click", () => {
      imagemPrincipal.src = img;
    });
    miniaturasDiv.appendChild(mini);
  });

  // Cria ação de compra
  const acoesDiv = document.createElement("div");
  acoesDiv.classList.add("acoes");

  // Select de tamanho
  const tamanhoLabel = document.createElement("label");
  tamanhoLabel.innerText = "Tamanho: ";
  const tamanhoSelect = document.createElement("select");
  ["P", "M", "G", "GG"].forEach(tam => {
    const option = document.createElement("option");
    option.value = tam;
    option.innerText = tam;
    tamanhoSelect.appendChild(option);
  });
  tamanhoLabel.appendChild(tamanhoSelect);

  // Quantidade
  const qtdLabel = document.createElement("label");
  qtdLabel.innerText = "Qtd: ";
  const qtdInput = document.createElement("input");
  qtdInput.type = "number";
  qtdInput.min = 1;
  qtdInput.value = 1;
  qtdLabel.appendChild(qtdInput);

  // Botão comprar
  const btnComprar = document.createElement("button");
  btnComprar.innerText = "COMPRAR";
  btnComprar.addEventListener("click", () => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const tamanho = tamanhoSelect.value;
    const qtd = parseInt(qtdInput.value);

    // Verifica se já existe o produto com mesmo tamanho
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
    alert(`${produto.nome} adicionado ao carrinho!`);
    atualizarCarrinhoHeader();
  });

  acoesDiv.appendChild(tamanhoLabel);
  acoesDiv.appendChild(qtdLabel);
  acoesDiv.appendChild(btnComprar);

  infoDiv.appendChild(acoesDiv);
}

// === FUNÇÃO PARA ATUALIZAR ÍCONE DO CARRINHO NO HEADER ===
function atualizarCarrinhoHeader() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
  qtdCarrinho.innerText = totalItens;
}

// Clique no ícone leva para página do carrinho
if (iconeCarrinho) {
  iconeCarrinho.addEventListener("click", () => {
    window.location.href = "carrinho.html";
  });
}

// Atualiza carrinho ao carregar a página
atualizarCarrinhoHeader();
