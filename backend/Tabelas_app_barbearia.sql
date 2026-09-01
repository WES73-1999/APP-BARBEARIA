-- Criar extensões necessárias (opcional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USUÁRIOS, BARBEIROS E CLIENTES

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL, 
    telefone VARCHAR(20),
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('admin', 'barbeiro', 'cliente')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE barbeiros (
    id SERIAL PRIMARY KEY,
    usuario_id INT UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    foto_perfil VARCHAR(500),
    percentual_comissao DECIMAL(5,2) DEFAULT 0.00,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    usuario_id INT UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    observacoes_alergias TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. SERVIÇOS E ESCALA DE TRABALHO

CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    duracao_minutos INT NOT NULL, -- Ex: 30, 45, 60
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela intermediária: Quais barbeiros fazem quais serviços
CREATE TABLE barbeiro_servicos (
    barbeiro_id INT REFERENCES barbeiros(id) ON DELETE CASCADE,
    servico_id INT REFERENCES servicos(id) ON DELETE CASCADE,
    PRIMARY KEY (barbeiro_id, servico_id)
);

-- Horários fixos de trabalho de cada barbeiro na semana
CREATE TABLE horarios_trabalho (
    id SERIAL PRIMARY KEY,
    barbeiro_id INT REFERENCES barbeiros(id) ON DELETE CASCADE,
    dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0 = Domingo, 1 = Segunda, etc.
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    CONSTRAINT horario_valido CHECK (hora_inicio < hora_fim)
);

-- 3. MÓDULO DE ASSINATURAS (NOVO)

CREATE TABLE planos_assinatura (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL, -- Ex: "Corte Bronze", "Corte prata", "Corte Ouro"
    descricao TEXT,
    preco_mensal DECIMAL(10,2) NOT NULL,
    limite_cortes_mes INT NOT NULL, -- Ex: 4 (para quatro cortes) ou 999 (para ilimitado)
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assinaturas_clientes (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id) ON DELETE RESTRICT,
    plano_id INT REFERENCES planos_assinatura(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'ativa'
        CHECK (status IN ('ativa', 'pendente', 'cancelada', 'inadimplente')),
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_proxima_cobranca TIMESTAMP WITH TIME ZONE NOT NULL,
    cortes_restantes_mes_atual INT NOT NULL, -- Controla os créditos de cortes do mês
    token_gateway_pagamento VARCHAR(255), -- ID da assinatura no Stripe, Asaas, Pagar.me, etc.
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mensalidades_assinatura (
    id SERIAL PRIMARY KEY,
    assinatura_id INT REFERENCES assinaturas_clientes(id) ON DELETE CASCADE,
    valor_pago DECIMAL(10,2) NOT NULL,
    data_pagamento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_pagamento VARCHAR(20) NOT NULL CHECK (status_pagamento IN ('pago', 'falhou', 'estornado')),
    periodo_referencia_inicio DATE NOT NULL, -- Ex: 2026-09-01
    periodo_referencia_fim DATE NOT NULL     -- Ex: 2026-10-01
);

-- 4. AGENDAMENTOS, BLOQUEIOS E PAGAMENTOS AVULSOS

CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id) ON DELETE SET NULL,
    barbeiro_id INT REFERENCES barbeiros(id) ON DELETE RESTRICT,
    servico_id INT REFERENCES servicos(id) ON DELETE RESTRICT,
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' 
        CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'concluido')),
    valor_cobrado DECIMAL(10,2) NOT NULL, -- Valor cobrado (0.00 se for assinatura)
    eh_pela_assinatura BOOLEAN DEFAULT FALSE, -- Identifica se usou crédito do plano
    assinatura_consumida_id INT REFERENCES assinaturas_clientes(id) ON DELETE SET NULL, -- Vincula à assinatura do cliente
    observacoes TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bloqueios_agenda (
    id SERIAL PRIMARY KEY,
    barbeiro_id INT REFERENCES barbeiros(id) ON DELETE CASCADE,
    data_hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_hora_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    motivo VARCHAR(255),
    CONSTRAINT bloqueio_valido CHECK (data_hora_inicio < data_hora_fim)
);

CREATE TABLE pagamentos (
    id SERIAL PRIMARY KEY,
    agendamento_id INT UNIQUE REFERENCES agendamentos(id) ON DELETE RESTRICT,
    forma_pagamento VARCHAR(30) NOT NULL CHECK (forma_pagamento IN ('dinheiro', 'cartao_credito', 'cartao_debito', 'pix')),
    status_pagamento VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status_pagamento IN ('pendente', 'pago', 'reembolsado')),
    data_pagamento TIMESTAMP WITH TIME ZONE
);

-- 5. CRIAÇÃO DE ÍNDICES PARA PERFORMANCE

-- Otimiza a busca na tela de calendário da barbearia (Barbeiro + Data)
CREATE INDEX idx_agendamentos_barbeiro_data ON agendamentos(barbeiro_id, data_hora);

-- Otimiza a listagem de históricos de agendamento do cliente
CREATE INDEX idx_agendamentos_cliente ON agendamentos(cliente_id);

-- Otimiza a verificação de horários bloqueados (Almoço, folgas)
CREATE INDEX idx_bloqueios_periodo ON bloqueios_agenda(data_hora_inicio, data_hora_fim);

-- Otimiza a verificação de assinaturas ativas do cliente no login/agendamento
CREATE INDEX idx_assinatura_cliente ON assinaturas_clientes(cliente_id, status);
