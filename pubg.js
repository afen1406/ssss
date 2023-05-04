const cekPubg = async (browser, id) => {
   if (!id) return { code: 400, message: 'ID Game Tidak Boleh Kosong' };

   // const browser = await chromium.launch({
   //    slowMo: 400,
   //    viewport: {
   //       width: 1280,
   //       height: 720,
   //    },
   // });
   // const page = await browser.newPage();
   try {
      // const context = await browser.newContext();
      // await page.goto('https://www.midasbuy.com/midasbuy/id/buy/pubgm');
      // const cek = await page.getByTitle('UC STATION', { timeout: 10000 }).isVisible();
      // console.log(cek);
      // if (cek) {
      //    await page.getByTitle('UC STATION', { timeout: 10000 }).locator('div').nth(1).click();
      // }
      page = browser.pubg;

      const a = await page.waitForSelector('input[placeholder="Harap masukkan ID Pemain"]', { timeout: 3000 });
      if (a) {
         await page.getByPlaceholder('Harap masukkan ID Pemain').type(id);
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
            return { code: 400, message: 'Silahkan Coba Lagi' };
         }
      }
   } catch (e) {
      console.log(e.message);
      await page.screenshot({ path: `./public/images/${id}.png` });
      await page.reload();
      return { code: 500, message: 'Error Silahkan Coba Lagi' };
   }
};

module.exports = cekPubg;
