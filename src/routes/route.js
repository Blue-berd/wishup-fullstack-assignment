const express = require('express')

const router = express.Router()

const {userController, subscriptionController} = require('../controllers')

// user

router.post('/user', userController.createUser)
router.get('/user/:username',userController.getUser)

// subscription
router.post('/plan', subscriptionController.createNewPlan)
router.post('/subscription', subscriptionController.subscribe)
router.get('/subscription/:username/:date?',subscriptionController.getSubscription)

module.exports = router;