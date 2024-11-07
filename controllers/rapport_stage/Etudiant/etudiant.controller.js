const express = require("express")
const { Op } = require("sequelize")


const Validation = require("../../../class/Validation")
const RESPONSE_CODES = require("../../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../../constants/RESPONSE_STATUS")
const generateCode_CDRef = require("../../../utils/generateCode_ETUD_CART")
const EtudiantUpload = require("../../../class/uploads/PersonneUpload")
const IMAGES_DESTINATIONS = require("../../../constants/IMAGES_DESTINATIONS")
const Etudiant = require("../../../models/Etudiant")
const Departement = require("../../../models/Departement")
const Encadrant = require("../../../models/Encadrant")
const Faculte = require("../../../models/Faculte")


/**
 * Permet de creer l'etudiant
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const createetudiant = async (req, res) => {
  try {
    const { NOM, PRENOM, EMAIL, ID_DEPARTEMENT, ID_ENCA, DATE_NAISSANCE, GENRE, ADRESS } = req.body
    const files = req.files || {};
    const { PROFIL } = files;
    const data = { ...req.body, ...req.files };
    // return console.log(data,'data');


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
      ID_DEPARTEMENT: {
        required: true,
      },
      ID_ENCA: {
        required: true,
      },
      DATE_NAISSANCE: {
        required: true
      },
      GENRE: {
        required: true
      },

      PROFIL: {

        image: 4000000
      },
      ADRESS: {
        required: true,
        length: [1, 150],
        alpha: true
      }
    }, {
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom de l'etudiant ne doit pas depasser max(50 caracteres)",
        alpha: "Le nom de l'etudiant est invalide"
      },
      PRENOM: {
        required: "Ce champ est obligatoire",
        length: "Le prenom de l'etudiant ne doit pas depasser max(50 caracteres)",
        alpha: "Le prenom de l'etudiant est invalide"
      },
      EMAIL: {
        required: "Ce champ est obligatoire",
        length: "L'email de l'etudiant ne doit pas depasser max(100 caracteres)",
        alpha: "L'email de l'etudiant est invalide"
      },
      ID_DEPARTEMENT: {
        required: "Ce champ est obligatoire"
      },
      ID_ENCA: {
        required: "Ce champ est obligatoire"
      },
      DATE_NAISSANCE: {
        required: "Ce champ est obligatoire"
      },
      GENRE:{
        required: "Ce champ est obligatoire"
      },
      PROFIL: {
        required: "Ce champ est obligatoire",
        image: "L'image ne doit pas depasser 4Mo "
      },
      ADRESS: {
        required: "Ce champ est obligatoire",
        length: "L'adresse de l'etudiant ne doit pas depasser max(150 caracteres)",
        alpha: "L'adresse de l'etudiant est invalide"
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

    const numerocarte = generateCode_CDRef(6)

    //profil
    const etudiantUpload = new EtudiantUpload();
    const { fileInfo } = await etudiantUpload.upload(PROFIL, false);
    // console.log(fileInfo,'-----------------');
    
    const etudiantProfil = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.etudiant}/${fileInfo.fileName}`;


    const etudiant = await Etudiant.create({
      NOM,
      PRENOM,
      EMAIL,
      ID_DEPARTEMENT,
      ID_ENCA,
      NUMERO_REF: numerocarte,
      DATE_NAISSANCE,
      GENRE,
      PROFIL: etudiantProfil,
      ADRESS
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'etudiant a bien ete cree avec succes",
      result: etudiant
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
 * Permet de mettre à jour l'etudiant
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const updateetudiant = async (req, res) => {

  try {
    const { ID_ENCA } = req.params;

    const { NOM, PRENOM, EMAIL, ID_DEPARTEMENT, DATE_NAISSANCE, GENR, ADRESS } = req.body
    const files = req.files || {};
    const { PROFIL } = files;
    const data = { ...req.body, ...req.files };

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
      ID_DEPARTEMENT: {
        required: true,
      },
      ID_ENCA: {
        required: true,
      },
      DATE_NAISSANCE: {
        required: true
      },

      PROFIL: {

        image: 4000000
      },
      ADRESS: {
        required: true,
        length: [1, 150],
        alpha: true
      }
    }, {
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom de l'etudiant ne doit pas depasser max(50 caracteres)",
        alpha: "Le nom de l'etudiant est invalide"
      },
      PRENOM: {
        required: "Ce champ est obligatoire",
        length: "Le prenom de l'etudiant ne doit pas depasser max(50 caracteres)",
        alpha: "Le prenom de l'etudiant est invalide"
      },
      EMAIL: {
        required: "Ce champ est obligatoire",
        length: "L'email de l'etudiant ne doit pas depasser max(100 caracteres)",
        alpha: "L'email de l'etudiant est invalide"
      },
      ID_DEPARTEMENT: {
        required: "Ce champ est obligatoire"
      },
      ID_ENCA: {
        required: "Ce champ est obligatoire"
      },
      DATE_NAISSANCE: {
        required: "Ce champ est obligatoire"
      },

      PROFIL: {
        required: "Ce champ est obligatoire",
        image: "L'image ne doit pas depasser 4Mo "
      },
      ADRESS: {
        required: "Ce champ est obligatoire",
        length: "L'adresse de l'etudiant ne doit pas depasser max(150 caracteres)",
        alpha: "L'adresse de l'etudiant est invalide"
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


    //profil
    const etudiantUpload = new EtudiantUpload();
    const { fileInfo } = await etudiantUpload.upload(PROFIL, false);
    const etudiantProfil = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.etudiant}/${fileInfo.fileName}`;


    const updateEtudia = await Etudiant.update(
      {
        NOM,
        PRENOM,
        EMAIL,
        ID_DEPARTEMENT,
        ID_ENCA,
        NUMERO_CARTE: numerocarte,
        DATE_NAISSANCE,
        GENR,
        PROFIL: etudiantProfil,
        ADRESS
      },
      {
        where: { ID_ETUD: ID_ETUD }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "etudiant a modifie avec succes",
      result: updateEtudia
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
 * Permet d'afficher toutes  les etudiants
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findAll = async (req, res) => {

  try {
    const { rows = 10, first = 0, sortField, sortOrder, search } = req.query
    const defaultSortField = "DATE_ENREGISTREMNT"
    const defaultSortDirection = "DESC"
    const sortColumns = {
      etudiant: {
        as: "etudiant",
        fields: {
          ID_ETUD: 'ID_ETUD',
          NOM: 'NOM',
          PRENOM: 'PRENOM',
          EMAIL: 'EMAIL',
          NUMERO_CARTE: 'NUMERO_CARTE',
          DATE_NAISSANCE: 'DATE_NAISSANCE',
          GENR: 'GENR',
          PROFIL: 'PROFIL',
          ADRESS: 'ADRESS',
          DATE_ENREGISTREMNT: 'DATE_ENREGISTREMNT'
        }
      },
      departement: {
        as: "departement",
        fields: {
          ID_DEPARTEMENT: 'ID_DEPARTEMENT',
          NOM_DEPARTEMENT: 'NOM_DEPARTEMENT',
          DESIGNATION_DEP: 'DESIGNATION_DEP',
          TE_INSERTION: 'departement.DATE_INSERTION'
        }
      },
      encandrant: {
        as: "encandrant",
        fields: {
          ID_ENCA: 'ID_ENCA',
          NOM: 'NOM',
          PRENOM: 'PRENOM',
          EMAIL: 'EMAIL',
          TITRE: 'TITRE',
          TEL: 'TEL',
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
      orderColumn = sortColumns.etudiant.fields.DATE_ENREGISTREMNT
      sortModel = {
        model: 'etudiant',
        as: sortColumns.etudiant.as
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
    // const globalSearchColumns = [
    //   `NOM`,
    //   `PRENOM`,
    //   `EMAIL`,
    //   `TITRE`,
    //   `TEL`
    // ]
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
    const result = await Etudiant.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      },
      include: [{
        model: Departement,
        as: 'departement',
        required: false,
        include: {
          model: Faculte,
          as: 'faculte',
          required: false
        }
      },
      {
        model: Encadrant,
        as: 'encandrant',
        required: false
      }
      ]

    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des etudiants",
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
 * Permet de supprimer l'etudiant
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Etudiant.destroy({
      where: {
        ID_ETUD: {
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
 * Permet de récuprer l'etudiant selon la condition
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneetudiant = async (req, res) => {
  try {
    const { ID_ETUD } = req.params
    const etud = await Etudiant.findOne({
      where: {
        ID_ETUD
      },
      include: [{
        model: Departement,
        as: 'departement',
        required: false,
        include: {
          model: Faculte,
          as: 'faculte',
          required: false
        }
      },
      {
        model: Encadrant,
        as: 'encandrant',
        required: false
      }
      ]
    })
    if (etud) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "etudiant trouvee",
        result: etud
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "etudiant non trouve",
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
  createetudiant,
  findAll,
  deleteItems,
  findOneetudiant,
  updateetudiant,

}