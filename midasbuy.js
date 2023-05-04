const dataServerTOF = require('../dataServerTOF');
const dataServerChimera = require('../dataServerChimera');
const dataServerNikkeGL = require('../dataServerNikkeGL');
const dataServerAlchemy = require('../dataServerAlchemy');

const dataGameMidasbuy = {
   data: [
      {
         id: 4000,
         name: 'PUBG Mobile',
         slug: 'pubg-mobile',
         isZone: false,
         provider: 'midasbuy',
      },
      {
         id: 4001,
         name: 'Chimera Land',
         slug: 'chimera',
         isZone: true,
         provider: 'midasbuy',
         dropdown: dataServerChimera,
      },
      {
         id: 4002,
         name: 'Tower of Fantasy',
         slug: 'tower-of-fantasy',
         isZone: true,
         provider: 'midasbuy',
         dropdown: dataServerTOF,
      },
      {
         id: 4003,
         name: 'Nikke',
         slug: 'nikke',
         isZone: true,
         provider: 'midasbuy',
         dropdown: dataServerNikkeGL,
      },
      {
         id: 4004,
         name: 'Alchemy',
         slug: 'alchemy',
         isZone: true,
         provider: 'midasbuy',
         dropdown: dataServerAlchemy,
      },
   ],
};

module.exports = dataGameMidasbuy;
