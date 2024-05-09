const mongoose  = require("mongoose");


async function ConnectToDB() {
    try{
     await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected")
    }catch(err){
        console.log('conection Falied To MongoDB',err);
    }
}

module.exports = ConnectToDB;