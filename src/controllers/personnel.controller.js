"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */

const Personnel = require("../models/personnel.model");

module.exports = {
	list: async (req, res) => {
/*
            #swagger.tags = ["Personnels"]
            #swagger.summary = "List Personnels"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

		// const data = await Personnel.find(search).sort(sort).skip(skip).limit(limit)
		const data = await res.getModelList(Personnel, {}, "departmentId");

		res.status(200).send({
			error: false,
			detail: await res.getModelListDetails(Personnel),
			data, // data: data
		});
	},

	create: async (req, res) => {

		/*
            #swagger.tags = ["Personnels"]
            #swagger.summary = "Create Personnel"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    username: "test",
                    password: "1234",
                    firstName: "firstName",
                    lastName: "lastName",
                    phone: "123456789",
                    email: "test@site.com",
                    title: "title",
                    salary: 2500,
                    description: "description",
                    isActive: true,
                    isAdmin: false,
                    isLead: false,
                    startedAt: "2023-10-15 13:14:15"
                }
            }
        */
		// isLead Control
		const isLead = req.body.isLead || false;
		if (isLead) {
			/// Eger isLead true ise, ayni departmandaki diger personellerin isLead'ini false yapar.
			await Personnel.updateMany(
				{ departmentId: req.body.departmentId, isLead: true },
				{ isLead: false }
			);
		}

		const data = await Personnel.create(req.body);

		res.status(201).send({
			error: false,
			data,
		});
	},

	read: async (req, res) => {
		/*
            #swagger.tags = ["Personnels"]
            #swagger.summary = "Get Single Personnel"
        */
		const data = await Personnel.findOne({ _id: req.params.id });

		res.status(200).send({
			error: false,
			data,
		});
	},

	update: async (req, res) => {
		/*
            #swagger.tags = ["Personnels"]
            #swagger.summary = "Update Personnel"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    username: "updatedUsername",
                    password: "4321",
                    firstName: "Dohn",
                    lastName: "Joe",
                    phone: "987654321",
                    email: "jdoetest@site.com",
                    title: "title1",
                    salary: 5000,
                    description: "updatedDescription",
                    isActive: true,
                    isAdmin: true,
                    isLead: true,
                }
            }
        */
		// isLead Control:
		const isLead = req.body?.isLead || false;

		// burada isLead guncellemesi yapilir.
		if (isLead) {
			const { departmentId } = await Personnel.findOne(
				{ _id: req.params.id },
				{ departmentId: 1 }
			);
			await Personnel.updateMany(
				{ departmentId, isLead: true },
				{ isLead: false }
			);
		}
		//\ db.coll.find({/* all */ }, { _id: 0, firstName: 1, lastName: 1 }) // Burada 1 acik, 0 kapali tutmak icin.
		//\  Bu parametre, MongoDB sorgusunun projeksiyon kısmını belirtir. Pr{ departmentId: 1 } ifadesi, sadece departmentId alanının dönmesini sağlar. Diğer tüm alanlar varsayılan olarak dönmez.

		//\ Yani, findOne işlemi sonucunda sadece departmentId alanı içeren belge döner. Bu, genellikle sorgu sonucundan sadece belirli bir alanı almak istediğinizde kullanılır. Bu durumda, sadece personelin departman kimliğini almak istenmiş olabilir, diğer alanlar gerekli değilse.

		//! ONEMLI !
		if(!req.user.isAdmin){  // isAdminOrOwn olanlardan , kullanici kendini admin yapmasin, maasini arttirmasin vb vb ozelliklelr burada tanitilir.
			req.body.isAdmin = false
			delete req.body.salary
			delete req.body.isLead 
			// others
		}

		const oldData = await Personnel.findOne({ _id: req.params.id }); // bunu ben opsiyonel yaziyorum kullanici eski veriyide gorsun diye
		const data = await Personnel.updateOne(
			{ _id: req.params.id },
			req.body,
			{
				runValidators: true,
			}
		);

		res.status(202).send({
			error: false,
			data,
			compare:{ // data normalde gitmesi gereken yer ama projede new == data olacagi icin iki ayni veriyi madem gorecegiz eski veriyide yollayip compare objesinde gondermeyi mantikli buluyorum. Tabi standardi nedir bilmiyorum tamamen deneysel bu !!!
				old: oldData, // bunu ben opsiyonel yaziyorum kullanici eski veriyide gorsun diye
				new: await Personnel.findOne({ _id: req.params.id }),
			}
		});
	},

	delete: async (req, res) => {

		/*
            #swagger.tags = ["Personnels"]
            #swagger.summary = "Delete Personnel"
        */
		const data = await Personnel.deleteOne({ _id: req.params.id });

		// const isDeleted = data.deletedCount >= 1 ? true : false;
		// res.status(isDeleted ? 204 : 404).send({
		//   error: !isDeleted,
		//   data,
		// });

		res.status(data.deletedCount ? 204 : 404).send({
			error: !data.deletedCount,
			data,
		});
	},
};
