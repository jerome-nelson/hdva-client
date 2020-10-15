import { useState, useEffect, SetStateAction, Dispatch, useCallback, useContext } from "react";
import axios from "axios";
import querystring from "querystring";

import { ModalContext } from "../components/modal/modal.context";
interface ApiOptions {
    prevent?: boolean, 
    initialDataType?: any, 
    extraHeaders?: Record<string, string> 
}

// TODO: Error boundary of some kind here
export const useAPI = <T>(endpoint: string, defaults?: ApiOptions): [{ data: T[], isLoading: boolean, isError: boolean }, Dispatch<SetStateAction<any>>, Dispatch<SetStateAction<string>>, (payload: any) => void] => {
  const options = {
    extraHeaders: {},
    prevent: false,
    initialDataType: [],
    ...defaults
  };
  
  const modalSettings = useContext(ModalContext);
  const [data, setData] = useState(options.initialDataType);
  const [url, setUrl] = useState(
    endpoint
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (options.prevent) {
        return;
      }

      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url, {
          headers: options.extraHeaders
        });
        setData(result.data);
      } catch (error) {
        modalSettings.updateMessage("Unable to connect to API");
        modalSettings.setModal(true);
        modalSettings.shouldDismiss(false);
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
          'Content-Type': 'application/x-www-form-urlencoded',
          ...options.extraHeaders,
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