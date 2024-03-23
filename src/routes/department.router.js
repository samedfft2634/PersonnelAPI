"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */
const department = require("../controllers/department.controller");
const {
	isLogin,
	isAdmin,
	isAdminOrLead,
} = require("../middlewares/permissions");

// URL: /departments
router
	.route("/")
	.get(isLogin, department.list) // aktif ve login olan herkes departmanlari goruntuleyebilir (test icin authorization kaldirilip istek atilir)
	.post(isAdmin, department.create); // Yalnızca adminler departman oluşturabilir. Adminin login olması lazım.

router
	.route("/:id")
	.get(isLogin,department.read)
	.put(isAdmin,department.update)
	.patch(isAdmin,department.update)
	.delete(isAdmin,department.delete);

router.get("/:id/personnels",isAdminOrLead, department.personnels);
/* ------------------------------------------------------- */
module.exports = router;
