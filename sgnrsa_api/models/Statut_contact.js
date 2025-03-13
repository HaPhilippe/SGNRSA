const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');


/**
 * Modèle pour la création de la table statut contact
 * @author Philippe <philippehatangimana.29dg@gmail.com>
 * @date 07/08/2024
 */
const Statut_contact = sequelize.define("statut_contact", {
    ID_STATUT_C: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    DESCRIPTION: {
        type: DataTypes.STRING(30),
        allowNull: true, // Permet de laisser vide
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'statut_contact',
    timestamps: false,
});

module.exports = Statut_contact;