export default function Cards({ name, userName, image }) {
  return (
    <div
      className="card shadow-2xl flex flex-col items-center p-4"
      style={{ width: "18rem", maxHeight: "30rem" }}
    >
      <div
        className="flex justify-center items-center overflow-hidden"
        style={{
          width: "10rem",
          height: "10rem",
          borderRadius: "50%",
          marginTop: "10px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <img
          src={
            image
              ? `http://localhost:3000/uploads/${image}`
              : "https://via.placeholder.com/150"
          }
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div className="card-body text-center">
        <h5 className="card-title font-bold">{name}</h5>
        <p className="card-text text-gray-600">{userName}</p>
      </div>

      <ul className="list-group list-group-flush text-center">
        <li className="list-group-item">Name: {name}</li>
        <li className="list-group-item">Username: {userName}</li>
      </ul>

      <div className="w-full flex justify-center gap-3 mt-4">
        <button
          className="
    bg-red-500
    text-white
    px-4 py-2
    rounded-lg
    shadow
    hover:bg-red-600
    transition
  "
        >
          Delete
        </button>

        <button
          className="
    bg-yellow-400
    text-black
    px-4 py-2
    rounded-lg
    shadow
    hover:bg-yellow-500
    transition
  "
        >
          Edit
        </button>
      </div>
    </div>
  );
}
