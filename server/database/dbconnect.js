import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const ConnectDB=async function(){
    try {
        await mongoose.connect(`${process.env.DB_URL}`);
        console.log(`connection to the port ${process.env.Port} is successful`)
    } catch (error) {
        console.log("Error encountered",error)
        process.exit(1)
    }
};
export default ConnectDB