"use strict";

const Personnel = require("../models/personnel.model");

/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Middleware: permissions (authorization)

module.exports = {
	isLogin: (req, res, next) => {
		if (req.user && req.user.isActive) {
			// login olduktan sonra pasif olduysa diye burada da kontrol edelim.
			next();
		} else {
			res.errorStatusCode = 403;
			throw new Error("NoPermission: You must login.");
		}
	},

	isAdmin: (req, res, next) => {
		// Admin butun departmanlari gorebilir.
		if (req.user && req.user.isActive && req.user.isAdmin) {
			next();
		} else {
			res.errorStatusCode = 403;
			throw new Error("NoPermission: You must login and to be Admin.");
		}
	},

	isAdminOrLead: (req, res, next) => {
		// Leadler sadece kendi departmanlarini gorebilir.

		const departmentId = req.params?.id;
		if (
			req.user &&
			req.user.isActive &&
			(req.user.isAdmin ||
				(req.user.isLead && req.user.departmentId == departmentId))
		) {
			next();
		} else {
			res.errorStatusCode = 403;
			throw new Error(
				"NoPermission: You must login and to be Admin or Department Lead."
			);
		}
	},

	isAdminOrOwn: (req, res, next) => {
		const personnelId = req.params?.id;
		if (
			req.user &&
			req.user.isActive &&
			(req.user.isAdmin || // Admin mi? veya Kendi verisini mi kontrol ediyor? Bir user baska bir userin verilerinde silme veya guncelleme yapamamali !!
				req.user._id == personnelId)
		) {
			next();
		} else {
			res.errorStatusCode = 403;
			throw new Error(
				"NoPermission: You must login and to be Admin or Owner."
			);
		}
	},

    // Hehangi bir departmandaki lead, o departmandaki belirli birisini nesnelesin
	isLeadOrOwnForPersonnelSearch: async (req, res, next) => {
        // console.log(req.user)
		const userId = req.user._id;
        // console.log(userId)
		const departmentId = req.user.departmentId.toString()
        // console.log(departmentId)

		const searchedPersonnel = await Personnel.findOne({_id: req.params.id});
        // console.log(req.user.isLead) //  ture
		const isDepartmentLead = req.user.isLead && (departmentId == searchedPersonnel.departmentId.toString());
        
		const isOwn = userId == req.params.id;

		// console.log(searchedPersonnel, isDepartmentLead, isOwn);

		if ((req.user && req.user.isAdmin || isDepartmentLead ) || isOwn) {
			next();
		} else {
			res.errorStatusCode = 403;
			throw new Error("NoPermission: You must login and to be Admin or Lead on your own Department.");
		}
	},
};
