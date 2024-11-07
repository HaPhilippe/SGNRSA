const express = require("express")
const RESPONSE_CODES = require("../../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../../constants/RESPONSE_STATUS")
const Validation = require("../../../class/Validation")
const { Op } = require("sequelize")
const Faculte = require("../../../models/Faculte")
const Departement = require("../../../models/Departement")

/**
 * Permet de creer la faculte avec ses départements
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const createFaculte_departements = async (req, res) => {
  try {
    const { NOM, DESCRIPTION } = req.body;
    const data = { ...req.body };

    // return console.log(data);
    const length = data.TAILLE;
    const formatLength = parseInt(length);



    const validation = new Validation(data, {
      NOM: {
        required: true,
        length: [1, 100],
        alpha: true
      },
      DESCRIPTION: {
        required: true,
        length: [1, 250],
        alpha: true
      }

    }, {
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom ne doit pas depasser max(100 caracteres)",
        alpha: "Le nom est invalide"
      },
      DESCRIPTION: {
        required: "Ce champ est obligatoire",
        length: "La description ne doit pas depasser max(250 caracteres)",
        alpha: "La description est invalide"
      }
    })
    await validation.run()
    const isValid = await validation.isValidate()
    if (!isValid) {
      const errors = await validation.getErrors()
      return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
        message: "Probleme de validation des donnees",
        result: errors
      })
    }
    // Créer la faculté
    const faculte = await Faculte.create({
      NOM: NOM,
      DESCRIPTION: DESCRIPTION
    });
    // Créer les départements associés à cette faculté

    // Insertion des départements
    const departments = [];
    for (let i = 0; i < formatLength; i++) { // Ajustez le nombre si nécessaire
      if (data[`DEPARTEMENTS[${i}][NOM_DEPARTEMENT]`] && data[`DEPARTEMENTS[${i}][DESIGNATION_DEP]`]) {
        departments.push({
          NOM_DEPARTEMENT: data[`DEPARTEMENTS[${i}][NOM_DEPARTEMENT]`],
          DESIGNATION_DEP: data[`DEPARTEMENTS[${i}][DESIGNATION_DEP]`],
          ID_FAC: faculte.ID_FAC // Associez le département à la faculté
        });
      }
    }



    // const depart;
    // Enregistrez les départements en une seule opération
    await Departement.bulkCreate(departments);
    // console.log(depart);

    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: 'Faculté et départements créés avec succès',
      //  result: {faculte,depart}
    })
  } catch (error) {
    console.log(error)
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    })
  }
}

/**
* Permet d'afficher la faculté et departement
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findAll = async (req, res) => {
  try {
    const { rows = 10, first = 0, sortField, sortOrder, search } = req.query

    const defaultSortField = "DATE_INSERTION"
    const defaultSortDirection = "ASC"
    const sortColumns = {
      departement: {
        as: "departement",
        fields: {
          ID_DEPARTEMENT: 'ID_DEPARTEMENT',
          NOM_DEPARTEMENT: 'NOM_DEPARTEMENT',
          DESIGNATION_DEP: 'DESIGNATION_DEP',
          DATE_INSERTION: 'departement.DATE_INSERTION'
        }
      },
      faculte: {
        as: "faculte",
        fields: {
          ID_FAC: 'ID_FAC',
          NOM: 'NOM',
          DESCRIPTION: 'DESCRIPTION',
          DATE_INSERTION: 'faculte.DATE_INSERTION'
        }
      },


    }

    var orderColumn, orderDirection

    // sorting
    var sortModel
    if (sortField) {
      for (let key in sortColumns) {
        if (sortColumns[key].fields.hasOwnProperty(sortField)) {
          sortModel = {
            model: key,
            as: sortColumns[key].as
          }
          orderColumn = sortColumns[key].fields[sortField]
          break
        }
      }
    }
    if (!orderColumn || !sortModel) {
      orderColumn = sortColumns.departement.fields.DATE_INSERTION
      sortModel = {
        model: 'departement',
        as: sortColumns.departement.as
      }
    }

    // ordering
    if (sortOrder == 1) {
      orderDirection = 'ASC'
    } else if (sortOrder == -1) {
      orderDirection = 'DESC'
    } else {
      orderDirection = defaultSortDirection
    }

    // searching
    const globalSearchColumns = [
      "ID_DEPARTEMENT",
      'DESCRIPTION',
    ]
    var globalSearchWhereLike = {}
    if (search && search.trim() != "") {
      const searchWildCard = {}
      globalSearchColumns.forEach(column => {
        searchWildCard[column] = {
          [Op.substring]: search
        }
      })
      globalSearchWhereLike = {
        [Op.or]: searchWildCard
      }
    }
    const result = await Departement.findAndCountAll({
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      },
      include:{
        model:Faculte,
        as:'faculte',
        required:false
      }
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des departements et leurs facultés",
      result: {
        data: result.rows,
        totalRecords: result.count
      }
    })
  } catch (error) {
    console.log(error)
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    })
  }
}


// /**
// * Modifier un profil via son id
// * @date  06/08/2024
//  * @param {express.Request} req 
//  * @param {express.Response} res 
//  * @author hph <philippehatangimana.29dg@gmail.com>
//  */
// const updateFaculte = async (req, res) => {

//   try {
//     const { ID_PROFIL } = req.params;
//     const { DESCRIPTION, roles } = req.body
//     const data = { ...req.body };
//     const validation = new Validation(data, {
//       DESCRIPTION: {
//         required: true,
//         length: [1, 50],
//         alpha: true
//       }

//     }, {
//       DESCRIPTION: {
//         required: "Ce champ est obligatoire",
//         length: "La description ne doit pas depasser max(50 caracteres)",
//         alpha: "La description est invalide"
//       }
//     })
//     await validation.run()
//     const isValid = await validation.isValidate()
//     if (!isValid) {
//       const errors = await validation.getErrors()
//       return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
//         statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
//         httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
//         message: "Probleme de validation des donnees",
//         result: errors
//       })
//     }

//     const profiledit = await Profil.update({
//       DESCRIPTION
//     }, {
//       where: { ID_PROFIL: ID_PROFIL }
//     })
//     const allrole = JSON.parse(roles)
//     await Profil_roles.destroy({
//       where: { ID_PROFIL: ID_PROFIL }
//     })
//     const roleData = allrole.map(reponse => {
//       return {
//         ID_PROFIL: ID_PROFIL,
//         ID_ROLE: reponse.ID_ROLE,
//         CAN_READ: reponse.CAN_READ,
//         CAN_WRITE: reponse.CAN_WRITE
//       }
//     })

//     await Profil_roles.bulkCreate(roleData)

//     res.status(RESPONSE_CODES.CREATED).json({
//       statusCode: RESPONSE_CODES.CREATED,
//       httpStatus: RESPONSE_STATUS.CREATED,
//       message: "Le profile a modifie avec succes",
//       // result: profiledit
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
//       statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
//       httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
//       message: "Erreur interne du serveur, réessayer plus tard",
//     });
//   }

// };





// /**
//  * Permet de supprimer le profile selon l'id
// * @date  06/08/2024
//  * @param {express.Request} req 
//  * @param {express.Response} res 
//  * @author hph <philippehatangimana.29dg@gmail.com>
//  */

// const deleteItems = async (req, res) => {
//   try {
//     const { ids } = req.body
//     const itemsIds = JSON.parse(ids)
//     await Profil.destroy({
//       where: {
//         ID_PROFIL: {
//           [Op.in]: itemsIds
//         }
//       }
//     })
//     res.status(RESPONSE_CODES.OK).json({
//       statusCode: RESPONSE_CODES.OK,
//       httpStatus: RESPONSE_STATUS.OK,
//       message: "Les elements ont ete supprimer avec success",
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
//       statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
//       httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
//       message: "Erreur interne du serveur, réessayer plus tard",
//     })
//   }
// }

// /**
//  * Permet pour recuperer un profile selon l'id
// * @date  06/08/2024
//  * @param {express.Request} req 
//  * @param {express.Response} res 
//  * @author hph <philippehatangimana.29dg@gmail.com>
//  */
// const findOneFaculte = async (req, res) => {
//   try {
//     const { ID_PROFIL } = req.params
//     const utilisateur = await Profil.findOne({
//       where: {
//         ID_PROFIL
//       },
//       include: [
//         {
//           model: Profil_roles,
//           as: "profil_roles",
//           required: false,
//           attributes: ["ID_PROFIL_ROLE", "ID_ROLE", "CAN_READ", "CAN_WRITE"],
//           order: [["ID_ROLE", "ASC"]],
//           include: [{
//             model: Roles,
//             as: "role",
//             required: false,
//             attributes: ["ID_ROLE", "ROLE"],
//           }],
//         },
//       ],
//       order: [
//         [{ model: Profil_roles, as: "profil_roles" }, "ID_ROLE", "ASC"]
//       ]
//     })
//     if (utilisateur) {
//       res.status(RESPONSE_CODES.OK).json({
//         statusCode: RESPONSE_CODES.OK,
//         httpStatus: RESPONSE_STATUS.OK,
//         message: "Profil",
//         result: utilisateur
//       })
//     } else {
//       res.status(RESPONSE_CODES.NOT_FOUND).json({
//         statusCode: RESPONSE_CODES.NOT_FOUND,
//         httpStatus: RESPONSE_STATUS.NOT_FOUND,
//         message: "Profil non trouvé",
//       })
//     }
//   } catch (error) {
//     console.log(error)
//     res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
//       statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
//       httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
//       message: "Erreur interne du serveur, réessayer plus tard",
//     })
//   }
// }

// /**
//  * Permet de trouver les roles
// * @date  06/08/2024
//  * @param {express.Request} req 
//  * @param {express.Response} res 
//  * @author hph <philippehatangimana.29dg@gmail.com>
//  */

// const findAllrole = async (req, res) => {
//   try {
//     const allroles = await Roles.findAll({
//       attributes: ["ID_ROLE", "ROLE", "DATE_INSERTION"],
//       order: [["ID_ROLE", "ASC"]]
//     })

//     res.status(RESPONSE_CODES.OK).json({
//       statusCode: RESPONSE_CODES.OK,
//       httpStatus: RESPONSE_STATUS.OK,
//       result: allroles
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
//       statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
//       httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
//       message: "Erreur interne du serveur, réessayer plus tard",
//     })
//   }
// }


// /**
//  * Permet de recuperer les droits de l'utilisateur
// * @date  06/08/2024
//  * @param {express.Request} req 
//  * @param {express.Response} res 
//  * @author hph <philippehatangimana.29dg@gmail.com>
//  */
// const findRoleByIdProfile = async (req, res) => {
//   try {
//     const { ID_PROFIL } = req.params
//     const profilId = await Profil_roles.findAll({
//       attributes: ["ID_PROFIL_ROLE", "ID_ROLE", "CAN_READ", "CAN_WRITE"],
//       order: [["ID_ROLE", "ASC"]],
//       include: [{
//         model: Roles,
//         as: "role",
//         required: false,
//         attributes: ["ID_ROLE", "ROLE"]
//       }
//       ],
//       where: {
//         ID_PROFIL
//       }
//     })
//     if (profilId) {
//       res.status(RESPONSE_CODES.OK).json({
//         statusCode: RESPONSE_CODES.OK,
//         httpStatus: RESPONSE_STATUS.OK,
//         message: "profile trouvee",
//         result: profilId
//       })
//     } else {
//       res.status(RESPONSE_CODES.NOT_FOUND).json({
//         statusCode: RESPONSE_CODES.NOT_FOUND,
//         httpStatus: RESPONSE_STATUS.NOT_FOUND,
//         message: "profile non trouve",
//       })
//     }
//   } catch (error) {
//     console.log(error)
//     res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
//       statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
//       httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
//       message: "Erreur interne du serveur, réessayer plus tard",
//     })
//   }
// }


module.exports = {
  createFaculte_departements,
  findAll
}