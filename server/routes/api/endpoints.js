const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../../models/schema');
const mailgun = require("mailgun-js");
require('dotenv').config();
const MG_API_KEY = process.env.MG_API_KEY
const DOMAIN = "www.covpals.online";
const mg = mailgun({apiKey: MG_API_KEY, domain: DOMAIN});
const axios = require('axios');
const zoomKey = process.env.ZOOM_KEY;
const email = process.env.EMAIL;

function sendFirstEmail(user) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const data = {
        from: "CovPals <postmaster@sandbox83ebde3040d74961b33666e3369f3852.mailgun.org>",
        to: user.email,
        subject: "You've been matched!",
        text: `Hello ${user.name},\n\nWe've found you a CovPal! You've been matched with ${user.partner.name} (${user.partner.email})! Your first CovPals meeting will be on ${days[user.partner.time.day]} at ${user.partner.time.hour%12} ${user.partner.time.hour-12>=0 ? "PM" : "AM"}.\n\nThe zoom link for your meeting is ${user.zoom}.`
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
}

function sendEmails() {
    const currDate = new Date();
    console.log(currDate.getDay(),currDate.getHours());
    Users.find({'matched': true, 'partner.time': {'day': currDate.getDay(), 'hour': currDate.getHours()+1}}, (err, users) => {
        users.forEach(user => {
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            console.log(user);
            const data = {
                from: "CovPals <postmaster@sandbox83ebde3040d74961b33666e3369f3852.mailgun.org>",
                to: user.email,
                subject: "Meeting in 15 Minutes!",
                text: `Hello ${user.name},\n\nThis is a reminder about your CovPals meeting with ${user.partner.name} (${user.partner.email})! You have been scheduled to call them on ${days[user.partner.time.day]} at ${user.partner.time.hour%12} ${user.partner.time.hour-12>=0 ? "PM" : "AM"}.\n\nThe zoom link for your meeting is ${user.zoom}.`
            };
            mg.messages().send(data, function (error, body) {
                console.log(body);
            });
            sendFirstEmail(user);
        });
    });
}

function callHourly() {
    console.log("Sending emails hourly!");
    sendEmails();
    setInterval(sendEmails,1000*60*60);
}

var nextDate = new Date();
if (nextDate.getMinutes() === 9) {
    console.log("Current time works");
    callHourly(); // call sendEmails() once every hour beginning at XX:45
} else {
    nextDate.setHours(nextDate.getHours() + 1);
    nextDate.setMinutes(0);
    nextDate.setSeconds(0);

    var difference = nextDate - new Date();
    setTimeout(callHourly, difference); // set a delay to call hourly beginning at the next time it's 45 after by waiting the time between now and the next time it'll be XX:45
}

// post request
router.post('/create', async (req, res) => {
    let user = {
        name: req.body.name,
        email: req.body.email,
        availability: req.body.availability,
        zoom: "",
        matched: false,
        partner: {name: "", time: {day: 0, hour: 0}, email: ""}
    };

    Users.findOne({ $and: [ { $or: [
        { "availability.monday": { $elemMatch: { $in: user.availability.monday} } },
        { "availability.tuesday": { $elemMatch: { $in: user.availability.tuesday} } },
        { "availability.wednesday": { $elemMatch: { $in: user.availability.wednesday} } },
        { "availability.thursday": { $elemMatch: { $in: user.availability.thursday} } },
        { "availability.friday": { $elemMatch: { $in: user.availability.friday} } }
    ] }, {matched: false} ] }, async function (err, result) {
        if (err) {
            return;
        } 
        else if (result==null) {
            // no match
            user.partner = {name: "", email: "", time: {day: -1, hour: -1}};
            user.zoom = "";
            user.matched = false;
            await Users.create(user);
        }
        else {
            // already a match in the database
            (async () => {for (day in user.availability) {
                let common = user.availability[day].filter(x => result.availability[day].includes(x));
                if (common.length != 0) {
                    let dayInt = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].indexOf(day);

                    function nextDay(d, dow){
                        d.setUTCDate(d.getUTCDate() + (dow+(7-d.getUTCDay())) % 7);
                        return d;
                    }

                    let meetingDay = nextDay(new Date(), dayInt);
                    meetingDay.setUTCHours(common[0]);
                    meetingDay.setUTCMinutes(0);
                    meetingDay.setUTCSeconds(0);

                    startTime = meetingDay.toISOString().split('.').shift() + 'Z';

                    let params = {topic:"Meeting someone new!", duration: 60, start_time: startTime, recurrence:{type: 2, repeat_interval: 1, weekly_days: (dayInt + 1) }, settings: {jbh_time: 10, registration_type: 1, join_before_host: true}}

                    let myPromise = new Promise((resolve, reject) => {
                        axios.post('https://api.zoom.us/v2/users/'+email+'/meetings', params, {headers:{"content-type": "application/json", authorization: `Bearer ${zoomKey}`}}).then(response => {resolve(response.data)}).catch(response => console.log(response))
                    })
                    myPromise.then(async (x) => {
                        let link = x.join_url;
                        console.log(link);
                        user.partner = {name: result.name, email: result.email, time: {day: dayInt, hour: common[0]}};
                        user.zoom = link; 
                        user.matched = true;
                        await Users.create(user);
    
    
                        // need to also updating existing result
                        result.partner = {name: user.name, email: user.name, time: {day: dayInt, hour: common[0]}};
                        result.zoom = link; 
                        result.matched = true;
                        await Users.replaceOne( {_id: result._id}, result);
                        
                        // should also send an email to user.email and result.email right here notifying that they were matched

                    })
                    break;
                }
            }})()
        }
    })
    res.send("Finished.");
});

module.exports = router;