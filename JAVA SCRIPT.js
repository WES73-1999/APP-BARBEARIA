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
    if(btn.querySelector('span')) btn.querySelector('span').innerText = '◇'; 
  });
  
  // Adiciona 'active' aos botões correspondentes e preenche o losango
  const clickedButtons = document.querySelectorAll(`[onclick="switchView('${viewName}')"]`);
  clickedButtons.forEach(btn => {
    btn.classList.add('active');
    if(btn.querySelector('span')) btn.querySelector('span').innerText = '◆';
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