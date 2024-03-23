"use strict";
//* ====================================================== */
//*                 EXPRESS - Token Model                  */
//* ====================================================== */
const { mongoose } = require("../configs/dbConnection");
/* ====================================================== */
/* 
 // data example
{
    "userId": "65343222b67e9681f937f001",
    "token": "...tokenKey..."
}
*/
/* ====================================================== */
// Token Model:
const TokenSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Personnel', // 'User'
        required:true,
        index:true,  // Performansi arttirmak icin, SQL veritabanlarinda çok çok önemli
    },

    token:{
        type:String,
        trim:true,
        required:true,
        index:true,
        unique:true,
    },
},{collection:"tokens",timestamps:true})

//* ====================================================== */
module.exports = mongoose.model("Token", TokenSchema);
