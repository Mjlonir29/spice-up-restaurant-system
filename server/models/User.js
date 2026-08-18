import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String},
    role: {type: String, enum: ['admin', 'staff', 'customer'], default: 'customer'},
    resetOtp: {type: String, default: null},
    resetOtpExpires: {type: Date, default: null}
});

const User = mongoose.model('User', userSchema);
export default User;