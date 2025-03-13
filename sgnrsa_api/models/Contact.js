const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Statut_contact = require('./Statut_contact');
const Utilisateurs = require('./Utilisateurs');

/**
 * Modèle pour la création de la table contact
 * @author Philippe <philippehatangimana.29dg@gmail.com>
 * @date 07/08/2024
 */
const Contact = sequelize.define("contact", {
    ID_CONTACT: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NOM: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    PRENOM: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    EMAIL: {
        type: DataTypes.STRING(90),
        allowNull: false,
    },
    MESSAGE: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ID_STATUT_C: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_ADMIN: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'contact',
    timestamps: false,
});

Contact.belongsTo(Statut_contact, { foreignKey: 'ID_STATUT_C', as: 'statut_contact' });
Contact.belongsTo(Utilisateurs, { foreignKey: 'ID_ADMIN', as: 'admin' });
module.exports = Contact;