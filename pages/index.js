import Head from "next/head";
import Alumini from "../components/common/Alumini";
import { useEffect, useState } from "react";
import {
  Dialog,
  Popover,
  Menu,
  MenuIcon,
  Spinner,
  toaster,
} from "evergreen-ui";
import axios from "axios";

export default function Home() {
  const [dates, setDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlumini, setSelectedAlumini] = useState(null);
  const [alumini, setAlumini] = useState([]);
  const [aluminiLoading, setAluminiLoading] = useState(false);

  let todayDate = new Date();
  useEffect(() => {
    let years = [];
    for (let i = todayDate.getFullYear(); i >= 1959; i--) {
      years.push(i);
    }

    setDates(years);

    fetchAlumini(todayDate.getFullYear());
  }, []);

  function MakeModalShow(alumini) {
    setSelectedAlumini(alumini);
    setShowModal(true);
  }

  async function fetchAlumini(year) {
    setAluminiLoading(true);

    try {
      let { data } = await axios.get(`/api/alumini?year=${year}`);

      setAlumini(data.alumini);
    } catch (error) {
      if (!error.response) {
        toaster.danger("Unable to fecth alumini", {
          description: "May be a network error",
        });
      } else if (error.response.status === 500) {
        toaster.danger("Unable to fecth alumini", {
          description: "May be a problem from our side. We'll investigate",
        });
      }
    } finally {
      setAluminiLoading(false);
    }
  }
  return (
    <div
      className="w-full h-screen bg-cover bg-no-repeat bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/graduation1.png')" }}
    >
      <Head>
        <title>Babcock Alumini Portal</title>
      </Head>
      <div className="w-full p-4 shadow flex justify-between bg-black">
        <p className="text-xl font-semibold text-yellow-400">
          Babcock Alumini Portal
        </p>
        <div className="flex space-x-5 phone:hidden">
          <button className="p-2 bg-yellow-400 text-black">New Alumini</button>
          <button className="p-2 bg-yellow-400 text-black">
            Update Alumini
          </button>
        </div>
        <Popover
          position="bottom-left"
          backgroundColor="#000"
          statelessProps={{ backgroundColor: "black" }}
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item>
                  <button className="p-2 w-full bg-black text-yellow-400 mb-5">
                    New Alumini
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="p-2 w-full bg-black text-yellow-400">
                    Update Alumini
                  </button>
                </Menu.Item>
              </Menu.Group>
            </Menu>
          }
        >
          <button className="text-yellow-400 p-2 hidden phone:block">
            <MenuIcon />
          </button>
        </Popover>
      </div>
      <div className="w-full max-w-5xl mx-auto mt-20">
        <select
          className="p-2 ml-3 bg-black border border-yellow-400 text-yellow-400"
          defaultValue={todayDate.getFullYear()}
          onChange={(e) => {
            fetchAlumini(e.target.value);
          }}
        >
          {dates ? (
            dates.map((date) => <option value={date}>{date}</option>)
          ) : (
            <option>No Dates Available</option>
          )}
        </select>
        {aluminiLoading ? (
          <Spinner className="m-5 rounded-full bg-yellow-400" />
        ) : alumini.length > 0 ? (
          <div className="w-full grid grid-cols-4 mt-10 lg-tab:grid-cols-3 sm-tab:grid-cols-2 phone:grid-cols-1">
            {alumini.map((alu, index) => (
              <Alumini
                key={alu._id}
                alumini={alu}
                index={index}
                cb={MakeModalShow}
              />
            ))}
          </div>
        ) : (
          <p className="m-5 text-xl text-yellow-400 font-bold">Nothing here</p>
        )}
      </div>
      <Dialog
        isShown={showModal}
        title="View Alumini"
        hasFooter={false}
        hasHeader={false}
        shouldCloseOnOverlayClick={true}
        containerProps={{ backgroundColor: "black" }}
        topOffset="18%"
        preventBodyScrolling
        onCloseComplete={() => {
          setShowModal(false);
        }}
      >
        <div className="rounded flex flex-col items-center p-6 bg-black text-white">
          <span
            className="absolute right-4 top-1 text-3xl cursor-pointer"
            onClick={() => {
              setShowModal(false);
            }}
          >
            &times;
          </span>
          <img
            src={selectedAlumini?.image}
            className="w-32 h-32 rounded-full mb-5"
          />
          <div>
            <p className="text-3xl font-semibold text-center text-yellow-400">
              {selectedAlumini?.firstname + " " + selectedAlumini?.lastname}
            </p>
            <p className="italic mb-4 text-xl text-center">
              {selectedAlumini?.admissionYear} - {selectedAlumini?.gradYear}
            </p>
            <p>
              <span className="font-bold mb-2 text-xl">CGPA:</span>{" "}
              {selectedAlumini?.cgpa}
            </p>
            <p>
              <span className="font-bold mb-2 text-xl">Email:</span>{" "}
              {selectedAlumini?.email}
            </p>
            <p>
              <span className="font-bold mb-2 text-xl">Phone:</span>{" "}
              {selectedAlumini?.phone}
            </p>
            <p>
              <span className="font-bold mb-2 text-xl">Interst:</span>{" "}
              {selectedAlumini?.interest}
            </p>
            <p>
              <span className="font-bold mb-2 text-xl">Best Lecturer:</span>{" "}
              {selectedAlumini?.bestLecturer}
            </p>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
