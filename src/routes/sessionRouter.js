import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { createHash, isValid } from "../utils/utils.js";
import jwt from 'jsonwebtoken';


const sessionRouter = Router()

sessionRouter.get("/", (req, res) => {
    res.send("Hola user")
})

sessionRouter.post('/register', async (req, res) => {

    try {
        const { first_name, last_name, age, email, password, role } = req.body
        if (!first_name || !last_name || !age || !email || !password || !role) return res.status(400).send({ status: "error", message: "Verify your data" })

        const newUser = new userModel({
            first_name,
            last_name,
            age,
            email,
            role,
            password: createHash(password)
        })

        const result = await newUser.save()
        res.status(201).send({
            status: "success",
            payload: result
        })

    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message
        })
    }

})

sessionRouter.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body

        // validations
        if (!email || !password) return res.status(400).send({ status: "error", message: "Incomplete values" })
        const user = await userModel.findOne({ email })
        if (!user) return res.status(400).send({ status: "error", message: "User not found" })
        if (!isValid(user.password, password)) return res.status(403).send({ status: "error", message: "Incorrect password" })


        // delete sensible information
        delete user.password

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
            .status(200)
            .json({ message: 'Inicio de sesión exitoso', token });

    } catch (error) {
        res.status(400).send({ status: "error", message: error.message })
    }


})

sessionRouter.post('/current', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password -token');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
})


export default sessionRouter;