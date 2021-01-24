import { ThemeProvider } from '@material-ui/core';
import 'fontsource-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import { App } from "./app";
import './index.css';
import * as serviceWorker from './serviceWorker';
import { theme } from "./theme";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 60 * 24,
      cacheTime: 1000 * 60 * 60 * 24
    }
  }
});

// TODO: Integrate all theme colours into theme override
ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
