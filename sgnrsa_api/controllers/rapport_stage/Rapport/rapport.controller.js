const express = require("express")
const { Op } = require("sequelize")

const Validation = require("../../../class/Validation")
const RESPONSE_CODES = require("../../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../../constants/RESPONSE_STATUS")
const Departement = require("../../../models/Departement")
const Encadrant = require("../../../models/Encadrant")
const Faculte = require("../../../models/Faculte")
const Rapport = require("../../../models/Rapport")
const Etudiant = require("../../../models/Etudiant")
const Entreprise = require("../../../models/Entreprise")
const generateCode_rapport = require("../../../utils/generateCode_rapport")
const RapportUpload = require("../../../class/uploads/RapportUpload")
const IMAGES_DESTINATIONS = require("../../../constants/IMAGES_DESTINATIONS")
const AttestationUploadpdf = require("../../../class/uploads/AttestationUploadpdf")
const FichecotastionUploadpdf = require("../../../class/uploads/FichecotastionUploadpdf")
const PageGardeUpload = require("../../../class/uploads/PageGardeUpload")
const RapportUploadpdf = require("../../../class/uploads/RapportUploadpdf")

/**
 * Permet de creer le rapport
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const createrapport = async (req, res) => {
  try {
    const {
      ID_ETUD,
      ID_ENTREPR,
      DATE_DEBUT,
      DATE_FIN,
      SUJET,
      NOTE_EVALUATION
    } = req.body;
    const files = req.files || {};
    const { PAGE_GARDE, RAPPORT_PDF, FICHIER_COTATION_PDF, ATTESTATION_DU_DEPOT } = files;
    const data = { ...req.body, ...req.files };
    // return console.log(data,'data');


    // const validation = new Validation(data, {
    //   ID_ETUD: {
    //     required: true
    //   },
    //   ID_ENTREPR: {
    //     required: true
    //   },
    //   DATE_DEBUT: {
    //     required: true
    //   },
    //   DATE_FIN: {
    //     required: true
    //   },
    //   SUJET: {
    //     required: true,
    //     length: [1, 200],
    //     alpha: true
    //   },
    //   RAPPORT_PDF: {
    //     required: true
    //   },
    //   NOTE_EVALUATION: {
    //     required: true
    //   },
    //   ATTESTATION_DU_DEPOT: {
    //     required: true
    //   },

    //   PAGE_GARDE: {
    //     image: 4000000
    //   },
    //   FICHIER_COTATION_PDF: {
    //     required: true
    //   }
    // }, {
    //   ID_ETUD: {
    //     required: "Ce champ est obligatoire"
    //   },
    //   ID_ENTREPR: {
    //     required: "Ce champ est obligatoire"
    //   },
    //   DATE_DEBUT: {
    //     required: "Ce champ est obligatoire"
    //   },
    //   DATE_FIN: {
    //     required: "Ce champ est obligatoire"
    //   },
    //   SUJET: {
    //     required: "Ce champ est obligatoire"
    //   },
    //   RAPPORT_PDF: {
    //     required: "Ce champ est obligatoire"
    //   },
    //   ATTESTATION_DU_DEPOT: {
    //     required: "Ce champ est obligatoire"
    //   },
    //   PAGE_GARDE: {
    //     required: "Ce champ est obligatoire",
    //     image: "L'image ne doit pas depasser 4Mo "
    //   },
    //   NOTE_EVALUATION: {
    //     required: "Ce champ est obligatoire"
    //   },
    //   FICHIER_COTATION_PDF: {
    //     required: "Ce champ est obligatoire"
    //   }
    // })
    // await validation.run()
    // const isValid = await validation.isValidate()
    // if (!isValid) {
    //   const errors = await validation.getErrors()
    //   return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
    //     statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
    //     httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
    //     message: "Probleme de validation des donnees",
    //     result: errors
    //   })
    // }

    const numeroRefRapport = generateCode_rapport(5)
    //rapport
    const rapportUpload = new RapportUpload();
    const { fileInfo } = await rapportUpload.upload(RAPPORT_PDF, false);
    const pdf_rappor = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.rapport}/${fileInfo.fileName}`;
    // console.log(fileInfo,);

    // attestationDepot
    const attestationDepotUpload = new AttestationUploadpdf();
    const { fileInfo1 } = await attestationDepotUpload.upload(ATTESTATION_DU_DEPOT, false);

    const pdf_attestationDepot = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.attestationpdf}/${fileInfo1.fileName}`;


    //fiche cotastion
    const fichecotastionUpload = new FichecotastionUploadpdf();
    const { fileInfo2 } = await fichecotastionUpload.upload(FICHIER_COTATION_PDF, false);
    const pdf_fichecotastion = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.fichecotastionpdf}/${fileInfo2.fileName}`;

    //pagegarde
    const pageGardeUpload = new PageGardeUpload();
    const { fileInfo3 } = await pageGardeUpload.upload(PAGE_GARDE, false);
    const pageGarde = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.pagegarde}/${fileInfo3.fileName}`;

    const rapport = await Rapport.create({
      ID_ETUD,
      ID_ENTREPR,
      DATE_DEBUT,
      DATE_FIN,
      SUJET,
      RAPPORT_PDF: pdf_rappor,
      NOTE_EVALUATION,
      ATTESTATION_DU_DEPOT: pdf_attestationDepot,
      PAGE_GARDE: pageGarde,
      FICHIER_COTATION_PDF: pdf_fichecotastion,
      REF_RAP: numeroRefRapport
    })
    // console.log(res,'rappppppppppp',typeof(res));
    
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le rapport a bien ete cree avec succes",
      result: rapport
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

// const createrapport = async (req, res) => {
//   try {
//     const {
//       ID_ETUD,
//       ID_ENTREPR,
//       DATE_DEBUT,
//       DATE_FIN,
//       SUJET,
//       NOTE_EVALUATION
//     } = req.body;
//     const files = req.files || {};
//     const { PAGE_GARDE, RAPPORT_PDF, FICHIER_COTATION_PDF, ATTESTATION_DU_DEPOT } = files;

//     const data = { ...req.body, ...req.files };

//     //  return console.log(data,'______');

//     const validation = new Validation(data, {
//       ID_ETUD: {
//         required: true
//       },
//       ID_ENTREPR: {
//         required: true
//       },
//       DATE_DEBUT: {
//         required: true
//       },
//       DATE_FIN: {
//         required: true
//       },
//       SUJET: {
//         required: true,
//         length: [1, 200],
//         alpha: true
//       },
//       RAPPORT_PDF: {
//         required: true
//       },
//       NOTE_EVALUATION: {
//         required: true
//       },
//       ATTESTATION_DU_DEPOT: {
//         required: true
//       },

//       PAGE_GARDE: {
//         image: 4000000
//       },
//       FICHIER_COTATION_PDF: {
//         required: true
//       }


//     }, {
//       ID_ETUD: {
//         required: "Ce champ est obligatoire"
//       },
//       ID_ENTREPR: {
//         required: "Ce champ est obligatoire"
//       },
//       DATE_DEBUT: {
//         required: "Ce champ est obligatoire"
//       },
//       DATE_FIN: {
//         required: "Ce champ est obligatoire"
//       },
//       SUJET: {
//         required: "Ce champ est obligatoire"
//       },
//       RAPPORT_PDF: {
//         required: "Ce champ est obligatoire"
//       },
//       ATTESTATION_DU_DEPOT: {
//         required: "Ce champ est obligatoire"
//       },
//       PAGE_GARDE: {
//         required: "Ce champ est obligatoire",
//         image: "L'image ne doit pas depasser 4Mo "
//       },
//       NOTE_EVALUATION: {
//         required: "Ce champ est obligatoire"
//       },
//       FICHIER_COTATION_PDF: {
//         required: "Ce champ est obligatoire"
//       },

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

//     const numeroRefRapport = generateCode_rapport(5)
//     // let fileInfo;

//     //rapport
//     const rapportUpload = new RapportUpload();
//     const { fileInfo } = await rapportUpload.upload(RAPPORT_PDF, false);
//     const pdf_rappor = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.rapport}/${fileInfo.fileName}`;
//     // console.log(fileInfo,);

//     // attestationDepot
//     const attestationDepotUpload = new AttestationUploadpdf();
//     const { fileInfo1 } = await attestationDepotUpload.upload(ATTESTATION_DU_DEPOT, false);

//     const pdf_attestationDepot = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.attestationpdf}/${fileInfo1.fileName}`;


//     //fiche cotastion
//     const fichecotastionUpload = new FichecotastionUploadpdf();
//     const { fileInfo2 } = await fichecotastionUpload.upload(FICHIER_COTATION_PDF, false);
//     const pdf_fichecotastion = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.fichecotastionpdf}/${fileInfo2.fileName}`;

//     //pagegarde
//     const pageGardeUpload = new PageGardeUpload();
//     const { fileInfo3 } = await pageGardeUpload.upload(PAGE_GARDE, false);
//     const pageGarde = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.pagegarde}/${fileInfo3.fileName}`;


//     const rapport = await Rapport.create({
     
//     })
//     res.status(RESPONSE_CODES.CREATED).json({
//       statusCode: RESPONSE_CODES.CREATED,
//       httpStatus: RESPONSE_STATUS.CREATED,
//       message: "Le rapport a bien ete enregistré avec succes",
//       result: rapport
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


/**
 * Permet de mettre à jour l'rapport
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const updaterapport = async (req, res) => {

  try {
    const { ID_RAPPORT } = req.params;

    const {
      ID_ETUD,
      ID_ENTREPR,
      DATE_DEBUT,
      DATE_FIN,
      SUJET,
      NOTE_EVALUATION
    } = req.body
    const files = req.files || {};
    const { PAGE_GARDE, RAPPORT_PDF, FICHIER_COTATION_PDF, ATTESTATION_DU_DEPOT } = files;
    const data = { ...req.body, ...req.files };

    const validation = new Validation(data, {
      ID_ETUD: {
        required: true
      },
      ID_ENTREPR: {
        required: true
      },
      DATE_DEBUT: {
        required: true
      },
      DATE_FIN: {
        required: true
      },
      SUJET: {
        required: true,
        length: [1, 200],
        alpha: true
      },
      NOTE_EVALUATION: {
        required: true
      },
      PAGE_GARDE: {
        image: 4000000
      },

    }, {
      ID_ETUD: {
        required: "Ce champ est obligatoire"
      },
      ID_ENTREPR: {
        required: "Ce champ est obligatoire"
      },
      DATE_DEBUT: {
        required: "Ce champ est obligatoire"
      },
      DATE_FIN: {
        required: "Ce champ est obligatoire"
      },
      SUJET: {
        required: "Ce champ est obligatoire"
      },
      NOTE_EVALUATION: {
        required: "Ce champ est obligatoire"
      },
      RAPPORT_PDF: {
        required: "Ce champ est obligatoire"
      },
      PAGE_GARDE: {
        required: "Ce champ est obligatoire",
        image: "L'image ne doit pas depasser 4Mo "
      },
      FICHIER_COTATION_PDF: {
        required: "Ce champ est obligatoire"
      },
      ATTESTATION_DU_DEPOT: {
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

    let fileInfo;
    const pagegardeUpload = new PageGardeUpload();
    fileInfo = await pagegardeUpload.upload(PAGE_GARDE, false);
    const pagegarde = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.pagegarde}/${fileInfo.fileName}`;

    //pdf_rapport  attestationpdf
    const pdf_rapport = new RapportUploadpdf();
    fileInfo = await pdf_rapport.upload(RAPPORT_PDF, false);
    const pdf_rappor = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.rapport}/${fileInfo.fileName}`;


    // const pdf_rappor = new RapportUploadpdf();
    // fileInfo = await pdf_rapport.upload(RAPPORT_PDF, false);
    // const pdf_rappor = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.rapport}/${fileInfo.fileName}`;

    //  return console.log(pdf_rappor,'pdf_rappor');




    const updateRapport = await Rapport.update(
      {
        ID_ETUD,
        ID_ENTREPR,
        DATE_DEBUT,
        DATE_FIN,
        SUJET,
        NOTE_EVALUATION,
        PAGE_GARDE: pagegarde,
        RAPPORT_PDF: pdf_rappor,
        FICHIER_COTATION_PDF,
        ATTESTATION_DU_DEPOT
      },
      {
        where: { ID_RAPPORT: ID_RAPPORT }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "rapport a modifie avec succes",
      result: updateRapport
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
 * Permet d'afficher toutes  les rapports
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
      rapport: {
        as: "rapport",
        fields: {
          ID_RAPPORT: 'ID_RAPPORT',
          DATE_DEBUT: 'DATE_DEBUT',
          DATE_FIN: 'DATE_FIN',
          SUJET: 'SUJET',
          NOTE_EVALUATION: 'NOTE_EVALUATION',
          PAGE_GARDE: 'PAGE_GARDE',
          RAPPORT_PDF: 'RAPPORT_PDF',
          FICHIER_COTATION_PDF: 'FICHIER_COTATION_PDF',
          ATTESTATION_DU_DEPOT: 'ATTESTATION_DU_DEPOT',
          DATE_INSERTION: 'rapport.DATE_INSERTION'
        }
      },
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
      orderColumn = sortColumns.rapport.fields.DATE_INSERTION
      sortModel = {
        model: 'rapport',
        as: sortColumns.rapport.as
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
    const result = await Rapport.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      },
      include: [{
        model: Etudiant,
        as: 'etudiant',
        required: false,
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
      },
      {
        model: Entreprise,
        as: 'entreprise',
        required: false
      }
      ]

    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des rapports",
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
 * Permet de supprimer l'rapport
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Rapport.destroy({
      where: {
        ID_RAPPORT: {
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
 * Permet de récuprer l'rapport selon la condition
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOnerapport = async (req, res) => {
  try {
    const { ID_RAPPORT } = req.params
    const rapport = await Rapport.findOne({
      where: {
        ID_RAPPORT
      },
      include: [{
        model: Etudiant,
        as: 'etudiant',
        required: false
      },
      {
        model: Entreprise,
        as: 'entreprise',
        required: false
      }
      ]
    })
    if (rapport) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "rapport trouvee",
        result: rapport
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "rapport non trouve",
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
  createrapport,
  findAll,
  deleteItems,
  findOnerapport,
  updaterapport,

}