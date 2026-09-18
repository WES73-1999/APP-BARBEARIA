// Navegação Principal (Sidebar e Mobile)
function switchView(viewName) {
  // Esconde todas as views
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });

  // Mostra a view clicada
  document.getElementById('view-' + viewName).classList.add('active');

  // Limpa o estado 'active' de todos os botões e troca o losango para 'vazio'
  document.querySelectorAll('.nav-button, .mobile-nav-button').forEach(btn => {
    btn.classList.remove('active');
    if (btn.querySelector('span')) btn.querySelector('span').innerText = '◇';
  });

  // Adiciona 'active' aos botões correspondentes e preenche o losango
  const clickedButtons = document.querySelectorAll(`[onclick="switchView('${viewName}')"]`);
  clickedButtons.forEach(btn => {
    btn.classList.add('active');
    if (btn.querySelector('span')) btn.querySelector('span').innerText = '◆';
  });
}

// Controle e Lógica dos Modais
function openModal(modalId, mode = '', clientName = '') {
  const modal = document.getElementById(modalId);

  // Se for o modal de Clientes, preparamos o formulário para Edição ou Criação
  if (modalId === 'modal-cliente') {
    const title = document.getElementById('modal-cliente-title');
    const inputNome = document.getElementById('cli-nome');

    if (mode === 'editar') {
      title.innerText = 'Editar Cadastro';
      inputNome.value = clientName; // Simula a leitura dos dados do cliente selecionado
    } else {
      title.innerText = 'Novo Cliente';
      inputNome.value = ''; // Limpa os campos para um novo cadastro
    }
  }

  // Exibe a camada do Modal
  modal.classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Alternância da Visualização: Fila ao Vivo vs Agenda do Dia
function toggleAgenda(type, btnElement) {
  // Atualiza o estado ativo no controle do botão
  const buttons = btnElement.parentElement.querySelectorAll('button');
  buttons.forEach(b => b.classList.remove('active'));
  btnElement.classList.add('active');

  // Atualiza o título e simula a troca da lista
  const title = document.getElementById('agenda-title');
  if (type === 'fila') {
    title.innerText = 'Próximos na Fila (Ao Vivo)';
  } else {
    title.innerText = 'Agendamentos de Hoje';
  }
}

// --- FUNÇÃO PARA CONECTAR COM OS DADOS DO CLIENTE ---

// Função que puxa os agendamentos salvos e renderiza na tela
function carregarAgendamentos() {
  const listaFila = document.getElementById('lista-fila');

  // Puxa do LocalStorage ou um array vazio
  const agendamentos = JSON.parse(localStorage.getItem('filaAgendamentos')) || [];

  // Se não houver, deixa limpo ou com mensagem
  if (agendamentos.length === 0) {
    listaFila.innerHTML = '<p class="muted" style="text-align:center;">Nenhum cliente na fila de espera no momento.</p>';
    return;
  }

  // Limpa a lista atual (tira os estáticos)
  listaFila.innerHTML = '';

  // Cria um "Card" html para cada agendamento feito pelo cliente
  agendamentos.forEach(agendamento => {
    // Escolhe a cor basedo no serviço
    let servicoFmt = "Cabelo";
    if (agendamento.servico === "barba") servicoFmt = "Barba Lenhador";
    if (agendamento.servico === "combo") servicoFmt = "Cabelo + Barba";

    const cardHtml = `
      <article class="client-card">
        <div style="text-align: center; color: var(--paper); font-family: var(--font-display);">
          Marcado<br><span style="color: var(--copper-light); font-size: 1.25rem;">${agendamento.hora || '--:--'}</span>
        </div>
        <div>
          <h3>${agendamento.nome}</h3>
          <p class="muted">${servicoFmt} • Contato: ${agendamento.telefone}</p>
        </div>
        <div style="text-align: right; display: grid; gap: 12px; justify-items: end;">
          <span class="status-badge warning" style="text-transform: uppercase;">${agendamento.status.replace('_', ' ')}</span>
          <button class="primary-button" style="min-height: 36px; padding: 8px 16px;" onclick="openModal('modal-checkout')">Atender e Cobrar</button>
        </div>
      </article>
    `;

    // Adiciona o card à div
    listaFila.innerHTML += cardHtml;
  });
}

// Quando a página acabar de carregar, executa a função acima automaticamente
document.addEventListener('DOMContentLoaded', carregarAgendamentos);
