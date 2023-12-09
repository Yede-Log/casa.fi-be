/** Required Node Modules */
import { model, Schema, Model, Document } from 'mongoose';

/** Required App Modules */

/** Required Interface */
export interface IUser extends Document {
    email:string;
    address: string,
    isLender: boolean
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true,
    },
    address: {
        type: String,
        require: true,
        unique: true,
    },
    isLender: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})


const User :Model<IUser> | any = model("User", UserSchema)
export default User;