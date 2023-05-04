const configIdGame = require('../idgame.config');
const dataServerTOF = require('../utils/dataServerTOF');

const cekTOF = async (browser, id, server) => {
   if (configIdGame.midasbuyTOF == false) return { code: 400, message: 'Fitur Cek UserName TOF Tidak Aktif' };
   if (!id) return { code: 400, message: 'ID Game Tidak Boleh Kosong' };

   const findServer = dataServerTOF.filter((item) => item.zoneId == server);

   if (findServer.length < 1) return { code: 404, message: 'Server Tidak Ditemukan' };

   try {
      page = browser.tof;

      const a = await page.waitForSelector('input[placeholder="Select the partition"]', { timeout: 3000 });

      try {
         await page.click('[placeholder="Select the partition"]');
         await page.locator('.li:has-text("' + findServer[0].region + '")').click();
         await page.locator('.li:has-text("' + findServer[0].name + '")').click();
         await page.click('[placeholder="Harap masukkan ID Pemain"]');
         await page.fill('[placeholder="Harap masukkan ID Pemain"]', id);
         await page.getByPlaceholder('Harap masukkan ID Pemain').press('Enter');

         try {
            await page.waitForSelector('.user-head > .name', { timeout: 3000 });
            const nameGame = await page.locator('.user-head > .name').allInnerTexts();
            await page.locator('.user-head > .switch-btn').first().click();
            await page.getByPlaceholder('Harap masukkan ID Pemain').clear();

            return { code: 200, message: 'ID Game Ditemukan', data: nameGame };
         } catch (e) {
            const c = await page.locator('p.show').isVisible();
            if (c) {
               await page.getByPlaceholder('Harap masukkan ID Pemain').clear();
               return { code: 404, message: 'ID Tidak diemukan' };
            }
            await page.getByPlaceholder('Harap masukkan ID Pemain').clear();
            await page.waitForTimeout(1000);
            return { code: 400, message: 'Silahkan Coba Lagi' };
         }
      } catch (e) {
         console.log(e.message);
         await page.screenshot({ path: `./public/images/${id}.png` });
         await page.reload();
         return { code: 500, message: 'Error Silahkan Coba Lagi' };
      }
   } catch (e) {
      console.log(e.message);
      await page.screenshot({ path: `./public/images/${id}.png` });
      await page.reload();
      return { code: 500, message: 'Silahkan coba lagi' };
   }
};

module.exports = cekTOF;
