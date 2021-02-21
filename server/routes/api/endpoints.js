const express = require('express');
const router = express.Router();
const Users = require('../../models/schema');
const axios = require('axios');
require('dotenv').config();
const zoomKey = process.env.ZOOM_KEY;
const email = process.env.EMAIL;

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