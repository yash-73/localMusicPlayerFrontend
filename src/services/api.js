import axios from "axios"


export const fetchTrack = async (trackId) => {
  try {
    const res = await axios.get(
      `http://localhost:8080/tracks/get/track/${trackId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.dir(err.response?.data);
    throw err; // important: propagate failure
  }
};



