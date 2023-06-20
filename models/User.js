import bcrypt from "bcrypt";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String , required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    region: String,
});

UserSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password,5);
})

const User = mongoose.model("User", UserSchema);

export default User;