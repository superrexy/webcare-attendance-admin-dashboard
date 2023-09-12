import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./providers/Auth/AuthContext";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import queryString from "query-string";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <QueryParamProvider
      adapter={ReactRouter6Adapter}
      options={{
        searchStringToObject: queryString.parse,
        objectToSearchString: queryString.stringify,
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryParamProvider>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </BrowserRouter>
);
