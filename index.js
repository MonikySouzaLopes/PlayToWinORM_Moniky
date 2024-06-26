// Importações de módulos:
require("dotenv").config();
const conn = require("./db/conn");
const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");
const Cartao = require("./models/Cartao");
const Conquista = require("./models/Conquista");
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

//Atualizar dados do usuario
app.get("/usuarios/:id/update", async (req, res) =>{
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, {raw: true});
    res.render("formUsuario", {usuario});

    //const usuario = Usuario.findOne({
      //  where: {id: id},
      //  raw: true,
  //  });
});

app.post("/usuarios/:id/update", async(req, res) => {
    const id = parseInt(req.params.id);
    const dadosUsuario = {
        nickname: req.body.nickname,
        nome: req.body.nome,
    };
const retorno = await Usuario.update( dadosUsuario,{ where: {id: id}})

if(retorno > 0){
    res.redirect("usuarios")
}else{
    res.send("Erro ao atualizar o usuário")
}
});

//Deletar usuário
app.post("/usuarios/:id/delete", async (req, res) =>{
    const id = parseInt(req.params.id);

    const retorno = await Usuario.destroy({where: {id: id}});

    if(retorno > 0){
        res.redirect("/usuarios")
    }else{
        res.send("Erro ao deletar o usuário")
    }
});

// Rostas de cartão 

//buscar dados do cartão
app.get("/usuarios/:id/cartoes", async (req, res) =>{
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, {raw: true});

    const cartoes = await Cartao.findAll({
        raw: true, 
        where: {UsuarioId: id},
    });

    res.render("cartoes.handlebars", {usuario, cartoes});
});

//Formulário de cartões 
app.get("/usuarios/:id/novoCartao", async (req, res) =>{
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true});

    res.render("formCartao", {usuario})
})

//Cadastro de cartão
app.post("/usuarios/:id/novoCartao", async (req, res) =>{
    const id = parseInt(req.params.id);

    const dadosCartao ={
        numero: req.body.numero,
        nome: req.body.nome,
        codSeguranca: req.body.codSeguranca,
        UsuarioId: id,
    };

    await Cartao.create(dadosCartao);

    res.redirect(`/usuarios/${id}/cartoes`);
});

// Buscar dados dos jogos no banco//
app.get("/jogos", async (req, res)=>{
    const jogos = await Jogo.findAll({raw: true});
    res.render("jogos", { jogos });
});

//Formulário de jogo
app.get("/jogos/novo", (req, res) => {
    res.render("formJogo");
});

app.post("/jogos/novo", async (req, res) => {
    try {
        const { nome, descricao, preco } = req.body;
        
        const dadosJogo = {
            nome,
            descricao,
            preco,
        };
        //Cadastrar jogo//
        const jogo = await Jogo.create(dadosJogo);

        res.send("Jogo inserido sob o id " + jogo.id);
    } catch (error) {
        console.error("Erro ao inserir jogo:", error);
        res.status(500).send("Erro ao inserir jogo");
    }
});

//Atualizar dados do jogo
app.get("/jogos/:id/update", async (req, res) =>{
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, {raw: true});
    res.render("formJogo", {jogo});
});

app.post("/jogos/:id/update", async(req, res) => {
    const id = parseInt(req.params.id);
    const dadosJogo = {
        nome: req.body.nome,
        descricao: req.body.descricao,
        preco: req.body.preco
    };
const retorno = await Jogo.update( dadosJogo,{ where: {id: id}})

if(retorno > 0){
    res.redirect("jogos")
}else{
    res.send("Erro ao atualizar o jogo")
}
});

//Deletar jogo
app.post("/jogos/:id/delete", async (req, res) =>{
    const id = parseInt(req.params.id);

    const retorno = await Jogo.destroy({where: {id: id}});

    if(retorno > 0){
        res.redirect("/jogos")
    }else{
        res.send("Erro ao deletar o jogo")
    }
});

// Rostas de conquista 

//buscar dados da conquista
app.get("/jogos/:id/conquistas", async (req, res) =>{
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, {raw: true});

    const conquistas = await Conquista.findAll({
        raw: true, 
        where: {JogoId: id},
    });

    res.render("conquistas.handlebars", {jogo, conquistas});
});

//Formulário de conquistas 
app.get("/jogos/:id/novaConquista", async (req, res) =>{
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true});

    res.render("formConquista", {jogo})
})

//Cadastro de conquista
app.post("/jogos/:id/novaConquista", async (req, res) =>{
    const id = parseInt(req.params.id);

    const dadosConquista ={
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        JogoId: id,
    };

    await Conquista.create(dadosConquista);

    res.redirect(`/jogos/${id}/conquistas`);
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
