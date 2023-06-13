import bcrypt from "bcrypt";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String , required: true, unique: true},
    pasword: {type: String, required: true},
    name: {type: String, required: true},
    region: String,
});

UserSchema.pre('save', async function(){
    this.passowrd = await bcrypt.hash(this.passowrd,5);
})

const User = mongoose.model("User", userSchema);

export default User;