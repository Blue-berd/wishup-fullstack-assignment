const mongoose = require("mongoose")
const {userModel} = require('../models')

const {validator} = require('../utils')
const date = require('date-and-time');

const createUser = async function(req, res){
    try{ 
        const username = req.body.username

        if( !(validator.isValidString(username)) ){
            res.status(400).send({status:'FAILURE', msg:"please send valid username"})
            return
        }

        const userAlreadyExist = await userModel.find({username:username})

        if(userAlreadyExist.length >0){
            res.status(400).send({status:'FAILURE', msg:"username already exist. please choose another username"})
            return
        }

        let now = new Date()
        now = date.format(now, 'YYYY/MM/DD HH:mm:ss'); 


        let userObject = {username:username, created_at:now}
        await userModel.create(userObject)
        
        return res.status(200).send({status:'SUCCESS'})
        
    }
    catch(error){
        res.status(500).send({status:"FAILURE", msg:error.message})
    }
}


const getUser = async function(req, res){
    try{
        const username = req.params.username
        if( !(validator.isValidString(username)) ){
            res.status(400).send({status:'FAILURE', msg:"please send username"})
            return
        }

        let userDetails = await userModel.findOne({username:username},{username:1, created_at:1, })

        if( userDetails.length === 0 ){
            return res.status(404).send({status:'FAILURE', msg:"Username not found or not registered"})
        }

        let date = userDetails.created_at
        const year = date.getUTCFullYear()
        const month = date.getUTCMonth()
        const day = date.getUTCDate()
        const hour = date.getUTCHours()
        const minute = date.getUTCMinutes()
        const seconds = date.getUTCSeconds() 

        const created_at_time =  `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
    
        const userObject = {username:userDetails.username, created_at:created_at_time}
        return res.status(200).send({status:'SUCCESS', data:userObject})
    }
    catch(error){
        res.status(500).send({status:'FAILURE', msg:error.message})
    }
}


module.exports ={
    createUser,
    getUser
}