const conn = require("../db/conn");
const {DataTypes} = require("sequelize");

const Jogo = conn.define("Jogo", {
    nome:{
        type: DataTypes.STRING,
        required: false,
    },
    descricao: {
        type: DataTypes.STRING,
        required: true,
    },
    preco: {
        type: DataTypes.DOUBLE,
        required: true,
    },
});

module.exports = Jogo;