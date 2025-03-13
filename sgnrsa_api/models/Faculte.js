const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');


/**
 * Modèle pour la création de la table Faculte
 * @author Philippe <philippehatangimana.29dg@gmail.com>
 * @date 07/08/2024
 */
const Faculte = sequelize.define("faculte", {
    ID_FAC: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NOM: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    DESCRIPTION: {
        type: DataTypes.STRING(250),
        allowNull: true, // Permet de laisser vide
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'faculte',
    timestamps: false,
});

module.exports = Faculte;