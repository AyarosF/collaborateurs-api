import mongoose from "mongoose"; 
import bcrypt from "bcrypt"; 
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    gender: { type: String, required: true }, 
    firstname: { type: String, required: true }, 
    lastname: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    password: String,
    phone: { type: String, required: true },
    birthdate: { type: Date, required: true }, 
    city: { type: String, required: true }, 
    country: { type: String, required: true }, 
    photo: String, 
    category: { type: String, required: true }, 
    isAdmin: { type: Boolean, required: true },
  });

  // Password & Crypt (bcrypt)
  UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next()
    bcrypt.genSalt(10, function(err, salt) {
     if (err) return next(err)

     bcrypt.hash(this.password, salt, function(err, hash) {
      if (err) return next(err)

      this.password = hash
      next()
     })
    })
    next()
  })

  UserSchema.methods.comparePassword = function(candidatePassword, userPassword) {
      console.log(candidatePassword); 
      console.log(userPassword); 
    bcrypt.compare(candidatePassword, userPassword, (err, isMatch) => {
      if (err) return null
      return isMatch
    })
    };

    UserSchema.methods.verifyPassword = function(candidatePassword, cb) {
      bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
          if (err) return cb(err);
          cb(null, isMatch);
      });
  };
;
  
  
const UserModel = model('users', UserSchema)

export default UserModel