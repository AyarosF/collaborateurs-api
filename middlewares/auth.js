import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import UserModel from '../Models/User.js'
dotenv.config()

const auth = async (req, res, next) => {
  var token = null

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]  
  }

  if (!token) {
    return res.status(403).json({ message: "Unauthorized connection" })
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN)
    req.user = await UserModel.findOne({ email : decoded.userEmail })
    if (req.user.isAdmin) console.log("is admin")
    next()
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized connection" })
  }
  
}

const isAdmin = (req, res, next) => {
  /* let isAdmin = false
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token =  req.headers.authorization.split(' ')[1]  
  }*/
  next()
}

export { auth, isAdmin }