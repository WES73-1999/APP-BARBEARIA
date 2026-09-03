const express = require('express');
const router = express.Router();
const db = require('../db');

//Listar
router.get('/', aync (req, res) => {
	try {
		const result = await db.query(
		'SELECT id, nome, email, telefone, tipo_usuario, data_criacao FROM usuarios ORDER BY id DESC'
		);
		res.json(result.rows);
	} catch (error) {
		console.error(error);
		rest.status(500).json({error: 'Erro ao buscar usuario.'});
	}
});

//cadastros
router.post('/', async (req, res) => {
	const { nome, email, senha, telefone, tipo_usuario, observacoes_alergias } = req.body;
	
	if(!nome || !email || !senha || !tipo_usuario){
		return res.status(400).json({ error: 'Campos obrigatórios: nome, email, senha, tipo_usuario'});
	}
	try {
		const newUser = await db.query(
		`INSERT INTO usuarios (nome, email, senha, telefone, tipo_usuario)
		 VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, tipo_usuario`,
		 [nome, email, senha, telefone, tipo_usuario]
		);
	const usuarioId = newUser.rows[0].id;
	
	if (tipo_usuario === 'cliente'){
		await db.query(
		'INSERT INTO clientes (usuario_id, observacoes_alergias) VALUES ($1, $2)',
		[usuarioId, observacoes_alergias || null]
		);
	}
	else if (tipo_usuario === 'barbeiro'){
		await db.query(
		'INSERT INTO barbeiros (usuario_id) VALUES ($1)',
		[usuarioId]
		);
	}
	rest.status(201).json(newUser.rows[0]);
	} catch (error){
		console.error(error);
	if (error.code === '23505'){ //codigo para violacao de UNIQUE de email ja cadastrado
		return res.status(400).json({error: 'Este email ja esta cadastrado.'});
	}
	rest.status(500).json({error: 'Erro ao cadastrar usuario'});
	}
});

module.exports = router;