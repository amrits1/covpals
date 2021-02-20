const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../../models/schema');
const mailgun = require("mailgun-js");
require('dotenv').config();
const MG_API_KEY = process.env.MG_API_KEY

const DOMAIN = "sandbox83ebde3040d74961b33666e3369f3852.mailgun.org";
const mg = mailgun({apiKey: MG_API_KEY, domain: DOMAIN});
const data = {
	from: "Mailgun Sandbox <postmaster@sandbox83ebde3040d74961b33666e3369f3852.mailgun.org>",
	to: "fahmym12@mcmaster.ca",
	subject: "Hello",
	text: "Testing some Mailgun awesomness!"
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});


function sendEmailsHourly() {
    Users.find({'matched': true}, (err, user) => {
        user.forEach(user_ => console.log(user_.email));
    });
}

sendEmailsHourly();

var nextDate = new Date();
if (nextDate.getMinutes() === 45) {
    setInterval(sendEmailsHourly,1000*60*60); // call sendEmails() once every hour beginning at XX:45
} else {
    nextDate.setHours(nextDate.getHours() + 1);
    nextDate.setMinutes(0);

    var difference = nextDate - new Date();
    setTimeout(sendEmailsHourly, difference);
}

module.exports = router;