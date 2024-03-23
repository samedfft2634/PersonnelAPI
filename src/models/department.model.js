"use strict"
/* ====================================================== */
/*                 EXPRESS - Department Model             */
/* ====================================================== */
const {mongoose} = require('../configs/dbConnection')

const DepartmentSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    }
},{collection:"departments",timestamps:true})
// collection: db name, collection ismi kucuk oluyor genelde !

module.exports = mongoose.model("Department", DepartmentSchema);