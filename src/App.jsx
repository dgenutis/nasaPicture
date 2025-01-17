import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [photo, setPhoto] = useState(null);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  useEffect(() => {
    fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${
        import.meta.env.VITE_NASA_API_KEY
      }&date=${date}`
    )
      .then((response) => response.json())
      .then((data) => setPhoto(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, [date]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const goBackOneDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate.toISOString().split("T")[0]);
  };

  const goForwardOneDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate.toISOString().split("T")[0]);
  };

  const isToday = date === new Date().toISOString().split("T")[0];

  return (
    <div className="App min-h-screen bg-gray-900 flex flex-col items-center text-white">
      <header className="w-full bg-black text-white py-4 text-center text-xl">
        NASA Picture of the Day
      </header>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {photo && (
          <div className="photo-container max-w-4xl mx-auto bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-center">{photo.title}</h2>
            <img
              src={photo.url}
              alt={photo.title}
              className="rounded-lg mx-auto my-4"
            />
            <p className="text-center text-gray-400">Date: {photo.date}</p>
            <p className="text-gray-300">{photo.explanation}</p>
          </div>
        )}
        <div className="date-picker-container flex flex-col items-center justify-center mt-4">
          <div className="date-picker flex items-center gap-2">
            <label htmlFor="date" className="text-gray-300">
              Choose a date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              max={new Date().toISOString().split("T")[0]}
              className="form-input px-4 py-2 border rounded-md bg-gray-700 border-gray-600"
            />
          </div>
          <div className="buttons flex gap-2 mt-2">
            <button
              onClick={goBackOneDay}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Back
            </button>
            <button
              onClick={goForwardOneDay}
              disabled={isToday}
              className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ${
                isToday ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Forward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
