import { useState, useEffect } from "react";
import axios from "axios";
import { toaster } from "evergreen-ui";
import { CLOUD_NAME } from "../../util/cloud";

function AluminiForm({ alumini, cb, loading, setLoading }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [admissionYear, setAdmissionYear] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [cgpa, setCGPA] = useState("");
  const [interests, setInterests] = useState("");
  const [bestLecturer, setBestLecturer] = useState("");
  const [image, setImage] = useState("");
  const [imageBlob, setImageBlob] = useState(null);
  const [dates, setDates] = useState([]);
  const [beforeDates, setBeforeDates] = useState([]);

  let todayDate = new Date();
  useEffect(() => {
    let years = [];
    for (let i = todayDate.getFullYear(); i >= 1959; i--) {
      years.push(i);
    }

    setDates(years);

    years = [];
    for (let i = todayDate.getFullYear() - 4; i >= 1959; i--) {
      years.push(i);
    }

    setBeforeDates(years);

    if (alumini) {
      setFirstname(alumini.firstname);
      setLastname(alumini.lastname);
      setEmail(alumini.email);
      setPhone(alumini.phone);
      setCourse(alumini.course);
      setGradYear(alumini.gradYear);
      setAdmissionYear(alumini.admissionYear);
      setMatricNumber(alumini.matricNumber);
      setCGPA(alumini.cgpa);
      setInterests(alumini.interest);
      setBestLecturer(alumini.bestLecturer);
      setImage(alumini.image);
    }
  }, []);

  async function submitForm() {
    setLoading(true);

    let data;

    try {
      const CLOUD_NAME = "dsbogvjcc";

      const CLOUDINARY_UPLOAD_PRESET =
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (imageBlob) {
        let form = new FormData();
        form.append("file", imageBlob);
        form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        form.append("folder", "/babcock-alumini/");

        let res = await axios({
          url: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload/`,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: form,
        });

        data = res.data;
      }
    } catch (err) {
      toaster.warning("Image upload not working at the moment.", {
        description: "Your request will still be processed regardless",
      });
    }

    try {
      cb({
        firstname,
        lastname,
        email,
        phone: parseInt(phone),
        course,
        admissionYear: parseInt(admissionYear),
        gradYear: parseInt(gradYear),
        matricNumber,
        cgpa: parseFloat(cgpa),
        interest: interests,
        bestLecturer,
        image: data ? data.secure_url : "/images/user-profile.jpg",
      });
    } catch (error) {
      if (!error.response) {
        toaster.danger("Unable to create alumini", {
          description: "May be a network error",
        });
      } else if (error.response.status === 500) {
        toaster.danger("Unable to create alumini", {
          description: "May be a problem from our side. We'll investigate",
        });
      }
    }
  }

  return (
    <>
      <img
        src={image || "/images/user-profile.jpg"}
        className="w-32 h-32 rounded-full mb-5"
      />
      <input
        className="p-2  bg-black border border-yellow-400 text-yellow-400"
        type="file"
        onChange={(e) => {
          setImageBlob(e.target.files[0]);
          if (e.target.files[0]) {
            let url = URL.createObjectURL(e.target.files[0]);
            setImage(url);
          } else {
            setImage("/images/user-profile.jpg");
          }
        }}
      />
      <p className="mb-4">Upload Profile Picture</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}
      >
        <input
          className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
          placeholder="Firstname"
          required
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
          placeholder="Lastname"
          required
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <input
          className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
          placeholder="Phone"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
          placeholder="Course"
          required
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option>Select Course</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Computer Information Systems">
            Computer Information Systems
          </option>
          <option value="Computer Technology">Computer Technology</option>
          <option value="Software Engineering">Software Engineering</option>
        </select>
        <p className=" text-yellow-400">Admission Year</p>
        <select
          className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
          placeholder="Admission Year"
          required
          value={admissionYear}
          onChange={(e) => setAdmissionYear(e.target.value)}
        >
          <option>Select Year</option>
          {beforeDates ? (
            beforeDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))
          ) : (
            <option>No Dates Available</option>
          )}
        </select>
        <p className=" text-yellow-400">Graduation Year</p>
        <select
          className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
          placeholder="Graduation Year"
          required
          value={gradYear}
          onChange={(e) => setGradYear(e.target.value)}
        >
          <option>Select Year</option>
          {dates ? (
            dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))
          ) : (
            <option>No Dates Available</option>
          )}
        </select>
        <input
          className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
          placeholder="Matric Number"
          required
          value={matricNumber}
          onChange={(e) => setMatricNumber(e.target.value)}
        />
        <input
          className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
          placeholder="CGPA"
          required
          value={cgpa}
          onChange={(e) => setCGPA(e.target.value)}
        />
        <input
          className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
          placeholder="Interest: interests"
          required
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />
        <input
          className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
          placeholder="Best Lecturer"
          required
          value={bestLecturer}
          onChange={(e) => setBestLecturer(e.target.value)}
        />
        <button
          className="p-2 w-full bg-yellow-400 border border-black text-black"
          disabled={loading}
          type="submit"
        >
          {loading ? "Submitting" : "Submit"}
        </button>
      </form>
    </>
  );
}

export default AluminiForm;
