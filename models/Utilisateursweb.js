const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Profil = require('./Profil');

const Utilisateursweb = sequelize.define('utilisateursweb', {
    ID_UTILISATEURWB: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    USERNAME: {
        type: DataTypes.STRING(245),
        allowNull: false
    },

    IMAGE: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ID_PROFIL: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    EMAIL: {
        type: DataTypes.STRING(245),
        allowNull: false
    },
    NOM: {
        type: DataTypes.STRING(245),
        allowNull: false
    },
    PRENOM: {
        type: DataTypes.STRING(245),
        allowNull: false
    },

    IS_ACTIF: {
        type: DataTypes.INTEGER(245),
        allowNull: false,
        defaultValue: "1"
    },
    NUMERO_RWB: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
},
    {
        freezeTableName: true,
        tableName: 'utilisateursweb',
        timestamps: false
    }
);
Utilisateursweb.belongsTo(Profil, { foreignKey: "ID_PROFIL", as: 'PROFIL' })

module.exports = Utilisateursweb;