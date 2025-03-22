const mongoose = require('mongoose')
const Event = require('../models/eventModel')

const createEvent = (req, res) => {
    const event1 = new Event({
        orgId:req.body.orgId,
        eventName: req.body.eventName,
        eventDate: req.body.eventDate,
        signatoryName: req.body.signatoryName,
        signatoryDesignation:req.body.signatoryDesignation,
        certificateType: req.body.certificateType,
        description: req.body.description,
        shouldSendMail: req.body.shouldSendMail,
        isDeleted:req.body.isDeleted
    })
    console.log('event', event1)
    event1.save()
        .then(() => {
            (
                res.send({
                    msg: "event added successfully",
                    issucess: true
                })
            )
        }
        )
        .catch((error) => {
            console.log(error)
            res.send({
                msg: "error",
                issucess: false
            })
        })

}

const getEvent = async (req, res) => {
    try {
        const getEvent = await Event.find()
        console.log(getEvent)
        if (getEvent.length == 0) {
            return res.send({ msg: "no event found" })
        }


        res.send({
            msg: "event fetched successfully",
            data: getEvent
        })
    }
    catch (error) {
        console.log("error")

    }
}

const getEventById = async (req, res) => {
    try {
        const ID = req.params.id;
        console.log("ID", ID)
        if (!ID) {
            return res.send({ msg: "no User found" })
        }
        const getEvent = await Event.findById(ID)
        if (!getEvent) {
            return res.send({ msg: "no event found" })
        }
        console.log(getEvent)
        res.send({
            msg: "event fetched successfully",
            data: getEvent
        })

    }
    catch (error) {
        console.log("error", error)
    }
}




const deleteEvent = async (req, res) => {
    try {
        const ID = req.params.id;
        console.log("ID", ID)
        if (!ID) {
            return res.send({ msg: "no eevent found" })
        }
        const deleteEvent = await Event.findByIdAndDelete(ID)
        if (!deleteEvent) {
            return res.send({ msg: "no event found" })
        }
        console.log(deleteEvent)
        res.send({
            msg: "user event successfully",
            data: deleteEvent
        })
    } catch (error) {
        console.log("error", error)
    }
}


module.exports = { createEvent, getEvent, getEventById, deleteEvent }
