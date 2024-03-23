"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */

//!  login logout ayrı klasörde olur onları da ayıralım

const Personnel = require("../models/personnel.model");
const Token = require("../models/token.model");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
	// LOGIN & LOGOUT

	login: async (req, res) => {
		const { username, password } = req.body;

		/**
		 *~  #swagger.tags = ['Authentication']
		 *~  #swagger.summary = 'Login'
		 *~  #swagger.description = 'Login with username and password'
		 *~  #swagger.parameters['body'] = {
			in: 'body',
			required: 'true',
			schema: {
				username: 'testF0',
				password:'1234'
			}
		}
		 */

		if (username && password) {
			// Burada findOne ile filtreleme yaptigimizda personnel modeldeki set: (password) => passwordEncrypt(password), metodu tekrar çalışır.O yüzden sessiona gönderirken şifreleme yapmadık.
			const user = await Personnel.findOne({ username, password });
			if (user && user.isActive) {
				/* ======================= SESSION ====================== *
            Set Session:
			olustur ve gonder
            req.session = {
            id: user._id,
            password: user.password,
            };
             // Set Cookie:
            if (req.body?.rememberMe) {
            req.sessionOptions.maxAge = 1000 * 60 * 60 * 24 * 3; // 3 Days
            }

            kullanıcın verilerini bir sesiona değil bir tokena havale etmemiz lazım bunu nasıl yapacağız?
            bir modele ihtiyaç var. personel modele

            /* ======================= SESSION ====================== */

				/* ======================== TOKEN ======================= */
				// token daha önce oluşturulmuş mu bunu kontrol etmemiz lazım. Öncelikle daha önceden böyle bir token oluşturulmuş mu database de, eger olusturulmamıssa oluştur. Bu user var mı yokmu gibi eğer aynı tokendan varsa databasede yer kaplamasını engellemek için token kontrolü sağlanır.

				let tokenData = await Token.findOne({ userId: user._id });

				// eğer token yoksa oluştur - key yap onu al. burada benzersiz bir şey koymamız lazım.
				if (!tokenData) {
					// burdaki veriyi de şifreledik ki daha güvenli
					const tokenKey = passwordEncrypt(user._id + Date.now()); // benzersiz bir token adresi tanımladık.
					// buradaki veri zaten string oldugu icin ekstra bir donusum yapmadik.
					//   tokenı oluşturduk artık bunu frontEnde gönderebiliriz.
					// console.log(typeof tokenKey, tokenKey);
					//   await create kisminda ise normalde req.body objesi giderken kendimiz modeldeki verileri verdik ona gore token data kurduk

					tokenData = await Token.create({userId: user._id,token: tokenKey});
				}
				/* ======================== TOKEN ======================= */

				res.status(200).send({
					error: false,
					token: tokenData.token,
					user,
				});
			} else {
				res.errorStatusCode = 401;
				throw new Error("Wrong Username or Password.");
			}
		} else {
			res.errorStatusCode = 401;
			throw new Error("Please entry username and password.");
		}
	},

	logout: async (req, res) => {

        /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'Logout'
            #swagger.description = 'Delete Token'
        */

		// logout isleminde de tokeni silmeliyiz

		/*  SESSION  */
		// Set session to null:
		req.session = null;
		/*  SESSION  */

		/*  TOKEN  */
		//* 1. Yontem (Kısa Yöntem) : Logout olabilmesi için önce login olup tokenı alıp çıkarkende ona göre tanıma yapılmalı.
		//? Her Kullanıcı için sadece 1 adet token var ise (tum cihazlardan çıkış yap):
		// console.log(req.user)
		//  const deleted = await Token.deleteOne({userId: req.user._id})

		//* 2. Yontem: Logout olabilmesi için önce login olup tokenı alıp çıkarkende ona göre tanıma yapılmalı.
		//? Her Kullanıcı için sadece birden fazla token var ise (çoklu cihaz): => ilgili cihazdan cikis yap
		const auth = req.headers?.authorization || null;
		const tokenKey = auth ? auth.split(" ") : null;

		let deleted = null;
		if (tokenKey && tokenKey[0] == "Token") {
			deleted = await Token.deleteOne({ token: tokenKey[1] });
		}
		/*  TOKEN  */

		res.status(200).send({
			error: false,
			message: "Logout: Token Deleted.",
			deleted, // opsionel
		});
	},
};
