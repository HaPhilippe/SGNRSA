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
      include: {
        model: Faculte,
        as: 'faculte',
        required: false
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


/**
 * Permet pour recuperer un departement selon l'id
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneDeparement = async (req, res) => {
  try {
    const { ID_DEPARTEMENT } = req.params
    const departement = await Departement.findOne({
      where: {
        ID_DEPARTEMENT
      },
      include: {
        model: Faculte,
        as: 'faculte',
        required: false
      }
    })
    if (departement) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Le departement",
        result: departement
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Le departement non trouve",
      })
    }
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
 * Permet pour recuperer une faculté selon l'id
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneFaculte = async (req, res) => {
  try {
    const { ID_FAC } = req.params
    const faculte = await Faculte.findOne({
      where: {
        ID_FAC
      }
    })
    if (faculte) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "La faculte",
        result: faculte
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "La faculte non trouve",
      })
    }
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
// * Modifier une faculte et departement via son id
// * @date  06/08/2024
//  * @param {express.Request} req 
//  * @param {express.Response} res 
//  * @author hph <philippehatangimana.29dg@gmail.com>
//  */
// const updateFaculte = async (req, res) => {

//   try {
//     const { ID_DEPARTEMENT } = req.params;
//     const {NOM_DEPARTEMENT,DESIGNATION_DEP} = req.body
//     const data = { ...req.body };
//     // console.log(data,'daaaaaaata');

// const validation = new Validation(data, {
//   NOM:{
//    required:true,
//    length:true,
//    alpha:[1,100]
//   },
//   DESCRIPTION: {
//     required: true,
//     length: [1, 250],
//     alpha: true
//   },
//   NOM_DEPARTEMENT: {
//     required: true,
//     length: [1, 100],
//     alpha: true
//   },
//   DESIGNATION_DEP: {
//     required: true,
//     length: [1, 250],
//     alpha: true
//   }

// }, {
//   NOM: {
//     required: "Ce champ est obligatoire",
//     length: "Le nom ne doit pas depasser max(100 caracteres)",
//     alpha: "Le nom est invalide"
//   },
//   DESCRIPTION: {
//     required: "Ce champ est obligatoire",
//     length: "La description ne doit pas depasser max(250 caracteres)",
//     alpha: "La description est invalide"
//   },
//   NOM_DEPARTEMENT: {
//     required: "Ce champ est obligatoire",
//     length: "Le nom de departement ne doit pas depasser max(100 caracteres)",
//     alpha: "La description est invalide"
//   },
//   DESIGNATION_DEP: {
//     required: "Ce champ est obligatoire",
//     length: "La designation ne doit pas depasser max(250 caracteres)",
//     alpha: "La designation est invalide"
//   }
// })
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

//     const faculte_depart = await Departement.update({
//       NOM_DEPARTEMENT,DESIGNATION_DEP
//     }, {
//       where: { ID_DEPARTEMENT: ID_DEPARTEMENT }
//     })

//     res.status(RESPONSE_CODES.CREATED).json({
//       statusCode: RESPONSE_CODES.CREATED,
//       httpStatus: RESPONSE_STATUS.CREATED,
//       message: "La faculte a modifie avec succes",
//       return:faculte_depart,
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


/**
 * Permet pour la modification d'un faculté
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const updateDepartement = async (req, res) => {

  try {
    const { ID_DEPARTEMENT } = req.params;
    // return console.log(ID_DEPARTEMENT,typeof(ID_DEPARTEMENT));
  
    const { NOM_DEPARTEMENT, DESIGNATION_DEP } = req.body;

    const data = { ...req.body };
    const validation = new Validation(data, {

      NOM_DEPARTEMENT: {
        required: true,
        length: [1, 100],
        alpha: true
      },
      DESIGNATION_DEP: {
        required: true,
        length: [1, 250],
        alpha: true
      }

    }, {

      NOM_DEPARTEMENT: {
        required: "Ce champ est obligatoire",
        length: "Le nom de departement ne doit pas depasser max(100 caracteres)",
        alpha: "La description est invalide"
      },
      DESIGNATION_DEP: {
        required: "Ce champ est obligatoire",
        length: "La designation ne doit pas depasser max(250 caracteres)",
        alpha: "La designation est invalide"
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

    // var userImge
    // if (IMAGE) {
    //   const usersUpload = new UtilisateurUpload();
    //   const { fileInfo } = await usersUpload.upload(IMAGE, false);
    //   userImge = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.utilisateurs}/${fileInfo.fileName}`;
    // }

    const departement = await Departement.update(
      {
        NOM_DEPARTEMENT,
        DESIGNATION_DEP
      },
      {
        where: { ID_DEPARTEMENT: ID_DEPARTEMENT }
      })

    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le departement été a modifie avec succes",
      result: departement
    });

  } catch (error) {
    console.log(error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    });
  }

};


/**
 * Permet pour la modification d'un faculté
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const updateFaculte = async (req, res) => {

  try {
    const {ID_FAC}  = req.params;
    // return console.log(ID_FAC,typeof(ID_FAC),'facul');
    const { NOM, DESCRIPTION } = req.body
  

    const data = { ...req.body };
    const validation = new Validation(data, {
      NOM: {
        required: true,
        length: true,
        alpha: [1, 100]
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
    const faculte = await Faculte.update(
      {
        NOM,
        DESCRIPTION
      },
      {
        where: { ID_FAC: ID_FAC }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "La faculte été a modifie avec succes",
      result: faculte
    });

  } catch (error) {
    console.log(error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    });
  }

};


/**
 * Permet pour la suppressiuon d'un departement
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Departement.destroy({
      where: {
        ID_DEPARTEMENT: {
          [Op.in]: itemsIds
        }
      }
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Les elements ont ete supprimer avec success",
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


module.exports = {
  createFaculte_departements,
  findAll,
  updateDepartement,
  updateFaculte,
  findOneFaculte,
  findOneDeparement,
  deleteItems
}