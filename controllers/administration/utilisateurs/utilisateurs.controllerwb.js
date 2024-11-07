const express = require("express")
const RESPONSE_CODES = require("../../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../../constants/RESPONSE_STATUS")
const Validation = require("../../../class/Validation")
const { Op } = require("sequelize")
const md5 = require('md5')
const Profil = require("../../../models/Profil")
const UtilisateurUpload = require("../../../class/uploads/UtilisateurUpload")
const IMAGES_DESTINATIONS = require("../../../constants/IMAGES_DESTINATIONS")
const Utilisateursweb = require("../../../models/Utilisateursweb")
const generateCode_userwb = require("../../../utils/generateCode_userwb")



/**
 * fonction  Permet de creer un utilisateur web
* @date  22/10/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const createUserweb = async (req, res) => {
  try {
    const { USERNAME, EMAIL, NOM, PRENOM } = req.body
    const files = req.files || {};
    const { IMAGE } = files;

    const data = { ...req.body, ...req.files };
    // return console.log(data,'data');

    const validation = new Validation(data, {
      USERNAME: {
        required: true,
        length: [1, 30],
        alpha: true
      },

      EMAIL: {
        required: true,
        length: [1, 50],
        alpha: true,
        email: true,
        unique: "utilisateursweb,EMAIL",
      },
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

      IMAGE: {
        required: true,
        image: 4000000
      }
    }, {
      USERNAME: {
        required: "Ce champ est obligatoire",
        length: "Le nom d'utilisateur ne doit pas depasser max(30 caracteres)",
        alpha: "Le nom d'utilisateur est invalide"
      },

      EMAIL: {
        required: "Ce champ est obligatoire",
        length: "L'email ne doit pas depasser max(50 caracteres)",
        alpha: "L'email est invalide",
        email: "L'email n'existe pas",
        unique: "L'email doit etre unique",
      },
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom ne doit etre depasser max(50 carateres)",
        alpha: "Le nom est invalide"
      },
      PRENOM: {
        required: "Ce champ est obligatoire",
        length: "Le prenom ne doit etre depasser max(50 carateres)",
        alpha: "Le prenom est invalide"
      },

      IMAGE: {
        required: "Ce champ est obligatoire",
        image: "L'image ne doit pas depasser 4Mo "
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

    const userUpload = new UtilisateurUpload();
    const { fileInfo } = await userUpload.upload(IMAGE, false);
    const userimage = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.utilisateurs
      }/${fileInfo.fileName}`;

    const numeroRefuwb = generateCode_userwb(5)
    const user = await Utilisateursweb.create({
      USERNAME,
      IMAGE: userimage,
      ID_PROFIL: 3,
      EMAIL,
      NOM,
      PRENOM,
      IS_ACTIF: 1,
      NUMERO_RWB: numeroRefuwb
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le compte utilisateur a bien ete cree avec succes",
      result: user
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
 * Permet pour la modification d'un utilisateur
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const updateUtil = async (req, res) => {

  try {
    const { ID_UTILISATEURWB } = req.params;
    const { USERNAME, EMAIL, NOM, PRENOM } = req.body
    const files = req.files || {};
    const { IMAGE } = files;
    const usersObject = await Utilisateursweb.findByPk(ID_UTILISATEURWB, {
      attributes: ["IMAGE", "ID_UTILISATEURWB"],
    });
    const user = usersObject.toJSON().IMAGE;


    const data = { ...req.body, ...req.files };
    const validation = new Validation(data, {
      USERNAME: {
        required: true,
        length: [1, 30],
        alpha: true
      },

      EMAIL: {
        required: true,
        length: [1, 50],
        alpha: true,
        email: true,
        unique: "utilisateursweb,EMAIL",
      },
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

      IMAGE: {
        required: true,
        image: 4000000
      }
    }, {
      USERNAME: {
        required: "Ce champ est obligatoire",
        length: "Le nom d'utilisateur ne doit pas depasser max(30 caracteres)",
        alpha: "Le nom d'utilisateur est invalide"
      },

      EMAIL: {
        required: "Ce champ est obligatoire",
        length: "L'email ne doit pas depasser max(50 caracteres)",
        alpha: "L'email est invalide",
        email: "L'email n'existe pas",
        unique: "L'email doit etre unique",
      },
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom ne doit etre depasser max(50 carateres)",
        alpha: "Le nom est invalide"
      },
      PRENOM: {
        required: "Ce champ est obligatoire",
        length: "Le prenom ne doit etre depasser max(50 carateres)",
        alpha: "Le prenom est invalide"
      },

      IMAGE: {
        required: "Ce champ est obligatoire",
        image: "L'image ne doit pas depasser 4Mo "
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

    var userImge
    if (IMAGE) {
      const usersUpload = new UtilisateurUpload();
      const { fileInfo } = await usersUpload.upload(IMAGE, false);
      userImge = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.utilisateurs}/${fileInfo.fileName}`;
    }

    const users = await Utilisateursweb.update(
      {
        USERNAME,
        IMAGE: userImge ? userImge : user.IMAGE,
        ID_PROFIL: 3,
        EMAIL,
        NOM,
        PRENOM,
        IS_ACTIF: 1
      },
      {
        where: { ID_UTILISATEURWB: ID_UTILISATEURWB }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'utilisateur  a modifie avec succes",
      result: users
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
 * Permet de lister les profiles
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const profileliste = async (req, res) => {
  try {
    const profile = await Profil.findAll({
      attributes: ['ID_PROFIL', 'DESCRIPTION']
    })

    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Listes des profiles",
      result: profile
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
 * Permet d'activer et desactivee'
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const change_status = async (req, res) => {
  try {
    const { ID_UTILISATEURWB } = req.params;
    const UtiObject = await Utilisateurs.findByPk(ID_UTILISATEURWB, {
      attributes: ["ID_UTILISATEUR", "IS_ACTIF"],
    });
    const user = UtiObject.toJSON();
    let IS_ACTIF = 1;
    if (user.IS_ACTIF) {
      IS_ACTIF = 0;
    } else {
      IS_ACTIF = 1;
    }

    await Utilisateursweb.update(
      { IS_ACTIF: IS_ACTIF },
      {
        where: { ID_UTILISATEURWB: ID_UTILISATEURWB },
      }
    );
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "succès",
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
 * Permet d'afficher un utilisateur
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
      utilisateursweb: {
        as: "utilisateursweb",
        fields: {
          NOM: 'NOM',
          PRENOM: 'PRENOM',
          EMAIL: 'EMAIL',
          DATE_INSERTION: 'DATE_INSERTION',
          USERNAME: 'USERNAME',
        }
      },
      profil: {
        as: "PROFIL",
        fields: {
          DESCRIPTION: 'DESCRIPTION'
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
      orderColumn = sortColumns.utilisateursweb.fields.DATE_INSERTION
      sortModel = {
        model: 'utilisateursweb',
        as: sortColumns.utilisateursweb.as
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
      "NOM",
      'PRENOM',
      'EMAIL',
      'DATE_INSERTION',
      'USERNAME',
      '$profil.DESCRIPTION$',
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
    const result = await Utilisateursweb.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      },
      include: {
        model: Profil,
        as: 'PROFIL',
        required: false,
        attributes: ['ID_PROFIL', 'DESCRIPTION']
      }
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des utilisateurs",
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
 * Permet pour la suppressiuon d'un utilisateur
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Utilisateursweb.destroy({
      where: {
        ID_UTILISATEURWB: {
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
 * Permet pour recuperer un utilisateur selon l'id
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneUtilisateurwb = async (req, res) => {
  try {
    const { ID_UTILISATEURWB } = req.params
    const utilisateurwb = await Utilisateursweb.findOne({
      where: {
        ID_UTILISATEURWB
      },
      include: {
        model: Profil,
        as: 'PROFIL',
        required: false,
        attributes: ['ID_PROFIL', 'DESCRIPTION']
      }
    })
    if (utilisateurwb) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "L'utilisateur web",
        result: utilisateurwb
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "L'utilisateur web non trouve",
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

  findAll,
  deleteItems,
  findOneUtilisateurwb,
  updateUtil,
  profileliste,
  change_status,
  createUserweb
}