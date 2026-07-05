/* ============================================================
   AMIGO SECRETO CYBERPUNK — app.js
   ============================================================ */

'use strict';

// ---- Chave de armazenamento ----
const STORAGE_KEY = 'amigo_secreto_participantes';
const RESULTADO_KEY = 'amigo_secreto_resultado';

// ---- Carregar / salvar participantes no localStorage ----
function salvarParticipantes(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function carregarParticipantes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function salvarResultado(resultado) {
  localStorage.setItem(RESULTADO_KEY, JSON.stringify(resultado));
}

function carregarResultado() {
  try {
    return JSON.parse(localStorage.getItem(RESULTADO_KEY)) || null;
  } catch {
    return null;
  }
}

/* ============================================================
   UTILITÁRIOS
   ============================================================ */

// Valida e-mail básico
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Normaliza número de WhatsApp (apenas dígitos)
function normalizarWhatsapp(numero) {
  return numero.replace(/\D/g, '');
}

// Valida WhatsApp (mínimo 10 dígitos)
function validarWhatsapp(numero) {
  return normalizarWhatsapp(numero).length >= 10;
}

// Formata WhatsApp para exibição
function formatarWhatsapp(numero) {
  const d = normalizarWhatsapp(numero);
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return numero;
}

// Máscara de WhatsApp ao digitar
function mascararWhatsapp(input) {
  let v = input.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length <= 2)         input.value = v;
  else if (v.length <= 6)    input.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else if (v.length <= 10)   input.value = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
  else                       input.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
}

// Embaralha array (Fisher-Yates)
function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Gera sorteio sem self-match
function gerarSorteio(participantes) {
  if (participantes.length < 2) return null;

  let resultado = null;
  let tentativas = 0;

  while (!resultado && tentativas < 1000) {
    tentativas++;
    const embaralhados = embaralhar(participantes);
    let valido = true;

    for (let i = 0; i < participantes.length; i++) {
      if (participantes[i].nome === embaralhados[i].nome) {
        valido = false;
        break;
      }
    }

    if (valido) {
      resultado = participantes.map((p, i) => ({
        dador: p,
        sorteado: embaralhados[i],
        enviado: false
      }));
    }
  }

  return resultado;
}

/* ============================================================
   PARTÍCULAS DE FUNDO
   ============================================================ */
function iniciarParticulas() {
  const container = document.getElementById('particles');
  if (!container) return;

  const cores = ['#00f5ff', '#ff00cc', '#00ff87', '#f5e642'];
  const total = 30;

  for (let i = 0; i < total; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 20}%;
      background: ${cores[Math.floor(Math.random() * cores.length)]};
      animation-duration: ${Math.random() * 8 + 6}s;
      animation-delay: ${Math.random() * 8}s;
      box-shadow: 0 0 ${size * 2}px currentColor;
    `;
    container.appendChild(p);
  }
}

/* ============================================================
   PÁGINA DE CADASTRO (index.html)
   ============================================================ */
function initCadastro() {
  const inputNome       = document.getElementById('inputNome');
  const inputSobrenome  = document.getElementById('inputSobrenome');
  const inputEmail      = document.getElementById('inputEmail');
  const inputWhatsapp   = document.getElementById('inputWhatsapp');
  const btnAdicionar    = document.getElementById('btnAdicionar');
  const listaEl         = document.getElementById('listaParticipantes');
  const countBadge      = document.getElementById('countBadge');
  const indicatorDot    = document.getElementById('indicatorDot');
  const minText         = document.getElementById('minText');
  const statusMsg       = document.getElementById('mensagemStatus');
  const drawAction      = document.getElementById('drawAction');

  if (!inputNome) return; // não está na página certa

  let participantes = carregarParticipantes();

  // Máscara de WhatsApp
  inputWhatsapp.addEventListener('input', () => mascararWhatsapp(inputWhatsapp));

  // Mostrar/ocultar campos de acordo com o canal selecionado
  function atualizarCamposCanal() {
    const canal = document.querySelector('input[name="canal"]:checked')?.value || 'email';
    const groupEmail    = document.getElementById('groupEmail');
    const groupWhatsapp = document.getElementById('groupWhatsapp');

    if (canal === 'email') {
      groupEmail.style.display    = '';
      groupWhatsapp.style.display = 'none';
      inputWhatsapp.value = '';
    } else {
      groupEmail.style.display    = 'none';
      groupWhatsapp.style.display = '';
      inputEmail.value = '';
    }
  }

  // Ouvir mudança de canal
  document.querySelectorAll('input[name="canal"]').forEach(r => {
    r.addEventListener('change', atualizarCamposCanal);
  });
  atualizarCamposCanal(); // estado inicial

  // Permitir Enter para adicionar
  [inputNome, inputSobrenome, inputEmail, inputWhatsapp].forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        adicionarParticipante();
      }
    });
  });

  btnAdicionar.addEventListener('click', adicionarParticipante);

  function mostrarStatus(msg, tipo) {
    statusMsg.textContent = msg;
    statusMsg.className = `status-message ${tipo}`;
    if (tipo !== 'info') {
      setTimeout(() => {
        statusMsg.textContent = '';
        statusMsg.className = 'status-message';
      }, 3500);
    }
  }

  function adicionarParticipante() {
    const nome      = inputNome.value.trim();
    const sobrenome = inputSobrenome.value.trim();
    const email     = inputEmail.value.trim();
    const whatsapp  = inputWhatsapp.value.trim();
    const canal     = document.querySelector('input[name="canal"]:checked')?.value || 'email';

    // Validações obrigatórias
    if (!nome) {
      mostrarStatus('⚠ Preencha o nome do participante.', 'error');
      inputNome.focus();
      return;
    }
    if (!sobrenome) {
      mostrarStatus('⚠ Preencha o sobrenome do participante.', 'error');
      inputSobrenome.focus();
      return;
    }

    // Validação condicional por canal escolhido
    if (canal === 'email') {
      if (!validarEmail(email)) {
        mostrarStatus('⚠ Informe um e-mail válido para o canal selecionado.', 'error');
        inputEmail.focus();
        return;
      }
      // Duplicata por e-mail
      if (participantes.some(p => p.email && p.email.toLowerCase() === email.toLowerCase())) {
        mostrarStatus('⚠ Este e-mail já foi cadastrado.', 'error');
        inputEmail.focus();
        return;
      }
    } else {
      if (!validarWhatsapp(whatsapp)) {
        mostrarStatus('⚠ Informe um número de WhatsApp válido (mín. 10 dígitos).', 'error');
        inputWhatsapp.focus();
        return;
      }
      // Duplicata por WhatsApp
      const wpNorm = normalizarWhatsapp(whatsapp);
      if (participantes.some(p => p.whatsapp && normalizarWhatsapp(p.whatsapp) === wpNorm)) {
        mostrarStatus('⚠ Este WhatsApp já foi cadastrado.', 'error');
        inputWhatsapp.focus();
        return;
      }
    }

    const nomeCompleto = `${nome} ${sobrenome}`;

    participantes.push({
      nome: nomeCompleto,
      email: canal === 'email' ? email.toLowerCase() : '',
      whatsapp: canal === 'whatsapp' ? normalizarWhatsapp(whatsapp) : '',
      canal
    });

    salvarParticipantes(participantes);
    renderizarLista();
    limparFormulario();
    mostrarStatus(`✓ ${nomeCompleto} adicionado com sucesso!`, 'success');
    inputNome.focus();
  }

  function limparFormulario() {
    inputNome.value      = '';
    inputSobrenome.value = '';
    inputEmail.value     = '';
    inputWhatsapp.value  = '';
    // Resetar canal para e-mail e atualizar visibilidade dos campos
    const radioEmail = document.getElementById('canalEmail');
    if (radioEmail) radioEmail.checked = true;
    atualizarCamposCanal();
  }

  function removerParticipante(index) {
    participantes.splice(index, 1);
    salvarParticipantes(participantes);
    renderizarLista();
  }

  function renderizarLista() {
    listaEl.innerHTML = '';
    const total = participantes.length;

    countBadge.textContent = total;

    // Indicador mínimo
    if (total >= 4) {
      indicatorDot.className = 'indicator-dot ready';
      minText.textContent = `✓ Pronto para sortear! (${total} participantes)`;
      minText.style.color = 'var(--success)';
      drawAction.style.display = 'flex';
    } else {
      indicatorDot.className = 'indicator-dot';
      const faltam = 4 - total;
      minText.textContent = `Faltam ${faltam} participante${faltam > 1 ? 's' : ''} para o sorteio`;
      minText.style.color = '';
      drawAction.style.display = 'none';
    }

    participantes.forEach((p, index) => {
      const li = document.createElement('li');
      li.className = 'participant-item';
      li.setAttribute('role', 'listitem');

      const canalBadge = p.canal === 'whatsapp'
        ? `<span class="participant-channel channel-whatsapp">💬 WHATSAPP</span>`
        : `<span class="participant-channel channel-email">✉ E-MAIL</span>`;

      const contato = p.canal === 'whatsapp'
        ? formatarWhatsapp(p.whatsapp)
        : (p.email || '—');

      li.innerHTML = `
        <div class="participant-info">
          <span class="participant-name">${p.nome}</span>
          <span class="participant-contact">${contato}</span>
        </div>
        ${canalBadge}
        <button class="btn-remove" type="button" aria-label="Remover ${p.nome}">✕ REM</button>
      `;

      li.querySelector('.btn-remove').addEventListener('click', () => removerParticipante(index));
      listaEl.appendChild(li);
    });
  }

  // Render inicial
  renderizarLista();
}

/* ============================================================
   PÁGINA DE SORTEIO (sorteio.html)
   ============================================================ */
function initSorteio() {
  const btnExecutar    = document.getElementById('btnExecutarSorteio');
  const panelPre       = document.getElementById('panelPreSorteio');
  const panelResultado = document.getElementById('panelResultado');
  const summaryCount   = document.getElementById('summaryCount');
  const summaryList    = document.getElementById('summaryList');
  const listaResultado = document.getElementById('listaResultado');
  const btnEnviarTodos = document.getElementById('btnEnviarTodos');
  const btnNovoSorteio = document.getElementById('btnNovoSorteio');
  const noParticipants = document.getElementById('noParticipants');
  const btnDrawAction  = document.getElementById('btnDrawAction');
  const dispatchPanel  = document.getElementById('dispatchPanel');

  if (!btnExecutar) return; // não está na página certa

  const participantes = carregarParticipantes();
  let resultado = carregarResultado();

  // Atualiza resumo
  summaryCount.textContent = `${participantes.length} participante${participantes.length !== 1 ? 's' : ''} cadastrado${participantes.length !== 1 ? 's' : ''}`;

  if (participantes.length < 4) {
    noParticipants.style.display = 'flex';
    if (btnDrawAction) btnDrawAction.style.display = 'none';
    noParticipants.querySelector('p').textContent =
      participantes.length === 0
        ? '⚠ Nenhum participante cadastrado.'
        : `⚠ Mínimo 4 participantes necessários. Cadastrados: ${participantes.length}`;
  } else {
    // Preenche resumo (apenas nomes, sem revelar pares)
    participantes.forEach(p => {
      const li = document.createElement('li');
      li.className = 'summary-item';
      const canal = p.canal === 'whatsapp'
        ? `💬 ${formatarWhatsapp(p.whatsapp)}`
        : `✉ ${p.email}`;
      li.innerHTML = `<span>${p.nome}</span> — ${canal}`;
      summaryList.appendChild(li);
    });

    // Se já há resultado salvo, mostrar painel de disparo
    if (resultado) {
      exibirPainelDisparo(resultado);
    }
  }

  btnExecutar.addEventListener('click', executarSorteio);

  function executarSorteio() {
    if (participantes.length < 4) {
      mostrarToast('⚠ Mínimo de 4 participantes necessário.', 'error');
      return;
    }

    btnExecutar.disabled = true;
    btnExecutar.querySelector('.btn-glitch').textContent = '⟳ SORTEANDO...';

    setTimeout(() => {
      resultado = gerarSorteio(participantes);

      if (!resultado) {
        mostrarToast('Erro ao gerar sorteio. Tente novamente.', 'error');
        btnExecutar.disabled = false;
        btnExecutar.querySelector('.btn-glitch').textContent = '⚡ EXECUTAR SORTEIO';
        return;
      }

      salvarResultado(resultado);
      exibirPainelDisparo(resultado);
    }, 800);
  }

  // Exibe somente o painel de disparo anônimo — sem revelar os pares
  function exibirPainelDisparo(res) {
    panelPre.style.display = 'none';
    panelResultado.style.display = 'block';

    // Monta lista anônima (apenas mostra o participante, sem revelar quem tirou quem)
    listaResultado.innerHTML = '';
    res.forEach((par, index) => {
      const li = document.createElement('li');
      li.className = `result-card${par.enviado ? ' sent' : ''}`;
      li.setAttribute('role', 'listitem');
      li.dataset.index = index;

      const canalBadge = par.dador.canal === 'whatsapp'
        ? `<span class="result-channel-badge channel-whatsapp">💬 WPP</span>`
        : `<span class="result-channel-badge channel-email">✉ EMAIL</span>`;

      const statusEnviado = par.enviado
        ? `<span class="badge-enviado">✓ NOTIFICADO</span>`
        : '';

      li.innerHTML = `
        <div class="result-card-info">
          <span class="result-giver">${par.dador.nome}</span>
          <span class="result-arrow result-secret">🔒 amigo secreto: <em>oculto</em></span>
          ${statusEnviado}
        </div>
        ${canalBadge}
      `;

      listaResultado.appendChild(li);
    });

    atualizarBotaoEnviarTodos(res);
  }

  // Atualiza o estado do botão "Enviar para Todos"
  function atualizarBotaoEnviarTodos(res) {
    const todosEnviados = res.every(p => p.enviado);
    if (btnEnviarTodos) {
      if (todosEnviados) {
        btnEnviarTodos.disabled = true;
        btnEnviarTodos.querySelector('.btn-glitch').textContent = '✓ TODOS NOTIFICADOS';
      } else {
        btnEnviarTodos.disabled = false;
        const pendentes = res.filter(p => !p.enviado).length;
        btnEnviarTodos.querySelector('.btn-glitch').textContent = `📡 DISPARAR PARA TODOS (${pendentes})`;
      }
    }
  }

  // Envia notificação para um único participante (pelo índice)
  function enviarNotificacao(index) {
    const par = resultado[index];
    if (!par || par.enviado) return;

    const { dador, sorteado } = par;

    const mensagem = encodeURIComponent(
      `🎁 Olá, ${dador.nome}!\n\n` +
      `Você está participando do Amigo Secreto!\n` +
      `Seu amigo secreto é: *${sorteado.nome}* ⚡\n\n` +
      `Boa sorte e boas surpresas! 🎉\n` +
      `// AMIGO SECRETO CYBERPUNK //`
    );

    if (dador.canal === 'whatsapp') {
      const numero = dador.whatsapp.startsWith('55') ? dador.whatsapp : '55' + dador.whatsapp;
      window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
    } else {
      const assunto = encodeURIComponent('🎁 Seu Amigo Secreto!');
      window.open(`mailto:${dador.email}?subject=${assunto}&body=${mensagem}`, '_blank');
    }

    // Marcar como enviado
    resultado[index].enviado = true;
    salvarResultado(resultado);

    // Atualizar visual do card
    const li = listaResultado.querySelector(`[data-index="${index}"]`);
    if (li) {
      li.classList.add('sent');
      const info = li.querySelector('.result-card-info');
      if (info && !info.querySelector('.badge-enviado')) {
        const badge = document.createElement('span');
        badge.className = 'badge-enviado';
        badge.textContent = '✓ NOTIFICADO';
        info.appendChild(badge);
      }
    }

    atualizarBotaoEnviarTodos(resultado);
    mostrarToast(`✓ Notificação enviada para ${dador.nome}`, 'success');
  }

  // Botão "Enviar para Todos" — disparo sequencial anônimo
  if (btnEnviarTodos) {
    btnEnviarTodos.addEventListener('click', () => {
      if (!resultado) return;

      const pendentes = resultado.map((par, i) => ({ par, i })).filter(({ par }) => !par.enviado);

      if (pendentes.length === 0) {
        mostrarToast('Todos já foram notificados!', 'success');
        return;
      }

      // Dispara com pequeno intervalo para não bloquear pop-ups
      pendentes.forEach(({ i }, idx) => {
        setTimeout(() => enviarNotificacao(i), idx * 600);
      });

      mostrarToast(`📡 Disparando para ${pendentes.length} participante${pendentes.length > 1 ? 's' : ''}...`, 'success');
    });
  }

  btnNovoSorteio.addEventListener('click', () => {
    if (confirm('Deseja fazer um novo sorteio? O resultado atual será apagado.')) {
      localStorage.removeItem(RESULTADO_KEY);
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = 'index.html';
    }
  });
}

/* ============================================================
   TOAST
   ============================================================ */
function mostrarToast(msg, tipo = '') {
  // Criar toast dinamicamente se não existir
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.className = `toast ${tipo}`;

  // Forçar reflow
  void toast.offsetWidth;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Função auxiliar também usada no sorteio
function formatarWhatsapp(numero) {
  const d = String(numero).replace(/\D/g, '');
  const local = d.startsWith('55') ? d.slice(2) : d;
  if (local.length === 11) return `(${local.slice(0,2)}) ${local.slice(2,7)}-${local.slice(7)}`;
  if (local.length === 10) return `(${local.slice(0,2)}) ${local.slice(2,6)}-${local.slice(6)}`;
  return numero;
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  iniciarParticulas();
  initCadastro();
  initSorteio();
});
