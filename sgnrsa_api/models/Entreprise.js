const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');


/**
 * Modèle pour la création de la table Entreprise
 * @author Philippe <philippehatangimana.29dg@gmail.com>
 * @date 07/08/2024
 */
const Entreprise = sequelize.define("entreprise", {
    ID_ENTREPR: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NOM_ENTREPR: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    ADRESSE_ENTREPR: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    SECTEUR: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    LOGO_ENTREPR: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    NOM_TUT: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    PRENOM_TUT: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    EMAIL: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'entreprise',
    timestamps: false,
});

module.exports = Entreprise;