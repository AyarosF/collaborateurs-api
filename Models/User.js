import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const { Schema, model } = mongoose

const UserSchema = new Schema({
  gender: { type: String, required: true },
  firstname: { 
    type: String, 
    required: [true, "User firstname required"], 
    minLength: [2, "Must be at least 2 characters, got {VALUE}"],  
    maxLength: [100, "Must be at most 100 characters, got {VALUE}"], 
    match: [/^[A-zÀ-ú-]*$/, "Please fill a valid firstname"]
  },
  lastname: { 
    type: String, 
    required: [true, "User lastname required"], 
    minLength: [2, "Must be at least 2 characters, got {VALUE}"], 
    maxLength: [100, "Must be at most 100 characters, got {VALUE}"], 
    match: [/^[A-zÀ-ú-\s]*$/, "Please fill a valid lastname"]
  },
  email: { 
    type: String, 
    required: true, 
    index: { unique: true }, 
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true 
    //TODO contraintes sur la difficulte du mdp 
  },
  phone: { 
    type: String, 
    required: [true, "User phone number required"], 
    match: [/^(\d{2}-){4}\d{2}$/, "Please fill a valid phone number"]
  },
  birthdate: { 
    type: Date, 
    required: true
  },
  city: { 
    type: String, 
    required: true, 
    minLength: [2, "Must be at least 2 characters, got {VALUE}"],  
    maxLength: [100, "Must be at most 100 characters, got {VALUE}"], 
    match: [/^[A-zÀ-ú-\s]*$/, "Please fill a valid city"]
  },
  country: { 
    type: String, 
    required: true,
    minLength: [2, "Must be at least 2 characters, got {VALUE}"],  
    maxLength: [100, "Must be at most 100 characters, got {VALUE}"], 
    match: [/^[A-zÀ-ú-\s]*$/, "Please fill a valid counntry"]
  },
  photo: { 
    type: String, 
    default: '',
    match: [/\b(https?:\/\/.*?\.[a-z]{2,4}\/[^\s]*\b)/g, "Please fill a valid url for the photo"]
  },
  category: { 
    type: String, 
    required: true,
    minLength: [2, "Must be at least 2 characters, got {VALUE}"],  
    maxLength: [50, "Must be at most 100 characters, got {VALUE}"],
    match: [/^[a-zA-Z]+$/, "Please fill a valid category"] 
  },
  isAdmin: { 
    type: Boolean, 
    default: false
  },
})

// Password & Crypt (bcrypt)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
  }
  catch(err) {
    next(err)
  }
})

UserSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password) return next()
  try {
    const hash = await bcrypt.hash(this._update.password, 10)
    this._update.password = hash
    next()
  }
  catch(err) {
    next(err)
  }

})

UserSchema.methods.verifyPassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}
const UserModel = model('users', UserSchema)

export default UserModel
