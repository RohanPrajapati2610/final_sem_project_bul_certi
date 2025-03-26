const mongoose = require('mongoose')
const user = require('../models/userModel')

const CreateUser = (req, res) => {
    const user1 = new user({
        organisationName: req.body.organisationName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        adminName:req.body.adminName,
        adminEmail: req.body.adminEmail,
        adminPassword: req.body.adminPassword,
        
    })
    console.log('User1', user1)
    user1.save()
        .then(() => {
            (
                res.send({
                    msg: "data added successfully",
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

const getUser = async (req, res) => {
    try {
        const getUser = await user.find()
        console.log(getUser)
        if (getUser.length == 0) {
            return res.send({ msg: "no User found" })
        }


        res.send({
            msg: "user fetched successfully",
            data: getUser
        })
    }
    catch (error) {
        console.log("error")

    }
}

const getUserById = async (req, res) => {
    try {
        const ID = req.params.id;
        console.log("ID", ID)
        if (!ID) {
            return res.send({ msg: "no User found" })
        }
        const getUser = await user.findById(ID)
        if (!getUser) {
            return res.send({ msg: "no User found" })
        }
        console.log(getUser)
        res.send({
            msg: "user fetched successfully",
            data: getUser
        })

    }
    catch (error) {
        console.log("error", error)
    }
}


const deleteUser = async (req, res) => {
    try {
        const ID = req.params.id;
        console.log("ID", ID)
        if (!ID) {
            return res.send({ msg: "no User found" })
        }
        const deleteUser = await user.findByIdAndDelete(ID)
        if (!deleteUser) {
            return res.send({ msg: "no User found" })
        }
        console.log(deleteUser)
        res.send({
            msg: "user deleted successfully",
            data: deleteUser
        })
    } catch (error) {
        console.log("error", error)
    }
}

const login = async (req, res) => {
    try {
        const user1 = await user.findOne({ adminEmail: req.body.adminEmail });
        if (!user1) {
            res.send({ message: "Organization not found" });
        }

        if (req.body.adminPassword == user1.adminPassword) {
             res.send({ message: "login successful" });
        }
        else
        {
            res.send({ message: "invalid password " });
        }

       
    } catch (error) {
        res.send({ message: error.message });
    }
};


module.exports = { getUser, CreateUser, getUserById, deleteUser,login }
