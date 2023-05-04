const configIdGame = require('../idgame.config');
const cekAlchemy = require('./alchemy');
const cekChimera = require('./chimera');
const cekNIkkeGL = require('./nikkeGL');
const cekPubg = require('./pubg');
const cekTOF = require('./towerOfFantasi');

const midasbuyHelper = async (browser, redis, slug, id, zone = '') => {
   switch (slug) {
      case 'pubg-mobile':
         if (configIdGame.midasbuyPubg == false) return { code: 404, message: 'Fitur Cek Pubg Mobile Tidak Aktif' };
         const cekPubgRedis = await redis.get(`pubg:${id}`);
         if (cekPubgRedis) {
            return JSON.parse(cekPubgRedis);
         } else {
            const cekIdPubg = await cekPubg(browser, id, zone);
            if (cekIdPubg.code == 200) {
               redis.set(`pubg:${id}`, JSON.stringify(cekIdPubg), 'EX', 60 * 60 * 24);
            }
            return cekIdPubg;
         }

         break;
      case 'tower-of-fantasy':
         if (configIdGame.midasbuyTOF == false) return { code: 404, message: 'Fitur Cek Tower Of Fantasy Tidak Aktif' };
         const cekTofRedis = await redis.get(`tof:${id}:${zone}`);
         if (cekTofRedis) {
            return JSON.parse(cekTofRedis);
         } else {
            const cekIdTof = await cekTOF(browser, id, zone);
            if (cekIdTof.code == 200) {
               redis.set(`tof:${id}:${zone}`, JSON.stringify(cekIdTof), 'EX', 60 * 60 * 24);
            }
            return cekIdTof;
         }

         break;
      case 'nikke':
         if (configIdGame.midasbuyNikkeGL == false) return { code: 404, message: 'Fitur Cek Nikke Tidak Aktif' };
         const cekNikkeRedis = await redis.get(`nikke:${id}_${zone}`);
         if (cekNikkeRedis) {
            return JSON.parse(cekNikkeRedis);
         } else {
            const cekIdNikke = await cekNIkkeGL(browser, id, zone);
            if (cekIdNikke.code == 200) {
               redis.set(`nikke:${id}_${zone}`, JSON.stringify(cekIdNikke), 'EX', 60 * 60 * 24);
            }
            return cekIdNikke;
         }

         break;
      case 'chimera':
         if (configIdGame.midasbuyChimera == false) return { code: 404, message: 'Fitur Cek Chimera Tidak Aktif' };
         const cekChimeraRedis = await redis.get(`chimera:${id}_${zone}`);
         if (cekChimeraRedis) {
            return JSON.parse(cekChimeraRedis);
         } else {
            const cekIdChimera = await cekChimera(browser, id, zone);
            if (cekIdChimera.code == 200) {
               redis.set(`chimera:${id}_${zone}`, JSON.stringify(cekIdChimera), 'EX', 60 * 60 * 24);
            }
            return cekIdChimera;
         }
         break;
      case 'alchemy':
         if (configIdGame.midasbuyAlchemy == false) return { code: 404, message: 'Fitur Cek Alchemy Tidak Aktif' };
         const cekAlchemyRedis = await redis.get(`alchemy:${id}_${zone}`);
         if (cekAlchemyRedis) {
            return JSON.parse(cekAlchemyRedis);
         } else {
            const cekIdAlchemy = await cekAlchemy(browser, id, zone);
            if (cekIdAlchemy.code == 200) {
               redis.set(`alchemy:${id}_${zone}`, JSON.stringify(cekIdAlchemy), 'EX', 60 * 60 * 24);
            }
            return cekIdAlchemy;
         }

         break;

      default:
         return { status: 404, message: 'Game Tidak Ditemukan ya' };
   }
};

module.exports = midasbuyHelper;
