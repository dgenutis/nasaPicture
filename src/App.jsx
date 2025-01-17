import  { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${
        import.meta.env.VITE_NASA_API_KEY
      }`
    )
      .then((response) => response.json())
      .then((data) => setPhoto(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  return (
    <div className="App">
      <header className="bg-slate-800 text-white p-4">
        <h1 className="text-xl">NASA Picture of the Day</h1>
      </header>
      {photo && (
        <div className="p-4 flex flex-col justify-center mx-10">
          <h2 className="text-lg font-bold text-center">{photo.title}</h2>
          <img
            src={photo.url}
            alt={photo.title}
            className="rounded-lg shadow-md mx-auto"
          />
          <p className="text-sm text-gray-600 text-center">Date: {photo.date}</p>
          <p className="py-4">{photo.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default App;
