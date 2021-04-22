import connectToDatabase from "../../util/mongodb";
import Alumini from "../../models/alumini";

connectToDatabase();

export default async (req, res) => {
  const { method, query, body } = req;

  switch (method) {
    case "GET":
      try {
        let filter;
        const { matricNumber } = query;
        if (matricNumber) filter = { matricNumber: matricNumber };

        const alumini = await Alumini.findOne(filter);

        res
          .status(200)
          .json({ alumini: alumini, message: "Alumini fetched sucessfully!" });
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
