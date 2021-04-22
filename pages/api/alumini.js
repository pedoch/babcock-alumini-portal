import connectToDatabase from "../../util/mongodb";
import Alumini from "../../models/alumini";

connectToDatabase();

export default async (req, res) => {
  const { method, query, body } = req;

  switch (method) {
    case "GET":
      try {
        let filter;
        const { year } = query;
        if (year) filter = { gradYear: year };

        const alumini = await Alumini.find(filter);

        res
          .status(200)
          .json({ alumini: alumini, message: "Alumini fetched sucessfully!" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
      }
      break;
    case "POST":
      try {
        let alumini;
        if (
          !body.firstname ||
          !body.lastname ||
          !body.course ||
          !body.image ||
          !body.admissionYear ||
          !body.gradYear ||
          !body.matricNumber ||
          !body.cgpa ||
          !body.email ||
          !body.phone ||
          !body.interest ||
          !body.bestLecturer
        )
          return res
            .status(401)
            .json({ message: "Fill form properly, missing parameters." });

        if (body.email) {
          alumini = await Alumini.findOne({ email: body.email });
          if (alumini)
            return res.status(401).json({
              message: "Email has already been used, user already exists.",
            });
        }

        if (body.matricNumber) {
          alumini = await Alumini.findOne({
            matricNumber: body.matricNumber,
          });
          if (alumini)
            return res.status(401).json({
              message: "Matric has already been used, user already exists.",
            });
        }

        if (body.phone) {
          alumini = await Alumini.findOne({ phone: body.phone });
          if (alumini)
            return res.status(401).json({
              message: "Email has already been used, user already exists.",
            });
        }

        alumini = await Alumini({ ...body });

        await alumini.save();

        res
          .status(201)
          .json({ message: "Your data has been saved sucessfully", alumini });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
      }
      break;
    case "PATCH":
      try {
        let alumini;
        if (
          !body.firstname ||
          !body.lastname ||
          !body.course ||
          !body.image ||
          !body.admissionYear ||
          !body.gradYear ||
          !body.matricNumber ||
          !body.cgpa ||
          !body.email ||
          !body.phone ||
          !body.interest ||
          !body.bestLecturer
        )
          return res
            .status(401)
            .json({ message: "Fill form properly, missing parameters." });

        alumini = await Alumini.findOne({
          email: body.email,
          matricNumber: body.matricNumber,
        });

        if (!alumini)
          return res.status(401).json({
            message: "Alumini does not exist",
          });

        // alumini = { ...alumini, ...body };

        alumini.firstname = body.firstname;
        alumini.lastname = body.lastname;
        alumini.course = body.course;
        alumini.image = body.image;
        alumini.admissionYear = body.admissionYear;
        alumini.gradYear = body.gradYear;
        alumini.matricNumber = body.matricNumber;
        alumini.cgpa = body.cgpa;
        alumini.email = body.email;
        alumini.phone = body.phone;
        alumini.interest = body.interest;
        alumini.bestLecturer = body.bestLecturer;

        await alumini.save();

        res
          .status(201)
          .json({ message: "Your data has been saved sucessfully", alumini });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
      }
      break;
    default:
      res.status(400).json({ message: "We think you may be lost" });
      break;
  }
};
