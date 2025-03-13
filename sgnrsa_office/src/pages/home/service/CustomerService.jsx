import fetchApi from "../../../helpers/fetchApi";

export const CustomerService = {
    getData() {
        return [


            {
                "id": 1,
                "name": "Genie logiciel",
                "country": {
                    "name": "Informatique",
                    "last_name": "Apprendre l'informatique",
                    "code": 1
                },
                "company": "Option de programmation",
                "date": "2024-10-19T23:56:26.000Z",
                "status": "active",
                "verified": true,
                "activity": 10,
                "representative": {
                    "name": "Informatique",
                    "image": "faculte_image.png"
                },
                "balance": 0
            },
            {
                "id": 2,
                "name": "Réseaux informatique",
                "country": {
                    "name": "Informatique",
                    "last_name": "Apprendre l'informatique",
                    "code": 1
                },
                "company": "Configuration de quelques matériaux en réseaux",
                "date": "2024-10-19T23:56:26.000Z",
                "status": "active",
                "verified": true,
                "activity": 10,
                "representative": {
                    "name": "Informatique",
                    "image": "faculte_image.png"
                },
                "balance": 0
            },
            {
                "id": 3,
                "name": "Répartion logiciel",
                "country": {
                    "name": "Maintenance",
                    "last_name": "Réparation matérielles",
                    "code": 2
                },
                "company": "Option de la maintenance logiciel",
                "date": "2024-10-19T23:58:20.000Z",
                "status": "active",
                "verified": true,
                "activity": 10,
                "representative": {
                    "name": "Maintenance",
                    "image": "faculte_image.png"
                },
                "balance": 0
            },
            {
                "id": 4,
                "name": "FSGEA",
                "country": {
                    "name": "Economie",
                    "last_name": "Gestion financieres",
                    "code": 3
                },
                "company": "Option de fiscalité",
                "date": "2024-10-20T00:00:39.000Z",
                "status": "active",
                "verified": true,
                "activity": 10,
                "representative": {
                    "name": "Economie",
                    "image": "faculte_image.png"
                },
                "balance": 0
            },
            {
                "id": 5,
                "name": "Comptabilité",
                "country": {
                    "name": "Economie",
                    "last_name": "Gestion financieres",
                    "code": 3
                },
                "company": "Gestion comptable",
                "date": "2024-10-20T00:00:39.000Z",
                "status": "active",
                "verified": true,
                "activity": 10,
                "representative": {
                    "name": "Economie",
                    "image": "faculte_image.png"
                },
                "balance": 0
            },



            {
                id: 1000,
                name: 'James Butt',
                country: {
                    name: 'Algeria',
                    last_name: 'Bienvenu',
                    code: 'dz'
                },
                company: 'Benton, John B Jr',
                date: '2015-09-13',
                status: 'unqualified',
                verified: true,
                activity: 17,
                representative: {
                    name: 'Ioni Bowcher',
                    image: 'ionibowcher.png'
                },
                balance: 70663
            },
            {
                id: 1001,
                name: 'Josephine Darakjy',
                country: {
                    name: 'Egypt',
                    code: 'eg'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'proposal',
                verified: true,
                activity: 0,
                representative: {
                    name: 'Amy Elsner',
                    image: 'amyelsner.png'
                },
                balance: 82429
            },


        ];

    },

    getCustomersSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getCustomersMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getCustomersLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getCustomersXLarge() {
        return Promise.resolve(this.getData());
    },

    getCustomers(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&')
            : '';

        // return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
        return fetchApi('/rapport_stage/faculte_depar/fetch?' + queryParams).then((res) => res.json());
    }
};
