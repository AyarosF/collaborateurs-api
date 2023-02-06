import UserModel from '../Models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

const TOKEN = `${process.env.TOKEN}`

// ==================
// Login / Logout
// ==================

const getLoginForm = (req, res) => {
  res.status(200).json({ message: 'Formulaire de connexion' })
}

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
        res.status(200).json({ message: 'Connexion validée', token: accessToken })
          } else {
            return res.status(400).json({ message: 'Mot de passe invalide' })
          }
        })
      } else {
        res.status(400).json({ message: "Cet utilisateur n'existe pas !" })
      }
    })
    .catch((err) => {
      res.status(400).json({ message: 'Une erreur est survenue !' })
    })
}

const logout = (req, res) => {}

// ==================
// CRUD
// ==================

const addUser = async (req, res) => {}
const updateUser = async (req, res) => {}
const deleteUser = async (req, res) => {}

const getUsers = (req, res) => {
  res.send({ message: "Page d'accueil" })
}

const profile = (req, res) => {}

export default {
  getLoginForm,
  login,
  logout,
  addUser,
  updateUser,
  deleteUser,
  getUsers,
  profile,
}
