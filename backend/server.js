const express = require('express');
const cors = require('cors');
require('dotenv').config();

//rotas
const usuariosRoutes = require('./routes/usuarios');
const servicosRoutes = require('./routes/servicos');
const agendamentosRoutes = require('./routes/agendamentos');
const assinaturasRoutes = require('./routes/assinaturas');

const app = express();

//middlewares

app.use(cors()); //permissao do front end
app.use(express.json()); //recebimento do json na requisição

//prefixos de rotas
app.use('/usuarios', usuariosRoutes);
app.use('servicos', servicosRoutes);
app.use('agendamentos', agendamentosRoutes);
app.use('assinaturas', assinaturasRoutes);

app.get('/', (req, res) => {
	res.json({mensagem: 'API comunicando!'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
	console.log(`Servidor em execução em: http://localhost:${PORT}`);
});