import { useEffect, useState } from "react";

const LocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMessage("Please enable Geolocation support for your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setErrorMessage(null);
      },
      (error) => {
        setErrorMessage(error.message);
      }
    );
  }, []);

  return (
    <div>
      {location ? (
        <>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </>
      ) : (
        <p>{errorMessage || "failed to acquire location "}</p>
      )}
    </div>
  );
};

export default LocationComponent;

// const LocationComponent = () => {
//   const [location, setLocation] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/api/location");
//         setLocation(response.data);
//       } catch (err) {
//         setError(err.response.data.error);
//       }
//     };

//     fetchLocation();
//   }, []);

//   return (
//     <div>
//       {location ? (
//         <div>
//           <p>Latitude: {location.latitude}</p>
//           <p>Longitude: {location.longitude}</p>
//         </div>
//       ) : (
//         <p>{error || "Loading location..."}</p>
//       )}
//     </div>
//   );
// };

// const express = require("express");
// const app = express();
// const port = 3000;

// app.getLocation("/api/location", (req, res) => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         res.json({ latitude, longitude });
//       },
//       (error) => {
//         res.status(500).json({ error: error.message });
//       }
//     );
//   } else {
//     res
//       .status(500)
//       .json({ error: "Geolocation is not supported by this browser." });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// export default LocationComponent;
