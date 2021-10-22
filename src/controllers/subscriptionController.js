const { userModel, subscriptionModel } = require("../models");
const { validator, helper } = require("../utils");

// Create API for adding new plans. admin access only
const createNewPlan = async function (req, res) {
  try {
    const requestedBody = req.body;
    const { plan_Id, validity, cost } = requestedBody;

    // check plan_id for valid string
    if (!validator.isValidString(plan_Id)) {
      res
        .status(400)
        .send({ status: "FAILURE", msg: "please send valid plan_id" });
      return;
    }

    // check validity for valid string
    if (!validator.isValidString(validity)) {
      res
        .status(400)
        .send({ status: "FAILURE", msg: "please send valid validity" });
      return;
    }

    // check cost for valid number
    if (!validator.isValidNumber(cost)) {
      res
        .status(400)
        .send({ status: "FAILURE", msg: "please send valid cost" });
      return;
    }

    let newPlan = await subscriptionModel.create(requestedBody);

    return res.status(200).send({ status: "SUCCESS" });
  } catch (error) {
    res.status(500).send({ status: "FAILURE", msg: error.message });
  }
};

// Api for subscribing new plan
const subscribe = async function (req, res) {
  try {
    const requestedBody = req.body;

    // check req.body for validity incase its empty
    if (!validator.isValidRequestBody(requestedBody)) {
      return res
        .status(400)
        .send({ status: "FAILURE", msg: "Please provide valid body" });
    }

    // destructuring on requestbody
    let { username, plan_Id, start_date } = requestedBody;
    
    // check if username is present
    if (!validator.isValidString(username)) {
      res
        .status(400)
        .send({ status: "FAILURE", msg: "please provide valid username" });
      return;
    }

    // check if username is registered
    const user = await userModel.findOne({ username: username });

    if (user == null) {
      return res
        .status(404)
        .send({ status: "FAILURE", msg: "user not registered" });
    }

    //check if plan_id is present
    if (!validator.isValidString(plan_Id)) {
      res
        .status(400)
        .send({ status: "FAILURE", msg: "please provide valid plan_id" });
      return;
    }

    //check if plan_id is valid
    const valid_plan = await subscriptionModel.findOne({ plan_Id: plan_Id });

    if (!valid_plan) {
      res
        .status(404)
        .send({
          status: "FAILURE",
          msg: `plan ${plan_Id} not found.please provide valid plan_id`,
        });
      return;
    }

    //check if start_date is present
    if (!validator.isValidString(start_date)) {
      res
        .status(400)
        .send({
          status: "FAILURE",
          msg: "please provide start_date in format YYYY/MM/DD",
        });
      return;
    }

    start_date = new Date(start_date);

    //check if start_date is valid and is greater than or equal to present date
    if (!validator.isValidDate(start_date)) {
      res
        .status(400)
        .send({
          status: "FAILURE",
          msg: "please provide valid start_date in format YYYY/MM/DD",
        });
      return;
    }
    
    // check if plan validity is not infinite 
    if (valid_plan.validity != "Infinite") {
      const total = helper.addDaysToDate(start_date, +plan.validity);
      var valid_till = new Date(total);
      valid_till = helper.formatDate(valid_till,'YY-MM-DD');
    }

    // check if plan validity is infinite
    if (plan.validity == "Infinite") {
      var valid_till = "Infinity";
    }

    //find user
    const userInfo = await userModel.findOne({ username: username });

    // check if user already has active plans from all plans
    let existingPlan = userInfo.subscriptions;
    const activePlan = []
    const pass = 'pass'
    
    // if valid_till is still valid push entire plan item into active plan
    existingPlan.forEach(  item => validator.isValidDate(item.valid_till)?activePlan.push({item}):pass )

     if (activePlan.find((item) => item.plan_Id == plan_Id)) {
      return res
        .status(201)
        .send({
          status: "FAILURE",
          msg: `you already have ${plan_Id} active subscription.`,
        });
    }

    // creating object to put into create document query
    const subscriptionObject = {
      plan_Id,
      start_date: start_date,
      valid_till: valid_till,
    };

    // creting document
    const subscription = await userModel.findOneAndUpdate(
      { username: username },
      { $addToSet: { subscriptions: subscriptionObject } },
      { new: true }
    );

    // amount 
    let cost = plan.cost;

    if (plan.cost == 0) {
      cost = 0;
    }

    // check if subscription is not added. tell money is credited
    if (subscription == null) {
      return res
        .status(404)
        .send({
          status: "FAILURE",
          msg: "Subscription Failed. Your money will be sent back",
          amount: `+${cost}`
        });
    }

    // Success. money amount is debited
    return res.status(201).send({ status: "SUCCESS", amount: `-${cost}` });

  } catch (error) {
    res.status(500).send({ status: "FAILURE", msg: error.message });
  }
};

const getSubscription = async function (req, res) {
  try {
    const params = req.params;
    // check if params are right
    if (params == null || params.length == 0) {
      return res
        .status(400)
        .send({
          status: "FAILURE",
          msg: "Please provide valid username and/or date",
        });
    }

    // assign values
    let { username, date } = params;

    // check if username is valid string
    if (!validator.isValidString(username)) {
        res
          .status(400)
          .send({ status: "FAILURE", msg: "please provide valid username" });
        return;
      }

    // check if date is valid
    if (!validator.isValidDate(date)) {
        res
          .status(400)
          .send({
            status: "FAILURE",
            msg: "please provide valid start_date in format YYYY/MM/DD",
          });
        return;
      }

    // check if username is present OR registered
    const user = await userModel.findOne({ username: username });
    if (user == null) {
        res
          .status(404)
          .send({
            status: "FAILURE",
            msg: "user not registered in database",
          });
        return;
      }
    // check if user has active plans
    let existingPlan = user.subscriptions;
    const activePlan = []
    const pass = 'pass'
    
    // if valid_till is still valid push entire plan item into active plan
    existingPlan.forEach(  item => validator.isValidDate(item.valid_till)?activePlan.push(item):pass )

    // handling case when no date is given 
    
    const now = new Date();

    let dateToday = helper.formatDate(now,'YY-MM-DD');
    const userSubscriptions = user.subscriptions;
    const subscriptionsInfo = [];

    // formatting dates in required format 'YY-MM-DD'
    userSubscriptions.forEach((item) =>
    subscriptionsInfo.push({
        plan_Id : item.plan_Id,
        start_date : helper.formatDate(item.start_date,'YY-MM-DD'),
        valid_till : helper.formatDate(item.valid_till,'YY-MM-DD'),
      })
    );

    if (!date) {
      return res.status(200).send({ status: "SUCCESS", data: subscriptionsInfo });
    }
    // When Date is given 

    if(activePlan.length ===0){
      return res.status(200).send({ status: "FAILURE", msg:'Active plan not found'  });
    }

    date = new Date(date)
    const validTill = activePlan.valid_till

    // from problem statement date should be less than validity date
    if(validTill < date){
      return res.status(400).send({status:'FAILURE', msg:'Date should be less than validity date'})
    }

    const days_left = helper.subtractDate(date, validTill);

    const result = {
      plan_Id : activePlan.plan_Id,
      days_left : days_left,
    };
    return res.status(200).send({ status: "SUCCESS", data: result });
  } catch (error) {
    res.status(500).send({ status: "FAILURE", msg: error.message });
  }
};

module.exports = {
  getSubscription,
  subscribe,
  createNewPlan,
};
