const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, nome, descricao, preco, duracao_minutos FROM servicos WHERE ativo = TRUE ORDER BY nome ASC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar servicos." });
  }
});

router.post("/", async (req, res) => {
  const { nome, descricao, preco, duracao_minutos } = req.body;

  if (!nome || !preco || !duracao_minutos) {
    return res
      .status(400)
      .json({ error: "nome, preco e duracao_minutos sao obrigatorios." });
  }

  try {
    const result = await db.query(
      `INSERT INTO servicos (nome, descricao, preco, duracao_minutos)
             VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome, descricao, preco, duracao_minutos],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar servico." });
  }
});

module.exports = router;
