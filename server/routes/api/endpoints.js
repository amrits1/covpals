const express = require('express');
const router = express.Router();
const Users = require('../../models/schema');

router.get('/test', async (req, res) => {
    let user = {
        name: "george",
        email: "testemail",
        zoom: "",
        matched: false,
        partner: {name: "a", time: {day: 0, hour: 0}, email: "d"},
        availability: {sunday: [], monday: [], tuesday: [7], wednesday: [], thursday: [21], friday: [], saturday: []}};
    await Users.create(user);
}) //testing

// change to post after
router.get('/create', async (req, res) => {
    let user = {
        name: "harold3",
        email: "testemail2",
        zoom: "",
        matched: false,
        partner: {name: "a", time: {day: 0, hour: 0}, email: "d"},
        availability: {sunday: [], monday: [], tuesday: [7], wednesday: [3], thursday: [23], friday: [6], saturday: [1]}
        //name: req.body.name,
        //email: req.body.email,
        //availability: req.body.availability
        //zoom: "",
        //matched: false,
        //partner: {name: "", time: {day: 0, hour: 0}, email: ""}
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
            user.partner = {name: "", email: "", time: {day: -1, hour: -1}};
            user.zoom = "";
            user.matched = false;
            await Users.create(user);
        }
        else {
            for (day in user.availability) {
                let common = user.availability[day].filter(x => result.availability[day].includes(x));
                if (common.length != 0) {
                    dayInt = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].indexOf(day);
                    user.partner = {name: result.name, email: result.email, time: {day: dayInt, hour: common[0]}};
                    user.zoom = ""; // placeholder for creating the link
                    user.matched = true;
                    await Users.create(user);
                    
                    // need to also updating existing result
                    result.partner = {name: user.name, email: user.name, time: {day: dayInt, hour: common[0]}};
                    result.zoom = ""; // placeholder for creating the link
                    result.matched = true;
                    await Users.replaceOne( {_id: result._id}, result);
                    
                    break;
                }
            }
        }
    })
});

module.exports = router;