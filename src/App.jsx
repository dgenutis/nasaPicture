import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [photos, setPhotos] = useState([]);
  const [loadedDates, setLoadedDates] = useState(new Set());
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const loader = useRef(null);

  useEffect(() => {
    fetchPhoto(currentDate);
  }, []); // Įkeliama tik pradinė dienos nuotrauka

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader.current]); // Priklauso nuo loader ref, kad būtų iš naujo sukuriamas observeris, jei keičiasi loader

  const fetchPhoto = (date) => {
    if (loadedDates.has(date)) {
      // Jei nuotrauka su šia data jau yra, nekrauname jos iš naujo
      return;
    }
    fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${
        import.meta.env.VITE_NASA_API_KEY
      }&date=${date}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPhotos((prevPhotos) =>
          [...prevPhotos, data].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
        );
        setLoadedDates((prevDates) => new Set(prevDates.add(date)));
      })
      .catch((error) => console.error("Error fetching data: ", error));
  };

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      const newDateString = newDate.toISOString().split("T")[0];
      setCurrentDate(newDateString);
      fetchPhoto(newDateString);
    }
  };

  return (
    <div className="App">
      <header className="bg-slate-800 text-white p-4">
        <h1 className="text-xl">NASA Picture of the Day</h1>
      </header>
      {photos.map((photo, index) => (
        <div key={index} className="p-4 flex flex-col justify-center">
          <h2 className="text-lg font-bold text-center">{photo.title}</h2>
          <img
            src={photo.url}
            alt={photo.title}
            className="rounded-lg shadow-md mx-auto"
          />
          <p className="text-sm text-gray-600 text-center">
            Date: {photo.date}
          </p>
        </div>
      ))}
      <div ref={loader} className="loading">
        Loading...
      </div>
    </div>
  );
}

export default App;
