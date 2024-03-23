"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const personnel = require("../controllers/personnel.controller");
const {
	isLeadOrOwnForPersonnelSearch,
	isAdmin,
	isAdminOrOwn,
} = require("../middlewares/permissions");

// URL: /personnels

// Login/logout: (moved into auth.js)
// router.post('/login', personnel.login)
// router.all('/logout', personnel.logout)

router.route("/").get(isAdmin, personnel.list).post(isAdmin, personnel.create);

router
	.route("/:id")
	// .get(isAdminOrOwn, personnel.read)
	.get(isLeadOrOwnForPersonnelSearch, personnel.read)
	.put(isAdminOrOwn, personnel.update)
	.patch(isAdminOrOwn, personnel.update)
	.delete(isAdmin, personnel.delete);

/* ------------------------------------------------------- */
module.exports = router;
