const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');


/**
 * Modèle pour la création de la table encadrant
 * @author Philippe <philippehatangimana.29dg@gmail.com>
 * @date 07/08/2024
 */
const Encandrant = sequelize.define("encandrant", {
    ID_ENCA: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NOM: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    PRENOM: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    EMAIL: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    TITRE: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    TEL: {
      type:DataTypes.STRING(20),
      allowNull:false
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'encandrant',
    timestamps: false,
});

module.exports = Encandrant;