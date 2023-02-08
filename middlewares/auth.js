import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import UserModel from '../Models/User.js'
dotenv.config()

export default async (req, res, next) => {
  var token = null

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]  
  }

  if (!token) {
    return res.status(403).json({ message: "Unauthorized connection" })
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN)
    const user = await UserModel.findOne({ email : decoded.userEmail })
    req.user = {
      id: user._id,
      isAdmin: user.isAdmin
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized connection - Error with the token" })
  }
  
}