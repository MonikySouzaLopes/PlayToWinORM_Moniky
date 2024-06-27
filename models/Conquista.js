const conn = require("../db/conn");
const {DataTypes} = require("sequelize");
const Jogo = require("../models/Jogo");

const Conquista = conn.define("Conquista", {
    titulo:{
        type: DataTypes.STRING,
        required: false,
    },
    descricao: {
        type: DataTypes.STRING,
        required: false,
    },
   
},

);

Conquista.belongsTo(Jogo);
Jogo.hasMany(Conquista);

module.exports = Conquista;