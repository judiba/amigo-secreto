let amigos = [];

const inputNome = document.getElementById('amigo');
const listaAmigos = document.getElementById('listaAmigos');
const resultado = document.getElementById('resultado');
const btnSortear = document.querySelector('.button-draw');

function adicionarAmigo() {
  const nome = inputNome.value.trim();
  if (!nome) {
    return;
  }

  if (amigos.includes(nome)) {
    inputNome.value = '';
    inputNome.focus();
    return;
  }

  livros = false; 
  amigos.push(nome);
  renderizarLista();
  inputNome.value = '';
  inputNome.focus();
}

function renderizarLista() {

  listaAmigos.innerHTML = '';

  amigos.forEach((nome, index) => {
    const li = document.createElement('li');
    li.textContent = nome;
    li.className = 'name-item';
    // opcional: adiciona botão para remover
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.className = 'button-remove';
    btnRemover.type = 'button';
    btnRemover.onclick = () => {
      removerAmigo(index);
    };

    li.appendChild(btnRemover);
    listaAmigos.appendChild(li);
  });
}


function removerAmigo(index) {
  if (index >= 0 && index < amigos.length) {
    amigos.splice(index, 1);
    renderizarLista();
  }
}


function sortearAmigo() {
  resultado.innerHTML = ''; 

  if (amigos.length < 2) {
    const li = document.createElement('li');
    li.textContent = 'Adicione pelo menos duas pessoas para sortear.';
    resultado.appendChild(li);
    return;
  }


  const amigosEmbaralhados = amigos.sort(() => Math.random() - 0.5);


  amigosEmbaralhados.forEach((nome, index) => {
    const li = document.createElement('li');
    li.textContent = `${nome} tirou ${amigosEmbaralhados[(index + 1) % amigosEmbaralhados.length]}`;
    resultado.appendChild(li);
  });
}