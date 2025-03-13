
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Faculte = require('./Faculte');

/**
* fonction model pour la creation de la table  Departement
* @author Philippe <hphilip@inoviatech.com>
* @date 26/06/2024
* @returns 
*/
const Departement = sequelize.define("departement", {
    ID_DEPARTEMENT: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ID_FAC: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    NOM_DEPARTEMENT: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    DESIGNATION_DEP: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    freezeTableName: true,
    tableName: 'departement',
    timestamps: false
})
// Relation avec Faculte
Departement.belongsTo(Faculte, { foreignKey: 'ID_FAC', as: 'faculte' });
// Relation : Une Faculte a plusieurs Departements
Faculte.hasMany(Departement, { foreignKey: 'ID_FAC', as: 'departements' });


module.exports = Departement
