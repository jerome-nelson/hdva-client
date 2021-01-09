import axios, { AxiosResponse } from "axios";
import { LoginContext } from "components/login-form/login.context";
import querystring from "querystring";
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { ModalContext } from "../components/modal/modal.context";

interface ApiOptions {
  prevent: boolean,
  useToken: boolean,
  initialDataType: any,
  extraHeaders: Record<string, string>
}

interface APIResponse<T> {
  data: T[];
}

const DEFAULT_OPTIONS = {
  extraHeaders: {},
  useToken: false,
  prevent: false,
  initialDataType: [],
}

// TODO: Simplify API logic state here
//  - Add unit tests to govern logic

interface APIReturnProps<T> { done: boolean, data: T[], isLoading: boolean, isError: boolean, noData: boolean }

export const useAPI = <T>(endpoint: string, options?: Partial<ApiOptions>): [APIReturnProps<T>, Dispatch<SetStateAction<any>>, Dispatch<SetStateAction<string>>, (payload: any) => void] => {
  const settings = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const { user } = useContext(LoginContext);
  const modal = useContext(ModalContext);
  const [url, setUrl] = useState(endpoint);
  const [headers, setHeaders] = useState(settings.extraHeaders);
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
    const empty = !payload || !payload.length;
    setStatus({
      ...status,
      empty
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload])

  useEffect(() => {
    if (settings.useToken && user && user.token) {
      setHeaders({
        ...headers,
        'Authorization': user.token
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      const result = await axios(`${process.env.REACT_APP_API}${url}`, { headers });
      const empty = !result.data.data || !result.data.data.length;
      setStatus({
        ...status,
        empty,
        fatal: [500, 401, 404].includes(result.status)
      });
      if (!empty) {
        addPayload(result.data.data);
      }
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData() }, [url]);

  const callAPI = useCallback(payload => {
    setStatus({
      ...status,
      loading: true
    });
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_API}${url}`,
      data: querystring.stringify(payload),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...headers,
      },
    }).then((res: AxiosResponse<APIResponse<T>>) => {
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
  }, [headers, status, url])

  return [
    {
      data: payload,
      done: status.done,
      isLoading: status.loading,
      isError: status.error || status.fatal,
      noData: status.empty
    },
    addPayload,
    setUrl,
    callAPI
  ];
}