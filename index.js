// Importações de módulos:
require("dotenv").config();
const conn = require("./db/conn");
const Usuario = require("./models/Usuario");
const express = require("express");
const exphbs = require("express-handlebars");

//Instanciação do servidor:
const app = express();

//Vinculação do Handlebars ao Express:
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Middleware para analisar o corpo da solicitação
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res)=>{
    res.render("home")
});

//Buscar os dados no banco//
app.get("/usuarios", async (req, res)=>{
    const usuarios = await Usuario.findAll({raw: true});
    res.render("usuarios", { usuarios });
});

app.get("/usuarios/novo", (req, res) => {
    res.render("formUsuario");
});

app.post("/usuarios/novo", async (req, res) => {
    try {
        const { nickname, nome } = req.body;
        
        const dadosUsuario = {
            nickname,
            nome,
        };

        //Cadastrar usuario//
        const usuario = await Usuario.create(dadosUsuario);

        res.send("Usuário inserido sob o id " + usuario.id);
    } catch (error) {
        console.error("Erro ao inserir usuário:", error);
        res.status(500).send("Erro ao inserir usuário");
    }
});

app.get("/usuarios/:id/update", async (req, res) =>{
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, {raw: true});
    res.render("formUsuario", {usuario});

    //const usuario = Usuario.findOne({
      //  where: {id: id},
      //  raw: true,
  //  });
});


app.listen(8000, () => {
    console.log("Servidor está ouvindo na porta 8000");
});

conn
    .sync()
    .then(() => {
        console.log("Conectado e sincronizado ao banco de dados com sucesso!");
    })
    .catch(err => {
        console.error("Ocorreu um erro ao conectar/sincronizar o banco de dados:", err);
    });
