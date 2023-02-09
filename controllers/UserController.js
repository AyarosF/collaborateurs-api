import UserModel from '../Models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Dates from '../utils/dates.js'

const TOKEN = `${process.env.TOKEN}`

const getInfosUser = (user) => {
    const birthdateString = Dates.getBirthdate(user.birthdate)
    const age = Dates.getAge(user.birthdate)
    const formattedUser = {
      id : user.id, 
      gender: user.gender,
      firstname: user.firstname,
      lastname: user.lastname,
      category: user.category,
      city: user.city,
      country: user.country,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
      birthday: birthdateString,
      age: age,
      photo: user.photo,
      isAdmin: user.isAdmin
    }

    return formattedUser
}

// ==================
// Login
// ==================

const login = async (req, res) => {
  const { email, password } = req.body

  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Un des champs est vide !' })
  }

  UserModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        // L'utilisateur existe
        user = new UserModel(user)

        user.verifyPassword(password, function (err, isMatch) {
          if (err) throw err
          if (isMatch) {            
            const accessToken = jwt.sign({ userEmail: user.email }, TOKEN, {
          expiresIn: '24h',
        })
        res.status(200).json({ message: 'Connexion validée', token: accessToken, userId: user._id })
          } else {
            return res.status(401).json({ message: 'Mot de passe invalide' })
          }
        })
      } else {
        res.status(401).json({ message: "Cet utilisateur n'existe pas !" })
      }
    })
    .catch((err) => {
      res.status(400).json({ message: 'Une erreur est survenue !' })
    })
}

// ==================
// CRUD
// ==================

const addUser = (req, res) => {
  if (req.user.isAdmin) {
    const { gender, category, lastname, firstname, email, password, phone, birthdate, city, country, photo } = req.body
  
    const User = new UserModel({
      gender: gender,
      category: category,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      phone: phone,
      birthdate: birthdate,
      city: city,
      country: country,
      photo: photo
    })

    User.save()
      .then((user) => {
        res.status(200).send({ message: "Collaborateur ajouté !", user: getInfosUser(user) })
      }).catch((err) => {
        res.status(500).send({ message: "Une erreur est survenue", error: err.message })
      })
  }
  else {
    res.status(401).send({ message: "Unauthorized" })
  }
  
}

const updateUser = async (req, res) => {
  if (req.user.id == req.params.id || req.user.isAdmin) {
    const { gender, category, lastname, firstname, email, password, phone, birthdate, city, country, photo } = req.body
    const filter = { _id: req.params.id }
    
    UserModel.findOneAndUpdate(filter, req.body, { new : true, runValidators:true })
      .then((user) => {
        res.status(200).json({ status: "success", data : user })
      }).catch((err) => {
        res.status(500).json({ status: "error", message: err.message })
      })
  } else {
    res.status(401).send({ message: "Unauthorized" })
  }
  
}

const deleteUser = async (req, res) => {
  const { id } = req.params 
  try 
  {
    await UserModel.findByIdAndRemove(id)
    res.status(200).json({ status: "success" })
  }
  catch(err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}

const getAllUsers = async (req, res) => {
  console.log(req.user)
  try {
    const users = await UserModel.find({}, { password:0 })
    res.status(200).json({ status: "success", data: users.map(user => getInfosUser(user)) })
  }
  catch(err){
    res.status(500).json({ status: "error", message: err.message })
  }
}

// const getFilteredUsers = (req, res) => {
//   res.send({ message: "Liste des utilisateurs alternative" })
// }

const getRandomUser = (req, res) => {
  UserModel.aggregate([{ $sample: { size: 1 } }])
    .then((user) => {
      res.status(200).send({ user: getInfosUser(user[0]) })
    }).catch((err) => {
      res.status(500).json({ status: "error", message: err.message })
    })
}

const getUserById = (req, res) => {
  const { id } = req.params
  UserModel.findOne({ _id: id })
    .then((user) => {
      res.status(200).send({ user: getInfosUser(user) })
    }).catch((err) => {
      res.status(500).json({ status: "error", message: err.message })
    })
}

export default {
  login,
  addUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getRandomUser,
  getUserById
}
