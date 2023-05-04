const dataCoda = require('./codashop.json');
const dataDunia = require('./duniaGames.json');
const dataGameMidasbuy = require('./midasbuy.js');
const dataAU2mobile = require('./au2mobile.js');
const configIdGame = require('../../idgame.config');

const cekMidasbuy = configIdGame.midasbuy ? dataGameMidasbuy.data : [];

let oldDataGame = [...dataCoda.data, ...dataDunia.data, ...cekMidasbuy, ...dataAU2mobile.data];

const dataGame = [...new Map(oldDataGame.map((m) => [m.slug, m])).values()];

module.exports = { dataGame };
