import axios, { AxiosResponse } from "axios";
import { LoginContext } from "components/login-form/login.context";
import { ModalContext } from "components/modal/modal.context";
import querystring from "querystring";
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";

interface ApiOptions {
  download?: boolean;
  prevent: boolean,
  useToken: boolean,
  token?: string | null,
  initialDataType: any,
  extraHeaders: Record<string, string>;
}

interface APIResponse<T> {
  data: T[];
}

const DEFAULT_OPTIONS = {
  extraHeaders: {},
  useToken: false,
  token: null,
  prevent: false,
  initialDataType: [],
}

// TODO: Simplify API logic state here
//  - Add unit tests to govern logic

interface APIReturnProps<T> { done: boolean, data: T[], isLoading: boolean, isError: boolean, noData: boolean }

export const useAPI = <T>(
  endpoint: string, 
  options?: Partial<ApiOptions>
): [APIReturnProps<T>, Dispatch<SetStateAction<any>>, Dispatch<SetStateAction<string>>, (payload: any) => void] => {

  // 1. Merge Settings
  const settings = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  // 2. Context for Authentication
  // 2i. Context for Modal
  const { user } = useContext(LoginContext);
  const modal = useContext(ModalContext);
  
  const [url, setUrl] = useState(endpoint);
  // TODO: Type with Header Typing
  const [headers, setHeaders] = useState<any>(settings.extraHeaders);
  const [payload, addPayload] = useState(settings.initialDataType);

  const [status, setStatus] = useState({
    code: 200,
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
  
  }, [payload])

  useEffect(() => {
    if (settings.useToken && user && user.token) {
      setHeaders({
        ...headers,
        'Authorization': user.token
      });
    }
  
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
        code: result.status,
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

  useEffect(() => { 
    if (settings.useToken && user && user.token && headers && headers.Authorization) {
      fetchData(); 
    }
    
  }, [headers]);

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
        'Authorization': user && user.token,
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
      setStatus({
        ...status,
        empty: true,
        fatal: true,
        error: true,
        loading: false
      });
    })
  }, [headers, status, url, user])

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

export const putAPI = async <T>(
  endpoint: string, 
  payload?: any, 
  options?: Partial<ApiOptions>,
): Promise<T[]> => {
  const { data: { data } } = await axios({
    method: 'put',
    url: `${process.env.REACT_APP_API}${endpoint}`,
    data: payload,
    headers: {
      'Content-Type': 'application/octet-stream',
      ...options?.extraHeaders
    }
  });
  return data;
}

export const postAPI = async <T>(
  endpoint: string, 
  payload?: any, 
  options?: Partial<ApiOptions>,
): Promise<T[]> => {
  const { data: { data } } = await axios({
    method: 'post',
    url: `${process.env.REACT_APP_API}${endpoint}`,
    data: payload && querystring.stringify(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(options && options.token) ? {
        'Authorization': options && options.token, 
      } : {},
    },
  });
  return data;
}

export const getAPI = async <T>(
  endpoint: string, 
  options?: Partial<ApiOptions>,
): Promise<T[]> => {
  const { data: { data } } = await axios(`${process.env.REACT_APP_API}${endpoint}`, { 
    ...(options && options.download) ? { responseType: "blob" } : {},
    headers: {
    'Authorization': options!.token, 
  }})
  return data;
}

export const getDownload = async <T>(
  endpoint: string, 
  filename: string
): Promise<void> => {
  const { data } = await axios(endpoint, { 
    method: "GET",
    responseType: "blob"
})


  const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); //or any other extension
    document.body.appendChild(link);
    link.click();
    return;
}