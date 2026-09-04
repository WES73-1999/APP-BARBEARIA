const express = require('express');
const router = express.Router();
const db = require('../db');

router.get("/", async (req, res) => {
  try {
    const query = `
        SELECT *
            a.id,
            a.data_hora,
            a.status,
            a.valor_cobrado,
            a.eh_pela_assinatura,
            uc.nome AS Cliente_nome,
            ub.nome AS Barbeiro_nome,
            s.nome AS Servico_nome
        FROM agendamentos a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        LEFT JOIN usuarios uc ON c.usuario_id = uc.id
        JOIN barbeiros b ON a.barbeiro_id = b.id
        JOIN usuarios ub ON b.usuario_id = ub.id
        JOIN servicos s ON a.servico_id = s.id
        ORDER BY a.data_hora ASC;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
  }
});

router.post("/", async (req, res) => {
    const {
        cliente_id,
        barbeiro_id,
        servico_id,
        data_hora,
        valor_cobrado,
        eh_pela_assinatura,
        assinatura_consumida_id,
        observacoes
    } = req.body;
    
    if (!barbeiro_id || !servico_id || !data_hora || valor_cobrado === undefined) {
        return res.status(400).json({ error: 'Faltam dados obrigatórios para criar o agendamento.' });    
    }

    try {
      const result = await db.query(`
        INSERT INTO agendamentos
          (cliente_id, barbeiro_id, servico_id, data_hora, valor_cobrado, eh_pela_assinatura, assinatura_consumida_id, observacoes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
            cliente_id || null,
            barbeiro_id,
            servico_id,
            data_hora,
            valor_cobrado,
            eh_pela_assinatura || false,
            assinatura_consumida_id || null,
            observacoes || null
        ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar agendamento.' });
  }
});

module.exports = router;