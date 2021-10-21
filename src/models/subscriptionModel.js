const mongoose = require('mongoose')


const subscriptionSchema = new mongoose.Schema({
    plan_Id:{type:String, trim:true,required:true},
    validity:{type:String,trim:true, required:true},
    cost:{type:Number, required:true}
})


module.exports = mongoose.model("Subscription",subscriptionSchema)