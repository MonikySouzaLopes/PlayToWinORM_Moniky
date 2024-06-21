const conn = require("../db/conn");
const {DataTypes} = require("sequelize");
const Usuario = require("../models/Usuario");

const Cartao = conn.define("Cartao", {
    numero:{
        type: DataTypes.STRING(16),
        required: false,
    },
    nome: {
        type: DataTypes.STRING,
        required: false,
    },
    codSeguranca: {
        type: DataTypes.STRING,
        required: true,
    },
},
{
    tableName: "Cartoes"
}
);

Cartao.belongsTo(Usuario);
Usuario.hasMany(Cartao);

module.exports = Cartao;