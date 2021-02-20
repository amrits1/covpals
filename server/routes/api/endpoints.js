const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../../models/schema');
const mailgun = require("mailgun-js");
require('dotenv').config();
const MG_API_KEY = process.env.MG_API_KEY
const DOMAIN = "sandbox83ebde3040d74961b33666e3369f3852.mailgun.org";
const mg = mailgun({apiKey: MG_API_KEY, domain: DOMAIN});

function sendEmails() {
    const currDate = new Date();
    console.log(currDate.getDay(),currDate.getHours());
    Users.find({'matched': true, 'partner.time': {'day': currDate.getDay(), 'hour': currDate.getHours()+1}}, (err, users) => {
        users.forEach(user => {
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            console.log(user);
            const data = {
                from: "Cooking with Friends <postmaster@sandbox83ebde3040d74961b33666e3369f3852.mailgun.org>",
                to: user.email,
                subject: "Cooking in 15 Minutes!",
                text: `Hello ${user.name},\n\nThis is a reminder about your cooking meeting with ${user.partner.name} (${user.partner.email})! You have been scheduled to call them on ${days[user.partner.time.day]} at ${user.partner.time.hour%12} ${user.partner.time.hour-12>=0 ? "PM" : "AM"}\n\nThe zoom link for your meeting is ${user.zoom}.`
            };
            mg.messages().send(data, function (error, body) {
                console.log(body);
            });
        });
    });
}

function callHourly() {
    console.log("Sending emails hourly!");
    sendEmails();
    setInterval(sendEmails,1000*60*60);
}

var nextDate = new Date();
if (nextDate.getMinutes() === 45) {
    console.log("Current time works");
    callHourly(); // call sendEmails() once every hour beginning at XX:45
} else {
    nextDate.setHours(nextDate.getHours() + 1);
    nextDate.setMinutes(0);
    nextDate.setSeconds(0);

    var difference = nextDate - new Date();
    setTimeout(callHourly, difference); // set a delay to call hourly beginning at the next time it's 45 after by waiting the time between now and the next time it'll be XX:45
}

module.exports = router;