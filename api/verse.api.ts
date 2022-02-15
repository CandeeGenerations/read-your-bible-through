import axios from "axios";

const headers = {
  "api-key": process.env.NEXT_PUBLIC_BIBLE_API_KEY
};

export const getBooks = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BIBLE_API_URL}/bibles/${process.env.NEXT_PUBLIC_BIBLE_ID}/books`, {
    params: {
      "include-chapters": true
    },
    headers
  });

  return response.data.data;
};
