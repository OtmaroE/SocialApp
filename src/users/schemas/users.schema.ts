import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  creditLimit: {
    type: Number,
    default: 10,
  },
  role: String,
  created: {
    type: Date,
    default: Date.now,
  },
  modified: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.statics.hashPassword = (pass) => {
  return bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
};

UserSchema.methods.comparePass = function(pass) {
  return bcrypt.compareSync(pass, this.password);
};