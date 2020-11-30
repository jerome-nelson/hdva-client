import axios from "axios";
import querystring from "querystring";
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { ModalContext } from "../components/modal/modal.context";

interface ApiOptions {
  prevent?: boolean,
  initialDataType?: any,
  extraHeaders?: Record<string, string>
}

interface APIResponse<T> {
  data: {
    data: T[];
  }
}

const DEFAULT_OPTIONS = {
  extraHeaders: {},
  prevent: false,
  initialDataType: [],
}

// TODO: Simplify API logic state here
//  - Add unit tests to govern logic

interface APIReturnProps<T> { done: boolean, data: T[], isLoading: boolean, isError: boolean, noData: boolean }

export const useAPI = <T>(endpoint: string, options?: ApiOptions): [APIReturnProps<T>, Dispatch<SetStateAction<any>>, Dispatch<SetStateAction<string>>, (payload: any) => void] => {
  const settings = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const modal = useContext(ModalContext);
  const [url, setUrl] = useState(endpoint);
  const [payload, addPayload] = useState(settings.initialDataType);

  const [status, setStatus] = useState({
    done: false,
    error: false,
    loading: false,
    fatal: false,
    empty: false,
    attempts: 0
  });

  useEffect(() => {
    setStatus({
      ...status,
      empty: payload.length === 0
    })
  }, [payload])

  const enoughTries = Boolean(status.attempts === 3);
  const fetchData = async () => {
    if (settings.prevent || status.fatal || !url || enoughTries) {
      setStatus({
        ...status,
        error: false,
        empty: true,
        loading: false,
        fatal: enoughTries
      });
      return;
    }

    setStatus({
      ...status,
      error: false,
      loading: true
    });

    try {
      const result = await axios(`${process.env.REACT_APP_API}${url}`, {
        headers: settings.extraHeaders
      });

      setStatus({
        ...status,
        fatal: [500, 401, 404].includes(result.status)
      });
      addPayload(result.data.data);
    } catch (error) {
      modal.updateMessage("Unable to connect to API");
      modal.setModal(true);
      modal.shouldDismiss(false);

      setStatus({
        ...status,
        loading: false,
        error: true,
        empty: true,
      });
    } finally {
      setStatus({
        ...status,
        loading: false,
        done: true
      });
    }

  };

  useEffect(() => { fetchData() }, [url]);

  const callAPI = useCallback(payload => {
    setStatus({
      ...status,
      loading: true
    });

    axios.post(`${process.env.REACT_APP_API}${url}`, querystring.stringify(payload), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...settings.extraHeaders,
      },
    }).then((res: APIResponse<T>) => {
      addPayload(res.data.data);
      setStatus({
        ...status,
        done: true,
        loading: false
      });
    }).catch((error: Error) => {
      console.log(error);
      setStatus({
        ...status,
        empty: true,
        fatal: true,
        error: true,
        loading: false
      });
    })
  }, [settings.extraHeaders, url])

  return [
    {
      data: payload,
      done: status.done,
      isLoading: status.loading,
      isError: status.error || status.fatal,
      noData: status.empty || status.fatal
    },
    addPayload,
    setUrl,
    callAPI
  ];
}