# PERSONNEL API

## 21.Ders
```jsx
ARAŞTIR: user-agent
// https://expressjs.com/en/resources/middleware/morgan.html
// https://github.com/expressjs/morgan
// https://nodejs.org/api/fs.html#file-system-flags
Morgan Log tutmaya yarayan bir middleware
$ npm i morgan

// combined
::ffff:127.0.0.1 - - [21/Mar/2024:19:29:46 +0000] "GET /departments/65fb2bd7490cc60244fd6b31/personnels HTTP/1.1" 403 131 "-" "Thunder Client (https://www.thunderclient.com)" 

// common
::ffff:127.0.0.1 - - [21/Mar/2024:19:32:44 +0000] "GET /departments/65fb2bd7490cc60244fd6b31/personnels HTTP/1.1" 403 131

// dev
GET /departments/65fb2bd7490cc60244fd6b31/personnels 403 137.150 ms - 131

// short
:ffff:127.0.0.1 - GET /departments/65fb2bd7490cc60244fd6b31/personnels HTTP/1.1 403 131 - 17.189 ms

// tiny
GET /departments/65fb2bd7490cc60244fd6b31/personnels 403 131 - 193.849 ms

```

```jsx
//* DOCUMENTATION:
// $ npm i swagger-autogen // kodlari tarayip swagger olusturan module //! https://swagger-autogen.github.io/docs/
// $ npm i swagger-ui-express
// $ npm i redoc-express
// npm i swagger-autogen swagger-ui-express redoc-express

swagger modulu olusturma , arayuz olusturma islemleri

// https://swagger-autogen.github.io/docs/endpoints/
```