import axios from "axios";
import API from "../../lib/authAxios";
import { subArrays } from "../../utilities/arrayUtil";

export const searchBooks = async (query, startIndex = 0) => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${36}`
    );

    const results = subArrays(res.data.items, 12);

    return { bookResults: results };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const searchUsers = async (query) => {
  try {
    const res = await API.get(`user/search?user=${query}`);
    const results = subArrays(res.data, 12);
    return results;
  } catch (error) {
    throw error;
  }
};
