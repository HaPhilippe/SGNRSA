const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Etudiant = require('./Etudiant');
const Entreprise = require('./Entreprise');

/**
 * Modèle pour la création de la table Rapport
 * @author Philippe <philippehatangimana.29dg@gmail.com>
 * @date 07/08/2024
 */

const Rapport = sequelize.define("Rapport", {
    ID_RAPPORT: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ID_ETUD: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_ENTREPR: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DATE_DEBUT: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    DATE_FIN: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    SUJET: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    RAPPORT_PDF: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    NOTE_EVALUATION: {
        type: DataTypes.DECIMAL(2,0),
         allowNull: false,
    },
    ATTESTATION_DU_DEPOT: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    PAGE_GARDE: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },

    FICHIER_COTATION_PDF: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    REF_RAP:{
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'Rapport',
    timestamps: false,
});
Rapport.belongsTo(Etudiant, { foreignKey: 'ID_ETUD', as: 'etudiant' });
Rapport.belongsTo(Entreprise, { foreignKey: 'ID_ENTREPR', as: 'entreprise' });
module.exports = Rapport;