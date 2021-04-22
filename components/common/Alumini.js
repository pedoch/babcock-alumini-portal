function Alumini({ alumini, cb, index }) {
  return (
    <div
      className="m-3 rounded cursor-pointer flex flex-col items-center p-5 border bg-black border-yellow-400 text-white text-center hover:bg-yellow-300 hover:text-black hover:shadow"
      onClick={() => cb(alumini)}
    >
      <img src={alumini.image} className="w-24 h-24 rounded-full mb-5" />
      <div>
        <p className="text-xl font-semibold">
          {alumini.firstname + " " + alumini.lastname}
        </p>
        <p className="italic">{alumini.course}</p>
      </div>
    </div>
  );
}

export default Alumini;
