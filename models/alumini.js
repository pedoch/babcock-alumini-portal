const mongoose = require("mongoose");

const AluminiSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please enter first name"],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, "Please enter last name"],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Please enter phone number"],
    unique: true,
  },
  course: {
    type: String,
    require: [true, "Please select course"],
    trim: true,
  },
  image: {
    type: String,
  },
  admissionYear: {
    type: Number,
    require: [true, "Please select admission year"],
  },
  gradYear: {
    type: Number,
    require: [true, "Please select graduation year"],
  },
  matricNumber: {
    type: String,
    require: [true, "Please enter matric number"],
    trim: true,
  },
  cgpa: {
    type: Number,
    require: [true, "Please enter CGPA"],
  },
  interest: {
    type: String,
    require: [true, "Please enter interest"],
    trim: true,
  },
  bestLecturer: {
    type: String,
    require: [true, "Please enter best lecturer"],
    trim: true,
  },
});

module.exports =
  mongoose.models.Alumini || mongoose.model("Alumini", AluminiSchema);
