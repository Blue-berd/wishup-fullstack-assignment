const mongoose = require('mongoose')
const subscriptionModel = require('./subscriptionModel')

// const plans = async function (){
//     let planList = await subscriptionModel.find({},{plan_Id:1})
//     let allPlans = planList.map(item => item.plan_Id)

//     return allPlans
// }

const userSchema = new mongoose.Schema({   
    username : {type:String, required:'Please provide username', trim:true, unique:true},
    created_at:{type:Date},
    subscriptions: [{
        start_date:Date,
        plan_Id:String,
        valid_till:Date
    }]
 }
) 
// userSchema.subscriptions.log.createIndex({ "valid_till": 1 }, {"expireAfterSeconds": 0})

module.exports = mongoose.model("User",userSchema)