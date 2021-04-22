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
import AluminiForm from "../components/common/AluminiForm";
import { SP } from "next/dist/next-server/lib/utils";

export default function Home() {
  const [dates, setDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedAlumini, setSelectedAlumini] = useState(null);
  const [alumini, setAlumini] = useState([]);
  const [aluminiLoading, setAluminiLoading] = useState(false);
  const [creatingAlumini, setCreatingAlumini] = useState(false);
  const [editingAlumini, setEditingAlumini] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [stage, setStage] = useState(1);
  const [foundAlumini, setFoundAlumini] = useState({});
  const [matricNumber, setMatrictNumber] = useState(null);
  const [matError, setMatError] = useState(false);
  const [useMatNum, setUseMatNum] = useState(false);
  const [searchingAlumini, setSearchingAlumini] = useState(false);
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [foundSearch, setFoundSearch] = useState({});

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
      let { data } = await axios.get(
        `/api/alumini?year=${year || selectedYear || todayDate.getFullYear()}`
      );

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

  async function createAlumini(payload) {
    setCreatingAlumini(true);

    try {
      let { data } = await axios.post(`/api/alumini`, payload);

      toaster.success(data.message);
      fetchAlumini();
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
    } finally {
      setCreatingAlumini(false);
    }
  }

  async function updateAlumini(payload) {
    setEditingAlumini(true);

    try {
      let { data } = await axios.patch(`/api/alumini`, payload);

      toaster.success(data.message);
      fetchAlumini();
    } catch (error) {
      if (!error.response) {
        toaster.danger("Unable to update alumini", {
          description: "May be a network error",
        });
      } else if (error.response.status === 500) {
        toaster.danger("Unable to update alumini", {
          description: "May be a problem from our side. We'll investigate",
        });
      }
    } finally {
      setEditingAlumini(false);
      setShowEditModal(false);
      setStage(1);
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
          <button
            className="p-2 bg-yellow-400 text-black"
            onClick={() => setShowSearchModal(true)}
          >
            Search Alumini
          </button>
          <button
            className="p-2 bg-yellow-400 text-black"
            onClick={() => setShowNewModal(true)}
          >
            New Alumini
          </button>
          <button
            className="p-2 bg-yellow-400 text-black"
            onClick={() => setShowEditModal(true)}
          >
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
                  <button
                    className="p-2 w-full bg-black text-yellow-400 mb-5"
                    onClick={() => setShowSearchModal(true)}
                  >
                    Search Alumini
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    className="p-2 w-full bg-black text-yellow-400 mb-5"
                    onClick={() => setShowNewModal(true)}
                  >
                    New Alumini
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    className="p-2 w-full bg-black text-yellow-400"
                    onClick={() => setShowEditModal(true)}
                  >
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
            setSelectedYear(e.target.value);
          }}
        >
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
        // hasHeader={false}
        shouldCloseOnOverlayClick={true}
        containerProps={{ backgroundColor: "black" }}
        preventBodyScrolling
        onCloseComplete={() => {
          setShowModal(false);
        }}
      >
        <div className="rounded flex flex-col items-center p-6 bg-black text-white phone:p-0">
          {/* <span
            className="absolute right-4 top-1 text-3xl cursor-pointer"
            onClick={() => {
              setShowModal(false);
            }}
          >
            &times;
          </span> */}
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
      <Dialog
        isShown={showNewModal}
        title="New Alumini"
        hasFooter={false}
        // hasHeader={false}
        shouldCloseOnOverlayClick={true}
        containerProps={{ backgroundColor: "black" }}
        preventBodyScrolling
        onCloseComplete={() => {
          setShowNewModal(false);
        }}
      >
        <div
          id="alumini_form"
          className="rounded flex flex-col items-center p-6 bg-black text-white phone:p-0"
        >
          {/* <span
            className="absolute right-4 top-1 text-3xl cursor-pointer"
            onClick={() => {
              setShowNewModal(false);
            }}
          >
            &times;
          </span> */}
          <AluminiForm
            cb={createAlumini}
            loading={creatingAlumini}
            setLoading={setCreatingAlumini}
          />
        </div>
      </Dialog>
      <Dialog
        isShown={showEditModal}
        title="Update Alumini"
        hasFooter={false}
        // hasHeader={false}
        shouldCloseOnOverlayClick={true}
        containerProps={{ backgroundColor: "black" }}
        preventBodyScrolling
        onCloseComplete={() => {
          setShowEditModal(false);
          setStage(1);
        }}
      >
        <div
          id="alumini_form"
          className="rounded flex flex-col items-center p-6 bg-black text-white phone:p-0"
        >
          {/* <span
            className="absolute right-4 top-1 text-3xl cursor-pointer"
            onClick={() => {
              setShowEditModal(false);
              setStage(1);
            }}
          >
            &times;
          </span> */}
          {stage === 1 ? (
            <div>
              <input
                className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
                placeholder="Matric Number"
                required
                value={matricNumber}
                onChange={(e) => setMatrictNumber(e.target.value)}
                onFocus={() => setMatError(false)}
              />
              <button
                className="p-2 w-full bg-yellow-400 border border-black text-black"
                disabled={useMatNum}
                onClick={async () => {
                  setUseMatNum(true);
                  try {
                    if (!matricNumber) return setMatError(true);
                    let { data } = await axios.get(
                      `/api/search?matricNumber=${matricNumber}`
                    );
                    if (data.alumini) {
                      setFoundAlumini(data.alumini);
                      setStage(2);
                    }
                  } catch (error) {
                    if (!error.response) {
                      toaster.danger("Unable to check alumini", {
                        description: "May be a network error",
                      });
                    } else if (error.response.status === 500) {
                      toaster.danger("Unable to check alumini", {
                        description:
                          "May be a problem from our side. We'll investigate",
                      });
                    }
                  } finally {
                    setUseMatNum(false);
                  }
                }}
              >
                {useMatNum ? "Checking" : "Check"}
              </button>
              {matError && <p className="text-red-500">Enter Matric Number</p>}
            </div>
          ) : (
            stage === 2 && (
              <AluminiForm
                alumini={foundAlumini}
                cb={updateAlumini}
                loading={editingAlumini}
                setLoading={setEditingAlumini}
              />
            )
          )}
        </div>
      </Dialog>
      <Dialog
        isShown={showSearchModal}
        title="Search Alumini"
        hasFooter={false}
        // hasHeader={false}
        shouldCloseOnOverlayClick={true}
        containerProps={{ backgroundColor: "black" }}
        preventBodyScrolling
        onCloseComplete={() => {
          setShowSearchModal(false);
          setFoundSearch({});
        }}
      >
        <div
          id="alumini_form"
          className="rounded flex flex-col items-center p-6 bg-black text-white phone:p-0"
        >
          {/* <span
            className="absolute right-4 top-1 text-3xl cursor-pointer"
            onClick={() => {
              setShowSearchModal(false);
              setFoundSearch({});
            }}
          >
            &times;
          </span> */}
          <div>
            <input
              className="p-2  bg-black border border-yellow-400 text-yellow-400 w-full mb-2"
              placeholder="Matric Number"
              required
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchError(false)}
            />
            <button
              className="p-2 w-full bg-yellow-400 border border-black text-black"
              disabled={searchingAlumini}
              onClick={async () => {
                setSearchingAlumini(true);
                try {
                  if (!search) return setSearchError(true);
                  let { data } = await axios.get(
                    `/api/search?matricNumber=${search}`
                  );
                  if (data.alumini) {
                    setFoundSearch(data.alumini);
                  }
                } catch (error) {
                  if (!error.response) {
                    toaster.danger("Unable to search for alumini", {
                      description: "May be a network error",
                    });
                  } else if (error.response.status === 500) {
                    toaster.danger("Unable to search for alumini", {
                      description:
                        "May be a problem from our side. We'll investigate",
                    });
                  }
                } finally {
                  setSearchingAlumini(false);
                }
              }}
            >
              {searchingAlumini ? "Searching" : "Search"}
            </button>
            {searchError && <p className="text-red-500">Enter Matric Number</p>}
          </div>
          {searchingAlumini ? (
            <Spinner className="mt-5" />
          ) : foundSearch.firstname ? (
            <div className="rounded flex flex-col items-center p-6 bg-black text-white phone:p-0">
              <span
                className="absolute right-4 top-1 text-3xl cursor-pointer"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                &times;
              </span>
              <img
                src={foundSearch?.image}
                className="w-32 h-32 rounded-full mb-5"
              />
              <div>
                <p className="text-3xl font-semibold text-center text-yellow-400">
                  {foundSearch?.firstname + " " + foundSearch?.lastname}
                </p>
                <p className="italic mb-4 text-xl text-center">
                  {foundSearch?.admissionYear} - {foundSearch?.gradYear}
                </p>
                <p>
                  <span className="font-bold mb-2 text-xl">CGPA:</span>{" "}
                  {foundSearch?.cgpa}
                </p>
                <p>
                  <span className="font-bold mb-2 text-xl">Email:</span>{" "}
                  {foundSearch?.email}
                </p>
                <p>
                  <span className="font-bold mb-2 text-xl">Phone:</span>{" "}
                  {foundSearch?.phone}
                </p>
                <p>
                  <span className="font-bold mb-2 text-xl">Interst:</span>{" "}
                  {foundSearch?.interest}
                </p>
                <p>
                  <span className="font-bold mb-2 text-xl">Best Lecturer:</span>{" "}
                  {foundSearch?.bestLecturer}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-yellow-400 text-xl mt-10">Nothing here...</p>
          )}
        </div>
      </Dialog>
    </div>
  );
}
