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

export const fetchTotalTracksCount = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/tracks/get/tracks?pageNumber=0&pageSize=1`,
      { withCredentials: true }
    );
    return res.data.totalElements || 0;
  } catch (err) {
    console.dir(err.response?.data);
    throw err;
  }
};

export const searchTracksByName = async (query) => {
  try {
      const result  = await axios.get(`http://localhost:8080/tracks/search?keyword=${query}` ,
          {withCredentials: true}  
      );
      return result.data;
  }
  catch(err) {
    console.dir(err.response?.data);
    throw err;
  }
}

export const searchTracks = async (query) => {
  try {
    const result = await axios.get(
      `http://localhost:8080/tracks/search?keyword=${query}`,
      { withCredentials: true }
    );
    return result.data;
  } catch (err) {
    console.dir(err.response?.data);
    throw err;
  }
};

export const searchAlbums = async (query) => {
  try {
    const result = await axios.get(
      `http://localhost:8080/albums/search?keyword=${query}`,
      { withCredentials: true }
    );
    return result.data;
  } catch (err) {
    console.dir(err.response?.data);
    throw err;
  }
};

export const searchArtists = async (query) => {
  try {
    const result = await axios.get(
      `http://localhost:8080/artists/search?keyword=${query}`,
      { withCredentials: true }
    );
    return result.data;
  } catch (err) {
    console.dir(err.response?.data);
    throw err;
  }
};



