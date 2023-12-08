import mongoose, { USERS_COLLECTION } from "../config/database";
import { User } from "../interfaces/user";
import logger from "../config/logger";

const ObjectId = mongoose.Types.ObjectId


  
export const getAllUser = async () => {
    try {
        let users = await mongoose.connection.db.collection(USERS_COLLECTION).find();
        return users.toArray() as unknown as User[];
    } catch (err:any) {
        console.error(`Error in fetching all loans: \n${err}`);
        throw err;
    }
};
  
export const getUserByID = async (id: string) => {
    try {
        let user = await mongoose.connection.db.collection(USERS_COLLECTION).findOne({ _id: new ObjectId(id)});
        return user as unknown as User;
    } catch (err:any) {
        console.error(`Error in fetching all loans: \n${err}`);
        throw err;
    }
};
  
