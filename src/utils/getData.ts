import { useState, useEffect, SetStateAction, Dispatch } from "react";
const axios = require("axios");

export const useAPI = <T>(endpoint: string): [{ data: T[], isLoading: boolean, isError: boolean }, Dispatch<SetStateAction<T[]>>] => {
  const [data, setData] = useState([] as T[]);
  const [url, setUrl] = useState(
    endpoint
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);
        setData(result.data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }

    };

    fetchData();
  }, [url]);

  return [{ data, isLoading, isError }, setData];
}