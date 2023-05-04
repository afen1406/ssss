const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const redis = require('redis');
const { dataGame } = require('./utils/listGame/dataGame');
const _ = require('lodash');
const getZoneController = require('./controllers/getZoneController');
const { cekIdGameController } = require('./controllers/cekIdGameController');
const playwright = require('playwright');
const configIdGame = require('./idgame.config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
   const newDataGame = dataGame.map((item) => {
      return {
         name: item.name,
         slug: item.slug,
         endpoint: `/api/game/${item.slug}`,
         query: `?id=xxxx${item.isZone ? '&zone=xxx' : ''}`,
         hasZoneId: item.isZone ? true : false,
         listZoneId: item.dropdown ? `/api/game/get-zone/${item.slug}` : null,
      };
   });

   return res.json({
      name: 'Cek Data Game',
      author: 'Bagusok',
      data: _.orderBy(newDataGame, ['name'], ['asc']),
   });
});

app.get('/api/game/:slug', cekIdGameController);

app.get('/api/game/get-zone/:game', getZoneController);

app.all('*', (req, res) => {
   res.status(404).json({
      status: false,
      message: 'Not Found',
   });
});

if (configIdGame.midasbuy) {
   (async () => {
      let browsers = {};
      const browser = await playwright.chromium.launch({
         headless: true,
      });
      const context = await browser.newContext();

      // PUBGM
      if (configIdGame.midasbuyPubg) {
         console.log('[+] Membuka Browser PUBGM');
         const pagePubg = await context.newPage();
         await pagePubg.goto('https://www.midasbuy.com/midasbuy/id/buy/pubgm', { waitUntil: 'domcontentloaded' });
         const cek = await pagePubg.getByTitle('UC STATION', { timeout: 10000 }).isVisible();
         if (cek) {
            await pagePubg.getByTitle('UC STATION', { timeout: 10000 }).locator('div').nth(1).click();
         }
         browsers.pubg = pagePubg;
         console.log('[+] Browser PUBGM Berhasil Dibuka \n');
      }

      // TOF
      if (configIdGame.midasbuyTOF) {
         console.log('[+] Membuka Browser TOF');
         const pageTOF = await context.newPage();
         await pageTOF.goto('https://www.midasbuy.com/midasbuy/id/buy/toweroffantasy-global', {
            waitUntil: 'domcontentloaded',
         });
         browsers.tof = pageTOF;
         console.log('[+] Browser TOF Berhasil Dibuka \n');
      }

      // NIKKEGL
      if (configIdGame.midasbuyNikkeGL) {
         console.log('[+] Membuka Browser NIKKEGL');
         const pageNikkeGL = await context.newPage();
         await pageNikkeGL.goto('https://www.midasbuy.com/midasbuy/id/buy/nikkegl', { waitUntil: 'domcontentloaded' });
         browsers.nikkegl = pageNikkeGL;
         console.log('[+] Browser NIKKEGL Berhasil Dibuka \n');
      }

      // CHIMERA
      if (configIdGame.midasbuyChimera) {
         console.log('[+] Membuka Browser CHIMERA');
         const pageChimera = await context.newPage();
         await pageChimera.goto('https://www.midasbuy.com/midasbuy/id/buy/chimeraland', {
            waitUntil: 'domcontentloaded',
         });
         browsers.chimera = pageChimera;
         console.log('[+] Browser CHIMERA Berhasil Dibuka \n');
      }

      // ALCHEMY
      if (configIdGame.midasbuyAlchemy) {
         console.log('[+] Membuka Browser ALCHEMY');
         const pageAlchemy = await context.newPage();
         await pageAlchemy.goto('https://www.midasbuy.com/midasbuy/id/buy/asg', { waitUntil: 'domcontentloaded' });
         browsers.alchemy = pageAlchemy;
         console.log('[+] Browser ALCHEMY Berhasil Dibuka \n');
      }

      app.set('browser', browsers);

      let redisClient = redis.createClient({
         url: 'redis://127.0.0.1:6379',
      });

      redisClient.on('error', (error) => console.error(`Error : ${error}`));

      await redisClient.connect();

      app.set('redis', redisClient);
   })();
}

app.listen(3000, async () => {
   console.log('Server is running on port 3000');
});
