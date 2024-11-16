// importação de módulos
var conexao = require("./conexaobanco");

var express = require("express");

var app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.json()); //pega o que foi digitado transforma os dados em html (objeto)

app.use(bodyParser.urlencoded({ extended: true })); //aprova, dá o ok

app.set("view engine", "ejs");

// conexão com public e views
app.use(express.static("public"));
app.set('views', __dirname + '/views');

// rota index
app.get("/", function (req, res) {
  res.render('index');
});

// Rota para processar o formulário
app.post("/", (req, res) => {
  // Aqui você pode acessar os dados enviados pelo formulário
  const {
    nome,
    sobrenome,
    email,
    whatsapp,
    cep,
    logradouro,
    bairro,
    cidade,
    estado,
  } = req.body;

  //prevenindo SQL injection
  var sql =
    "INSERT INTO clientes(nome, sobrenome, email, whatsapp, cep, logradouro, bairro, cidade, estado) VALUES (?,?,?,?,?,?,?,?,?)";

  conexao.query(
    sql,
    [nome, sobrenome, email, whatsapp, cep, logradouro, bairro, cidade, estado],
    function (error, result) {
      if (error) throw error;
      //res.send("Estudante cadastrado com sucesso! " +result.insertId);
      res.redirect("/");
    }
  );
});

//read do banco de dados
app.get('/listadeclientes', function(req, res) {
  var sql = "SELECT * FROM clientes";
  conexao.query(sql, function(error, result) {
    if (error) {
      console.log('Erro na consulta:', error);
    }
    console.log('Dados retornados:', result);
    res.render('listadeclientes', { clientes: result });
  });
});

// rotas alterar/excluir cadastro
app.get('/alterarcadastro', function(req, res){
  var sql = "select * from clientes where codcliente=?";
  var codcliente = req.query.codcliente;

  conexao.query(sql, [codcliente], function(error, result){
      if (result && result.length > 0) {
          res.render('alterarcadastro', {clientes : result[0]});
      } else{
          res.status(404).send('Cliente não encontrado');
          console.log(error)
      }
  });
});



const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});