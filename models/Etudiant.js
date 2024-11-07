const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Departement = require('./Departement');
const Encandrant = require('./Encadrant');



/**
 * Modèle pour la création de la table etudiant
 * @author Philippe <philippehatangimana.29dg@gmail.com>
 * @date 07/08/2024
 */
const Etudiant = sequelize.define("etudiant", {
    ID_ETUD: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NOM: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    PRENOM: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    EMAIL: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    ID_DEPARTEMENT: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_ENCA: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
   
    NUMERO_REF: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    DATE_NAISSANCE: {
        type: DataTypes.DATE,
        allowNull: false
    },
    GENRE: {
        type: DataTypes.TINYINT(2),
        allowNull: false
    },
    PROFIL: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    ADRESS: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    DATE_ENREGISTREMNT: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'etudiant',
    timestamps: false,
});
Etudiant.belongsTo(Departement,{foreignKey:'ID_DEPARTEMENT',as:'departement'});
Etudiant.belongsTo(Encandrant,{foreignKey:'ID_ENCA',as:'encandrant'});
module.exports = Etudiant;