const { isValidObjectId } = require('mongoose')
const {userModel, subscriptionModel} = require('../models')

const {validator} = require('../utils')
const { isValidRequestBody } = require('../utils/validator')
const dateandtime = require('date-and-time');

const createNewPlan = async function(req, res){
    try{
        const requestedBody = req.body
        const {plan_Id, validity, cost}= requestedBody

        if( !validator.isValidString(plan_Id)){
            res.status(400).send({status:'FAILURE', msg:"please send valid plan_id"})
            return
        }

        if( !validator.isValidString(validity)){
            res.status(400).send({status:'FAILURE', msg:"please send valid validity"})
            return
        }

        if( !validator.isValidNumber(cost)){
            res.status(400).send({status:'FAILURE', msg:"please send valid cost"})
            return
        }

        let newPlan = await subscriptionModel.create(requestedBody)

        return res.status(200).send({status:'SUCCESS'})

    }
    catch(error){
        res.status(500).send({status:"FAILURE", msg:error.message})
    }
}



const subscribe = async function(req, res){
    try{
        const requestedBody = req.body
        if( !isValidRequestBody(requestedBody)){
            return res.status(400).send({status:'FAILURE', msg:'Please provide valid body'})
        }

        let {username, plan_Id, start_date}= requestedBody
        if( !validator.isValidString(username)){
            res.status(400).send({status:'FAILURE', msg:"please provide valid username"})
            return
        } 

        if( !validator.isValidString(plan_Id)){
            res.status(400).send({status:'FAILURE', msg:"please provide valid plan_id"})
            return
        }   

        if( !validator.isValidString(start_date)){
            res.status(400).send({status:'FAILURE', msg:"please provide start_date in format YYYY/MM/DD"})
            return
        }

        start_date = new Date(start_date)
        if( !validator.isValidDate(start_date)){
            res.status(400).send({status:'FAILURE', msg:"please provide valid start_date in format YYYY/MM/DD"})
            return
        }
        

        const year = start_date.getUTCFullYear()
        const month = start_date.getUTCMonth()
        const day = start_date.getUTCDate()
        // const hour = start_date.getUTCHours()
        // const minute = start_date.getUTCMinutes()
        // const seconds = start_date.getUTCSeconds()  
        start_date =  `${year}-${month}-${day}`
     
        
        const plan = await subscriptionModel.findOne({plan_id:plan_Id})

        if(plan.validity != 'Infinite'){
            var valid_till = start_date.setDate(start_date.getDate() + (+plan.validity))        
            const year = valid_till.getUTCFullYear()
            const month = valid_till.getUTCMonth()
            const day = valid_till.getUTCDate()
            // const hour = valid_till.getUTCHours()
            // const minute = valid_till.getUTCMinutes()
            // const seconds = valid_till.getUTCSeconds()  
            valid_till =  `${year}-${month}-${day}`
        }else{
            var valid_till = "Infinity"
        }
        
        const subscriptionObject = {plan_Id, start_date:start_date, valid_till:valid_till}
        
        // const subscription = await userModel.findOneAndUpdate({username:username},{$addToSet:{subscriptions:subscriptionObject }} ) 
        
        let cost = `${plan.cost}`
        
        if(plan.cost==0){
            cost = 0
        }

        return res.status(201).send({status:'SUCCESS', "amount":subscriptionObject})

    }
    catch(error){
        res.status(500).send({status:"FAILURE", msg:error.message})
    }
}

const getSubscription = async function(req, res){
    try{
        const params= req.params
        
        if( params == null || params.length == 0){
            return res.status(400).send({status:'FAILURE', msg:'Please provide valid username and/or date'})
        }
        const {username, date} = params

        const user = await userModel.findOne({username:username})
        const valid_till = user.subscription.valid_till

        const now = new Date();

        let dateToday = dateandtime.format(now, 'YYYY/MM/DD')
        if(+dateToday >= valid_till){
            return res.status(404).send({status:'SUCCESS', msg:'No active plans found. Please renew your subscription'})
        }
        if(!date){
        return res.status(200).send({status:'SUCCESS', data:user.subscription})
        }

        let days_left = dateandtime.subtract(valid_till, date).toDays();

        return res.status(200).send({status:'SUCCESS',data:{plan_Id:user.subscription.plan_Id, days_left:days_left} })

    }
    catch(error){
        res.status(500).send({status:'FAILURE', msg:error.message})
    }
}




module.exports ={
    getSubscription,
    subscribe,
    createNewPlan
}