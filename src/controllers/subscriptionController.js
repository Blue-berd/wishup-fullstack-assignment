const { userModel, subscriptionModel } = require("../models");
const { validator, functions } = require("../utils");
// const dateandtime = require('date-and-time');
// // const moment = require('moment')
// // const {addDays} = require('date-fns')

const createNewPlan = async function (req, res) {
  try {
    const requestedBody = req.body;
    const { plan_Id, validity, cost } = requestedBody;

    if (!validator.isValidString(plan_Id)) {
      res
        .status(400)
        .send({ status: "FAILURE", msg: "please send valid plan_id" });
      return;
    }

    if (!validator.isValidString(validity)) {
      res
        .status(400)
        .send({ status: "FAILURE", msg: "please send valid validity" });
      return;
    }

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

const subscribe = async function (req, res) {
  try {
    const requestedBody = req.body;

    if (!validator.isValidRequestBody(requestedBody)) {
      return res
        .status(400)
        .send({ status: "FAILURE", msg: "Please provide valid body" });
    }

    let { username, plan_Id, start_date } = requestedBody;
    console.log(username);
    if (!validator.isValidString(username)) {
      res
        .status(400)
        .send({ status: "FAILURE", msg: "please provide valid username" });
      return;
    }

    const user = await userModel.findOne({ username: username });

    if (user == null) {
      return res
        .status(404)
        .send({ status: "FAILURE", msg: "user not registered" });
    }

    if (!validator.isValidString(plan_Id)) {
      res
        .status(400)
        .send({ status: "FAILURE", msg: "please provide valid plan_id" });
      return;
    }
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

    if (!validator.isValidDate(start_date)) {
      res
        .status(400)
        .send({
          status: "FAILURE",
          msg: "please provide valid start_date in format YYYY/MM/DD",
        });
      return;
    }

    const plan = await subscriptionModel.findOne({ plan_Id: plan_Id });

    if (plan.validity != "Infinite") {
      const total = functions.addDate(start_date, +plan.validity);
      var valid_till = new Date(total);
      valid_till = functions.formatDateYMD(valid_till);
    }

    if (plan.validity == "Infinite") {
      var valid_till = "Infinity";
    }

    const userInfo = await userModel.findOne({ username: username });

    let plan_exist = userInfo.subscriptions;

    plan_exist = plan_exist.map((item) => item.plan_Id);

    if (plan_exist.find((item) => item == plan_Id)) {
      return res
        .status(400)
        .send({
          status: "FAILURE",
          msg: `you already have ${plan_Id} subscription.`,
        });
    }

    const subscriptionObject = {
      plan_Id,
      start_date: start_date,
      valid_till: valid_till,
    };

    const subscription = await userModel.findOneAndUpdate(
      { username: username },
      { $addToSet: { subscriptions: subscriptionObject } },
      { new: true }
    );

    if (subscription == null) {
      return res
        .status(404)
        .send({
          status: "FAILURE",
          msg: "Username not found or not registered",
        });
    }

    let cost = `${plan.cost}`;

    if (plan.cost == 0) {
      cost = 0;
    }
    return res.status(201).send({ status: "SUCCESS", amount: cost });
  } catch (error) {
    res.status(500).send({ status: "FAILURE", msg: error.message });
  }
};

const getSubscription = async function (req, res) {
  try {
    const params = req.params;

    if (params == null || params.length == 0) {
      return res
        .status(400)
        .send({
          status: "FAILURE",
          msg: "Please provide valid username and/or date",
        });
    }
    let { username, date } = params;

    if (!validator.isValidString(username)) {
        res
          .status(400)
          .send({ status: "FAILURE", msg: "please provide valid username" });
        return;
      }

    if (!validator.isValidDate(date)) {
        res
          .status(400)
          .send({
            status: "FAILURE",
            msg: "please provide valid start_date in format YYYY/MM/DD",
          });
        return;
      }

    date = new Date(date)
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
    const valid_till = user.subscriptions[0];

    const now = new Date();

    let dateToday = functions.formatDateYMD(now);

    if (+dateToday >= valid_till) {
      return res
        .status(404)
        .send({
          status: "SUCCESS",
          msg: "No active plans found. Please renew your subscription",
        });
    }

    if (!date) {
      const userSubscriptions = user.subscriptions;
      const userObject = [];

      userSubscriptions.forEach((item) =>
        userObject.push({
          plan_Id : item.plan_Id,
          start_date : functions.formatDateYMD(item.start_date),
          valid_till : functions.formatDateYMD(item.valid_till),
        })
      );

      return res.status(200).send({ status: "SUCCESS", data: userObject });
    }

    date = new Date(date)
    dateToday = new Date(dateToday)
    const days_left = functions.subtractDate(dateToday, date);
 
    const result = {
      plan_Id : user.subscriptions.plan_Id,
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
