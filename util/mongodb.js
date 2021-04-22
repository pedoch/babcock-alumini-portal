import mongoose from "mongoose";

let uri = process.env.MONGODB_URI;
// let uri =
//   "mongodb+srv://deltanboi:cf7P8lO8rF0lQM8h@cluster0.bjxhf.mongodb.net/babcock-alumini?retryWrites=true&w=majority";

const connection = {};

export default async function connectToDatabase() {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection.isConnected = db.connections[0].readyState;
}
