const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Statut_contact = require('./Statut_contact');
const Utilisateurs = require('./Utilisateurs');
const Etudiant = require('./Etudiant');
const Contact = require('./Contact');

/**
 * Modèle pour la création de la table contact
 * @author Philippe <philippehatangimana.29dg@gmail.com>
 * @date 07/08/2024
 */
const Messagerie = sequelize.define("messagerie", {
    ID_MSG: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ID_ADMIN: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_ETUD: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_CONTACT: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    MESSAGE: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    STATUT: {
        type: DataTypes.TINYINT(4)
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'messagerie',
    timestamps: false,
});

Messagerie.belongsTo(Etudiant, { foreignKey: 'ID_ETUD', as: 'etudiant' });
Messagerie.belongsTo(Utilisateurs, { foreignKey: 'ID_ADMIN', as: 'admin' });
Messagerie.belongsTo(Contact, { foreignKey: 'ID_CONTACT', as: 'contact' });
module.exports = Messagerie;