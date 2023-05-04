const { dataGame } = require('../utils/listGame/dataGame');
const crypto = require('crypto');
const midasbuyHelper = require('../helper/midasbuyHelper');
const configIdGame = require('../idgame.config');
const fetch = require('node-fetch');

const cekIdGameController = async (req, res) => {
   const slug = req.params.slug;
   const { id, zone } = req.query;

   const game = dataGame.find((item) => item.slug == slug);
   if (!game) return res.status(404).json({ status: false, message: 'Game not found' });
   if (!id) return res.status(400).json({ status: false, message: 'ID is required' });
   if (game.isZone && !zone) return res.status(400).json({ status: false, message: 'Zone is required' });

   if (configIdGame[game.provider] !== true) return res.status(400).json({ status: false, message: 'Game not found' });

   if (game.provider == 'duniagames') {
      let payload = {
         productId: game.id,
         itemId: game.itemId,
         catalogId: game.catalogId,
         paymentId: game.paymentChannel,
         gameId: id,
         zoneId: zone || null,
         product_ref: game.product_ref,
         product_ref_denom: game.product_ref_denom,
      };

      const getUsernameGame = await fetch('https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
         },

         body: JSON.stringify(payload),
      });

      try {
         const data = await getUsernameGame.json();
         if (data.status.code == 0)
            return res.status(200).json({
               status: true,
               message: 'ID berhasil ditemukan',
               data: {
                  username: data.data?.gameDetail?.userName,
                  user_id: id,
                  zone: zone || null,
               },
            });
      } catch (err) {
         return res.status(500).json({ status: false, message: 'Internal Server Error' });
      }
   } else if (game.provider == 'codashop') {
      let dataBody;
      switch (game.slug) {
         case 'higgs-domino':
            dataBody = `voucherPricePoint.id=27605&voucherPricePoint.price=15000.0&voucherPricePoint.variablePrice=0&n=2%2F21%2F2023-2116&email=okebagsu426%40gmail.com&userVariablePrice=0&order.data.profile=eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ%3D%3D&user.userId=${id}&user.zoneId=&msisdn=&voucherTypeName=HIGGS&voucherTypeId=49&gvtId=60&shopLang=id_ID&checkoutId=fdc7bd2e-d86a-4ec5-ac68-e2dbfbb2a02c&affiliateTrackingId=&impactClickId=3NhRLCwl%3AxyNRNtT6ryOjXyTUkAyLjRfFSnCU80&anonymousId=7eb09d46-b08e-46c1-bc83-c127489d4d6c&fullUrl=https%3A%2F%2Fwww.codashop.com%2Fid-id%2Fhiggs-domino&userSessionId=b2tlYmFnc3U0MjZAZ21haWwuY29t&userEmailConsent=false&userMobileConsent=false&verifiedMsisdn=&promoId=&promoCode=&clevertapId=49bec2319150449bb397c95acb9aaa02`;
            break;
         case 'hago':
            dataBody = `voucherPricePoint.id=16107&voucherPricePoint.price=30294.0&voucherPricePoint.variablePrice=0&n=2%2F21%2F2023-2027&email=okebagsu426%40gmail.com&userVariablePrice=0&order.data.profile=eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ%3D%3D&user.userId=${id}&user.zoneId=&msisdn=&voucherTypeName=HAGO&voucherTypeId=33&gvtId=43&shopLang=id_ID&checkoutId=bea3ecd6-4cdc-4b91-be56-a28fc0b4ffb6&affiliateTrackingId=&impactClickId=3NhRLCwl%3AxyNRNtT6ryOjXyTUkAyLjRfFSnCU80&anonymousId=7eb09d46-b08e-46c1-bc83-c127489d4d6c&fullUrl=https%3A%2F%2Fwww.codashop.com%2Fid-id%2Fhago&userSessionId=b2tlYmFnc3U0MjZAZ21haWwuY29t&userEmailConsent=false&userMobileConsent=false&verifiedMsisdn=&promoId=&promoCode=&clevertapId=49bec2319150449bb397c95acb9aaa02`;
            break;
         default:
            dataBody = `voucherPricePoint.id=${game.priceId}&voucherPricePoint.price=${
               game.price
            }&voucherPricePoint.variablePrice=0&n=&email=okebagsu426@gmail.com&userVariablePrice=0&order.data.profile=eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ%3D%3D&user.userId=${id}&user.zoneId=${zone}&msisdn=&voucherTypeName=${
               game.voucherTypeName
            }&voucherTypeId=${game.voucherTypeId}&gvtId=${
               game.gvtId
            }&shopLang=id_ID&checkoutId=${crypto.randomUUID()}&affiliateTrackingId=&impactClickId=3NhRLCwl:xyNRNtT6ryOjXyTUkAyLjRfFSnCU80&anonymousId=${crypto.randomUUID()}&fullUrl=${
               'https://www.codashop.com/id-id/' + game.slug
            }&userSessionId=${crypto.randomUUID()}&userEmailConsent=false&userMobileConsent=false&verifiedMsisdn=&promoId=&promoCode=&clevertapId=49bec2319150449bb397c95acb9aaa02`;
            break;
      }

      const getUsernameGame = await fetch('https://order-sg.codashop.com/initPayment.action', {
         method: 'POST',
         headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'user-agent':
               'Mozilla/5.0 Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            'x-session-country2name': 'ID',
            'x-session-key': '',
            'x-xsrf-token': null,
         },
         body: dataBody,
      });

      try {
         const getUsernameGameResponse = await getUsernameGame.json();
         if (getUsernameGameResponse.RESULT_CODE && getUsernameGameResponse.RESULT_CODE == 10001)
            return res.status(400).json({ status: false, message: 'Silahkan Coba 5 detik lagi' });
         if (getUsernameGameResponse.success) {
            if (getUsernameGameResponse.result == '')
               return res.status(404).json({ status: false, message: 'ID tidak ditemukan' });
            const result = decodeURIComponent(getUsernameGameResponse.result) || {};
            const newResult = JSON.parse(result) || {};

            return res.status(200).json({
               status: true,
               message: 'ID berhasil ditemukan',
               data: {
                  username: newResult?.username || newResult?.roles[0]?.role || null,
                  user_id: id,
                  zone: zone || null,
               },
            });
         }

         // return res.status(200).json({ data: decodeURI(getUsernameGameResponse.result) });
      } catch (err) {
         console.log(err);
         return res.status(500).json({ status: false, message: 'Internal Server Error' });
      }
   } else if (game.provider == 'midasbuy') {
      const browser = req.app.get('browser');
      const redis = req.app.get('redis');

      try {
         const cekMidas = await midasbuyHelper(browser, redis, slug, id, zone);
         if (cekMidas.code == 200) {
            return res.status(200).json({
               status: true,
               message: 'ID berhasil ditemukan',
               data: {
                  username: cekMidas.data[0],
                  user_id: id,
                  zone: zone || null,
               },
            });
         } else {
            return res.status(cekMidas.code).json({ status: false, message: cekMidas.message });
         }
      } catch (err) {
         console.log(err);
         return res.status(500).json({ status: false, message: 'Internal Server Error' });
      }
   } else if (game.provider == 'au2mobile') {
      const cekAu = await fetch(`http://dancingidol.uniuhk.com/api/role/info?roleId=${id}`);
      try {
         const cekAuResponse = await cekAu.json();
         // console.log(cekAuResponse);
         if (cekAuResponse.code == 0) {
            return res.status(200).json({
               status: true,
               message: 'ID berhasil ditemukan',
               data: {
                  username: cekAuResponse.data?.rolename,
                  user_id: id,
                  zone: zone || null,
               },
            });
         } else {
            return res.status(404).json({ status: false, message: 'ID tidak ditemukan' });
         }
      } catch (err) {
         console.log(err);
         return res.status(500).json({ status: false, message: 'Internal Server Error' });
      }
   }

   return res.status(404).json({ status: false, message: 'ID tidak ditemukan' });
};

module.exports = { cekIdGameController };
