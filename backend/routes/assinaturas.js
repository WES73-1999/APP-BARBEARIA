const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/planos", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM planos_assinatura WHERE ativo = TRUE",
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar planos de assinatura" });
  }
});

router.post("/planos", async (req, res) => {
  const { nome, descricao, preco_mensal, limite_cortes_mes } = req.body;
  if (!nome || !preco_mensal || !limite_cortes_mes) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios não preenchidos" });
  }
  try {
    const result = await db.query(
      `INSERT INTO planos_assinatura (nome, descricao, preco_mensal, limite_cortes_mes)
            VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome, descricao, preco_mensal, limite_cortes_mes],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar plano de assinatura" });
  }
});

module.exports = router;