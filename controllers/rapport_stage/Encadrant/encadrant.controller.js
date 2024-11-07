const express = require("express")
const { Op } = require("sequelize")


const Validation = require("../../../class/Validation")
const RESPONSE_CODES = require("../../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../../constants/RESPONSE_STATUS")
const Encadrant = require("../../../models/Encadrant")

/**
 * Permet de creer l'encadrant
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const createencadrant = async (req, res) => {
  try {
    const { NOM, PRENOM, EMAIL, TITRE, TEL } = req.body
    // const files = req.files || {};
    // const { IMAGE_PRODUITS } = files;
    // const data = { ...req.body, ...req.files };
    const data = { ...req.body };
    const validation = new Validation(data, {
      NOM: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      PRENOM: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      EMAIL: {
        required: true,
        length: [1, 100],
        alpha: true
      },
      TITRE: {
        required: true,
        length: [1, 20],
        alpha: true,
      }, 
      TEL: {
        required: true,
        length: [1, 20],
        alpha: true,
      }
    }, {
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom de l'encadrant ne doit pas depasser max(50 caracteres)",
        alpha: "Le nom de l'encadrant est invalide"
      },
      PRENOM: {
        required: "Ce champ est obligatoire",
        length: "L'addresse de l'encadrant ne doit pas depasser max(50 caracteres)",
        alpha: "L'addresse de l'encadrant est invalide"
      },
      EMAIL: {
        required: "Ce champ est obligatoire",
        length: "L'email de l'encadrant ne doit pas depasser max(100 caracteres)",
        alpha: "L'email de l'encadrant est invalide"
      },
      TITRE: {
        required: "Ce champ est obligatoire",
        length: "Le titre d'encadrant ne doit pas depasser max(20 caracteres)",
        alpha: "Le titre d'encadrant est invalide"
      },
      TEL: {
        required: "Ce champ est obligatoire",
        length: "Le numero téléphonique d'encadrant ne doit pas depasser max(20 caracteres)",
        alpha: "Le numero téléphonique d'encadrant est invalide"
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

    const encadrant = await Encadrant.create({
      NOM, PRENOM, EMAIL, TITRE, TEL
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'encadrant a bien ete cree avec succes",
      result: encadrant
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
 * Permet de mettre à jour l'encadrant
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const updateencadrant = async (req, res) => {

  try {
    const { ID_ENCA } = req.params;
    const { NOM, PRENOM, EMAIL, TITRE, TEL } = req.body

    const data = { ...req.body };
    const validation = new Validation(data, {
      NOM: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      PRENOM: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      EMAIL: {
        required: true,
        length: [1, 100],
        alpha: true
      },
      TITRE: {
        required: true,
        length: [1, 50],
        alpha: true,
      }, 
      TEL: {
        required: true,
        length: [1, 20],
        alpha: true,
      }
    }, {
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom de l'encadrant ne doit pas depasser max(50 caracteres)",
        alpha: "Le nom de l'encadrant est invalide"
      },
      PRENOM: {
        required: "Ce champ est obligatoire",
        length: "L'addresse de l'encadrant ne doit pas depasser max(50 caracteres)",
        alpha: "L'addresse de l'encadrant est invalide"
      },
      EMAIL: {
        required: "Ce champ est obligatoire",
        length: "L'email de l'encadrant ne doit pas depasser max(100 caracteres)",
        alpha: "L'email de l'encadrant est invalide"
      },
      TITRE: {
        required: "Ce champ est obligatoire",
        length: "Le titre d'encadrant ne doit pas depasser max(50 caracteres)",
        alpha: "Le titre d'encadrant est invalide"
      },
      TEL: {
        required: "Ce champ est obligatoire",
        length: "Le numero téléphonique d'encadrant ne doit pas depasser max(20 caracteres)",
        alpha: "Le numero téléphonique d'encadrant est invalide"
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


    const updateEntrep = await Encadrant.update(
      {
        NOM, PRENOM, EMAIL, TITRE, TEL
      },
      {
        where: { ID_ENCA: ID_ENCA }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "encadrant a modifie avec succes",
      result: updateEntrep
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
 * Permet d'afficher toutes  les encadrants
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findAll = async (req, res) => {

  try {
    const { rows = 10, first = 0, sortField, sortOrder, search } = req.query
    const defaultSortField = "DATE_INSERTION"
    const defaultSortDirection = "DESC"
    const sortColumns = {
      encandrant: {
        as: "encandrant",
        fields: {
          NOM: 'NOM',
          PRENOM: 'PRENOM',
          EMAIL: 'EMAIL',
          TITRE: 'TITRE',
          TEL:'TEL',
          DATE_INSERTION: 'encandrant.DATE_INSERTION'
        }
      }
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
      orderColumn = sortColumns.encandrant.fields.DATE_INSERTION
      sortModel = {
        model: 'encandrant',
        as: sortColumns.encandrant.as
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
      `NOM`,
      `PRENOM`,
      `EMAIL`,
      `TITRE`,
      `TEL`
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
    const result = await Encadrant.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      }

    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des encadrants",
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
 * Permet de supprimer l'encadrant
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Encadrant.destroy({
      where: {
        ID_ENCA: {
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

/**
 * Permet de récuprer l'encadrant selon la condition
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneencadrant = async (req, res) => {
  try {
    const { ID_ENCA } = req.params
    const encadran = await Encadrant.findOne({
      where: {
        ID_ENCA
      }
    })
    if (encadran) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "encadrant trouvee",
        result: encadran
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "encadrant non trouve",
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

module.exports = {
  createencadrant,
  findAll,
  deleteItems,
  findOneencadrant,
  updateencadrant,

}