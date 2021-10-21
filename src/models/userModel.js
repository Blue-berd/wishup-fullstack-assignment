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
        plan_Id:String,
        start_date:Date,
        valid_till:String
    }]
 }
) 

module.exports = mongoose.model("User",userSchema)