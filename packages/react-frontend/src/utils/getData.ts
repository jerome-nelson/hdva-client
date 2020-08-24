import { useState, useEffect, SetStateAction, Dispatch, useCallback } from "react";
import axios from "axios";
import querystring from "querystring";

export const useAPI = <T>(endpoint: string, prevent: boolean = false, initialDataType: any = []): [{ data: T[], isLoading: boolean, isError: boolean }, Dispatch<SetStateAction<any>>, Dispatch<SetStateAction<string>>, (payload: any) => void] => {
  const [data, setData] = useState(initialDataType);
  const [url, setUrl] = useState(
    endpoint
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (prevent) {
        return;
      }

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

  const callAPI = useCallback(payload => {
    setIsLoading(true);
    axios.post(url, querystring.stringify(payload),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }).then(res => {
      setData(res.data);
      setIsLoading(false);
    }).catch((error: any) => {
      console.log(error);
      setIsError(true);
      setIsLoading(false);
    })
  }, [url])

  return [{ data, isLoading, isError }, setData, setUrl, callAPI];
}