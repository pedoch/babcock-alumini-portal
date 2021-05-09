import connectToDatabase from "../../util/mongodb";
import Alumini from "../../models/alumini";
const PdfPrinter = require("pdfmake");

connectToDatabase();

export default async (req, res) => {
  const { method, query, body } = req;

  switch (method) {
    case "GET":
      try {
        let filter;
        const { year, matricNumber } = query;
        if (year) {
          filter = { gradYear: year };

          const alumini = await Alumini.find(filter);

          const aluminiDetails = [];

          for (let i = 0; i < alumini.length; i++) {
            aluminiDetails.push([
              alumini[i].firstname,
              alumini[i].lastname,
              alumini[i].email,
              alumini[i].phone,
              alumini[i].course,
              alumini[i].admissionYear,
              alumini[i].gradYear,
              alumini[i].matricNumber,
              alumini[i].cgpa,
              alumini[i].interest,
              alumini[i].bestLecturer,
            ]);
          }

          aluminiDetails.unshift([
            { text: "First Name", style: "tableHeader" },
            { text: "Last Name", style: "tableHeader" },
            { text: "Email", style: "tableHeader" },
            { text: "Phone", style: "tableHeader" },
            { text: "Course", style: "tableHeader" },
            { text: "Admission Year", style: "tableHeader" },
            { text: "Grad Year", style: "tableHeader" },
            { text: "Matric Number", style: "tableHeader" },
            { text: "CGPA", style: "tableHeader" },
            { text: "Interest", style: "tableHeader" },
            { text: "Best Lecturer", style: "tableHeader" },
          ]);

          const printer = new PdfPrinter({
            Roboto: {
              normal: new Buffer(
                require("pdfmake/build/vfs_fonts.js").pdfMake.vfs[
                  "Roboto-Regular.ttf"
                ],
                "base64"
              ),
              bold: new Buffer(
                require("pdfmake/build/vfs_fonts.js").pdfMake.vfs[
                  "Roboto-Medium.ttf"
                ],
                "base64"
              ),
            },
          });

          const docOptions = {
            info: {
              title: `${year} Alumini Set Details`,
              author: "Babcock Alumini Portal",
              subject: "Alumini Report",
              keywords: "alumini report details",
            },
            pageOrientation: "landscape",
            content: [
              {
                text: `${year} Alumini Set Details`,
                style: "header",
              },
              {
                style: "tableExample",
                table: {
                  headerRows: 1,
                  widths: [80, 80, 100, 50, 50, 50, 50, 50, 50, 50, 50, 50],
                  body: aluminiDetails,
                },
              },
            ],
            styles: {
              header: {
                fontSize: 22,
                bold: true,
                marginBottom: 10,
              },
              tableExample: {
                width: 100,
                // fontSize: 7,
              },
              tableHeader: {
                bold: true,
              },
            },
          };

          const report = printer.createPdfKitDocument(docOptions);

          let chunks = [];

          report.on("data", (chunk) => {
            chunks.push(chunk);
          });

          report.on("end", () => {
            res.setHeader("Content-Type", "application/pdf");
            return res.send(Buffer.concat(chunks)); // Buffer data
          });

          report.end();
        } else if (matricNumber) {
          filter = { matricNumber: matricNumber };

          const alumini = await Alumini.findOne(filter);

          if (!alumini)
            return res.status(404).json({ message: "No alumini found." });

          const printer = new PdfPrinter({
            Roboto: {
              normal: new Buffer(
                require("pdfmake/build/vfs_fonts.js").pdfMake.vfs[
                  "Roboto-Regular.ttf"
                ],
                "base64"
              ),
              bold: new Buffer(
                require("pdfmake/build/vfs_fonts.js").pdfMake.vfs[
                  "Roboto-Medium.ttf"
                ],
                "base64"
              ),
            },
          });

          const docOptions = {
            info: {
              title: `${matricNumber} Alumini Details`,
              author: "Babcock Alumini Portal",
              subject: "Alumini Report",
              keywords: "alumini report details",
            },
            content: [
              {
                text: `${matricNumber} Alumini Details`,
                style: "header",
              },
              { text: `First Name: ${alumini.firstname}`, style: "text" },
              { text: `Last Name: ${alumini.lastname}`, style: "text" },
              { text: `Email: ${alumini.email}`, style: "text" },
              { text: `Phone: ${alumini.phone}`, style: "text" },
              { text: `Course: ${alumini.course}`, style: "text" },
              { text: `Image: ${alumini.image}`, style: "text" },
              {
                text: `AdmissionYear: ${alumini.admissionYear}`,
                style: "text",
              },
              { text: `GradYear: ${alumini.gradYear}`, style: "text" },
              { text: `MatricNumber: ${alumini.matricNumber}`, style: "text" },
              { text: `CGPA: ${alumini.cgpa}`, style: "text" },
              { text: `Interest: ${alumini.interest}`, style: "text" },
              { text: `Best Lecturer: ${alumini.bestLecturer}`, style: "text" },
            ],
            styles: {
              header: {
                fontSize: 22,
                bold: true,
                marginBottom: 10,
              },
              text: {
                marginBottom: 4,
              },
            },
          };

          const report = printer.createPdfKitDocument(docOptions);

          let chunks = [];

          report.on("data", (chunk) => {
            chunks.push(chunk);
          });

          report.on("end", () => {
            res.setHeader("Content-Type", "application/pdf");
            return res.send(Buffer.concat(chunks)); // Buffer data
          });

          report.end();
        } else
          return res
            .status(400)
            .json({ message: "Type of report not specified." });
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
