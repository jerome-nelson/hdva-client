import { ErrorBoundary, init } from "@sentry/react";
// import { createBrowserHistory } from "history";
// import { Integrations } from '@sentry/tracing';
import { gtmOverview } from 'config/analytics';
import 'fontsource-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import TagManager from "react-gtm-module";
import { App } from "./app";
import './index.css';
import * as serviceWorker from './serviceWorker';

// export const browserHistory = createBrowserHistory();

// TODO: Setup Releases and Commit Logging
init({
  dsn: process.env.REACT_APP_SENTRY_ID,
  environment: process.env.REACT_APP_ENV || "development",
  // integrations: [
  //   new Integrations.BrowserTracing({
  //     routingInstrumentation: reactRouterV5Instrumentation(browserHistory),
  //   })
  // ],
  debug: Boolean(process.env.REACT_APP_DEBUG),
  tracesSampleRate: 1.0,
});


TagManager.initialize({
  gtmId: gtmOverview.id,
  dataLayer: {
    brand: gtmOverview.brand
  }
});

// TODO: Integrate all theme colours into theme override
ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary showDialog fallback={"An error has occurred"}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
