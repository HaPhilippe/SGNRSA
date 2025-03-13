const express = require("express")
const { Op } = require("sequelize")

const Entreprise = require("../../../models/Entreprise")
const Validation = require("../../../class/Validation")
const RESPONSE_CODES = require("../../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../../constants/RESPONSE_STATUS")
const EntreriseUpload = require("../../../class/uploads/EntreriseUpload")
const IMAGES_DESTINATIONS = require("../../../constants/IMAGES_DESTINATIONS")

/**
 * Permet de creer l'entreprise
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const createEntreprise = async (req, res) => {
  try {
    const { NOM_ENTREPR, ADRESSE_ENTREPR, SECTEUR, NOM_TUT, PRENOM_TUT, EMAIL, } = req.body
    const files = req.files || {};
    const { LOGO_ENTREPR } = files;
    const data = { ...req.body, ...req.files };

    // return console.log(data,'data_______');

    const validation = new Validation(data, {
      NOM_ENTREPR: {
        required: true,
        length: [1, 100],
        alpha: true
      },
      ADRESSE_ENTREPR: {
        required: true,
        length: [1, 200],
        alpha: true
      },
      SECTEUR: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      // LOGO_ENTREPR: {
      //   required: true,
      //   length: [1, 250],
      //   alpha: true,
      // }
    }, {
      NOM_ENTREPR: {
        required: "Ce champ est obligatoire",
        length: "Le nom de l'entreprise ne doit pas depasser max(100 caracteres)",
        alpha: "Le nom de l'entreprise est invalide"
      },
      ADRESSE_ENTREPR: {
        required: "Ce champ est obligatoire",
        length: "L'addresse de l'entreprise ne doit pas depasser max(200 caracteres)",
        alpha: "L'addresse de l'entreprise est invalide"
      },
      SECTEUR: {
        required: "Ce champ est obligatoire",
        length: "Le secteur de l'entreprise ne doit pas depasser max(50 caracteres)",
        alpha: "Le secteur de l'entreprise est invalide"
      },
      // LOGO_ENTREPR: {
      //   required: "Ce champ est obligatoire",
      //   length: "Le logo entreprise ne doit pas depasser max(250 caracteres)",
      //   alpha: "Le logo entreprise est invalide"
      // }
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

    const logoUpload = new EntreriseUpload();
    const { fileInfo } = await logoUpload.upload(LOGO_ENTREPR, false);
    const logoimage = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.entreprise
      }/${fileInfo.fileName}`;

    const entreprise = await Entreprise.create({
      NOM_ENTREPR,
      ADRESSE_ENTREPR,
      SECTEUR,
      NOM_TUT,
      PRENOM_TUT,
      EMAIL,
      LOGO_ENTREPR: logoimage
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'entreprise a bien ete cree avec succes",
      result: entreprise
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
 * Permet de mettre à jour l'entreprise
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const updateEntreprise = async (req, res) => {

  try {
    const { ID_ENTREPR } = req.params;
    const { NOM_ENTREPR, ADRESSE_ENTREPR, SECTEUR, LOGO_ENTREPR } = req.body

    const data = { ...req.body };
    const validation = new Validation(data, {
      NOM_ENTREPR: {
        required: true,
        length: [1, 100],
        alpha: true
      },
      ADRESSE_ENTREPR: {
        required: true,
        length: [1, 200],
        alpha: true
      },
      SECTEUR: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      LOGO_ENTREPR: {
        required: true,
        length: [1, 250],
        alpha: true,
      }
    }, {
      NOM_ENTREPR: {
        required: "Ce champ est obligatoire",
        length: "Le nom de l'entreprise ne doit pas depasser max(100 caracteres)",
        alpha: "Le nom de l'entreprise est invalide"
      },
      ADRESSE_ENTREPR: {
        required: "Ce champ est obligatoire",
        length: "L'addresse de l'entreprise ne doit pas depasser max(200 caracteres)",
        alpha: "L'addresse de l'entreprise est invalide"
      },
      SECTEUR: {
        required: "Ce champ est obligatoire",
        length: "Le secteur de l'entreprise ne doit pas depasser max(50 caracteres)",
        alpha: "Le secteur de l'entreprise est invalide"
      },
      LOGO_ENTREPR: {
        required: "Ce champ est obligatoire",
        length: "Le logo entreprise ne doit pas depasser max(250 caracteres)",
        alpha: "Le logo entreprise est invalide"
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


    const updateEntrep = await Entreprise.update(
      {
        NOM_ENTREPR, ADRESSE_ENTREPR, SECTEUR, LOGO_ENTREPR
      },
      {
        where: { ID_ENTREPR: ID_ENTREPR }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Entreprise a modifie avec succes",
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
 * Permet d'afficher toutes  les entreprises
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
      entreprise: {
        as: "entreprise",
        fields: {
          NOM_ENTREPR: 'NOM_ENTREPR',
          ADRESSE_ENTREPR: 'ADRESSE_ENTREPR',
          SECTEUR: 'SECTEUR',
          LOGO_ENTREPR: 'LOGO_ENTREPR',
          DATE_INSERTION: 'entreprise.DATE_INSERTION'
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
      orderColumn = sortColumns.entreprise.fields.DATE_INSERTION
      sortModel = {
        model: 'entreprise',
        as: sortColumns.entreprise.as
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
      `NOM_ENTREPR`,
      `ADRESSE_ENTREPR`,
      `SECTEUR`,
      `LOGO_ENTREPR`
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
    const result = await Entreprise.findAndCountAll({
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
      message: "Liste des entreprises",
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
 * Permet de supprimer l'entreprise
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Entreprise.destroy({
      where: {
        ID_ENTREPR: {
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
 * Permet de récuprer l'entreprise selon la condition
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneEntreprise = async (req, res) => {
  try {
    const { ID_ENTREPR } = req.params
    const entrepris = await Entreprise.findOne({
      where: {
        ID_ENTREPR
      }
    })
    if (entrepris) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "entreprise trouvee",
        result: entrepris
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "entreprise non trouve",
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
  createEntreprise,
  findAll,
  deleteItems,
  findOneEntreprise,
  updateEntreprise,

}