"use strict";
/* ====================================================== */
/*              Middlewares - Authentication              */
/* ====================================================== */
// app.use(authentication);
//! Bu islem index.js te router islemlerinde once geliyor. Yani login isleminde token gonderilmezse user bilgileri gelmez sistem bu useri tanimaz
const Token = require("../models/token.model");

module.exports = async (req, res, next) => {
	// model islemi olacagi icin asenkron bir middleware
	// Piyasa ornekleri
	// Authorization: Token ...
	// Authorization: ApiKey ...
	// Authorization: X-API-KEY ...
	// Authorization: x-auth-token ...
	// Authorization: Bearer ...

	const auth = req.headers?.authorization || null;  // Token ...tokenKey...
	// const tokenKey = auth ? auth.split(" ")[1] : null;
	const tokenKey = auth ? auth.split(" ") : null; // ['Token','...tokenKey...']

    // tokenkey var mi ve 0.indexteki veri "Token" mi?
    if(tokenKey && tokenKey[0] == "Token"){
        const tokenData = await Token.findOne({token:tokenKey[1]}).populate('userId') // userId populate yaparak personel verisini getiriyoruz.
        // personnel modeli cagirmadan personnel verilerini getirmis olduk.
        // console.log(tokenData) userId ye gore populate yapildigi icin userId objesi user bilgilerinin hepsini iceriyor.
        if(tokenData) req.user = tokenData.userId 
        // tokenData varsa req.user adinda bir degisken olustur
        // Personnel Data ?? burayi tam anlamadim neden usera tokenData daki userId ataniyor
    }

	next();
};

/* =============== console.log(tokenData) =============== *
{
    _id: new ObjectId("65fb3f839a0495780677aef5"), // burasi bu user icin tanimlanmis token id
    userId: {
      _id: new ObjectId("65fb2bd7490cc60244fd6b37"),
      departmentId: new ObjectId("65fb2bd7490cc60244fd6b31"),
      username: 'testF0',
      password: 'fc44f8c54f1dd87f3a8e8c9ff4ab2bd7c36cb975cf30f32f3238ab52fdfc6c11',
      firstName: 'firstName',
      lastName: 'lastName',
      phone: '123456789',
      email: 'testF0@site.com',
      title: 'title',
      salary: 2500,
      description: 'description',
      isActive: true,
      isAdmin: false,
      isLead: false,
      startedAt: 2023-10-15T10:14:15.000Z,
      createdAt: 2024-03-20T18:32:55.600Z,
      updatedAt: 2024-03-20T18:32:55.600Z,
      __v: 0
    },
    token: '65fb2bd7490cc60244fd6b371710964611871',
    createdAt: 2024-03-20T19:56:51.898Z,
    updatedAt: 2024-03-20T19:56:51.898Z,
    __v: 0
  }
/* =============== console.log(tokenData) =============== */