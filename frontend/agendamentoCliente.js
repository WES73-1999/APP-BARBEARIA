document.getElementById('form-agendamento').addEventListener('submit', function(event) {
  // Evita que a página recarregue ao clicar no botão
  event.preventDefault();

  // 1. Capturar os valores digitados pelo cliente
  const nome = document.getElementById('agenda-nome').value;
  const telefone = document.getElementById('agenda-tel').value;
  const servico = document.getElementById('agenda-servico').value;
  const data = document.getElementById('agenda-data').value;
  const hora = document.getElementById('agenda-hora').value;

  // 2. Criar um objeto de agendamento
  const novoAgendamento = {
    nome: nome,
    telefone: telefone,
    servico: servico,
    data: data,
    hora: hora,
    status: 'aguardando_confirmacao'
  };

  // 3. Simulação: Salvar no LocalStorage (Memória do Navegador) 
  // Isso permite que o seu painel Admin leia esses dados depois!
  let agendamentosFila = JSON.parse(localStorage.getItem('filaAgendamentos')) || [];
  agendamentosFila.push(novoAgendamento);
  localStorage.setItem('filaAgendamentos', JSON.stringify(agendamentosFila));

  // 4. Mostrar mensagem de sucesso e limpar o formulário
  alert(`Tudo certo, ${nome}! Seu agendamento para o dia ${data} às ${hora} foi solicitado.`);
  
  // Limpa o formulário
  this.reset();
});
