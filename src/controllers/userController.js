const mongoose = require("mongoose")
const {userModel} = require('../models')
const {validator, helper} = require('../utils')

const createUser = async function(req, res){
    try{ 
        const username = req.body.username

        // validate username for string
        if( !(validator.isValidString(username)) ){
            res.status(400).send({status:'FAILURE', msg:"please send valid username"})
            return
        }

        // check if username already present
        const userAlreadyExist = await userModel.find({username:username})

        // send error if username is already taken
        if(userAlreadyExist.length >0){
            res.status(400).send({status:'FAILURE', msg:"username already taken. please choose another username"})
            return
        }

        // add craeted at date
        const now = new Date()
        const userObject = {username:username, created_at:now}
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

        // validate username for string

        if( !(validator.isValidString(username)) ){
            res.status(400).send({status:'FAILURE', msg:"please send username"})
            return
        }
        
        let userDetails = await userModel.findOne({username:username},{username:1, created_at:1, })

        // check if userDetails are found for username . If not found throw error
        if( userDetails.length === 0 ){
            return res.status(404).send({status:'FAILURE', msg:"Username not found or not registered"})
        }

        // change date format to yyyy-mm-dd hh-mm-ss
        let date = userDetails.created_at
        date = helper.formatDate(date, "YY-MM-DD HH:MM:SS")

        const userObject = {username:userDetails.username, created_at:date}
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