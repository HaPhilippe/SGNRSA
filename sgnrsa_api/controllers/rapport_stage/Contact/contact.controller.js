const express = require("express")
const { Op } = require("sequelize")


const Validation = require("../../../class/Validation")
const RESPONSE_CODES = require("../../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../../constants/RESPONSE_STATUS")
const Encadrant = require("../../../models/Encadrant")
const Contact = require("../../../models/Contact")

/**
 * Permet d'enregistrer un message
 * @date  29/10/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const createcontact = async (req, res) => {
  try {
    const { NOM, PRENOM, EMAIL, MESSAGE} = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      NOM: {
        required: true,
        length: [1, 30],
        alpha: true
      },
      PRENOM: {
        required: true,
        length: [1, 30],
        alpha: true
      },
      EMAIL: {
        required: true,
        length: [1, 90],
        alpha: true
      },
      MESSAGE: {
        required: true
      }
    }, {
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom de l'encadrant ne doit pas depasser max(30 caracteres)",
        alpha: "Le nom de l'encadrant est invalide"
      },
      PRENOM: {
        required: "Ce champ est obligatoire",
        length: "Le prenom ne doit pas depasser max(20 caracteres)",
        alpha: "Le prenom est invalide"
      },
      EMAIL: {
        required: "Ce champ est obligatoire",
        length: "L'email de l'encadrant ne doit pas depasser max(90 caracteres)",
        alpha: "L'email de l'encadrant est invalide"
      },
      MESSAGE: {
        required: "Ce champ est obligatoire"
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

    const contact = await Contact.create({
      NOM, PRENOM, EMAIL,MESSAGE,ID_STATUT_C:1,ID_ADMIN:1
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le message a bien ete envoyé avec succes",
      result: contact
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
 * Permet de mettre à jour du contact
 * @date  29/10/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const updatecontact = async (req, res) => {

  try {
    const { ID_CONTACT } = req.params;
    const { ID_STATUT_C } = req.body

    const data = { ...req.body };
    const validation = new Validation(data, { 
      ID_STATUT_C: {
        required: true,
      }
    }, {
      ID_STATUT_C: {
        required: "Ce champ est obligatoire"
      },
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


    const updatecontat = await Contact.update(
      {
        ID_STATUT_C
      },
      {
        where: { ID_CONTACT: ID_CONTACT }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Contat a modifie avec succes",
      result: updatecontat
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
 * Permet d'afficher tous  les contacts
 * @date  29/10/2024
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
      contact: {
        as: "contact",
        fields: {
          NOM: 'NOM',
          PRENOM: 'PRENOM',
          EMAIL: 'EMAIL',
          MESSAGE: 'MESSAGE',
          DATE_INSERTION: 'contact.DATE_INSERTION'
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
      orderColumn = sortColumns.contact.fields.DATE_INSERTION
      sortModel = {
        model: 'contact',
        as: sortColumns.contact.as
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
      `MESSAGE`,
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
    const result = await Contact.findAndCountAll({
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
      message: "Liste des contacts",
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
 * Permet de supprimer le contact
 * @date  29/10/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Contact.destroy({
      where: {
        ID_CONTACT: {
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
 * Permet de récuprer un contact selon la condition
 * @date  29/10/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOnecontact = async (req, res) => {
  try {
    const { ID_CONTACT } = req.params
    const contact = await Contact.findOne({
      where: {
        ID_CONTACT
      }
    })
    if (contact) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "contact trouve",
        result: contact
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "contact non trouve",
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
  createcontact,
  findAll,
  deleteItems,
  findOnecontact,
  updatecontact,

}