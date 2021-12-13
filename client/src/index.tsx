import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import chatStore from "stores/store";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

document.body.addEventListener("keydown", function (event) {
  if (event.altKey) {
    switch (event.keyCode) {
      case 67:
        document.getElementById("chat-input")?.focus();
        break;
      case 80:
        window.history.pushState(null, "", "/");
        document.location.reload();
        break;
      case 70:
        window.history.pushState(null, "", "/streams");
        document.location.reload();
        break;
      case 77:
        window.history.pushState(
          null,
          "",
          `/stream/${chatStore.user.streamKey}`
        );
        document.location.reload();
        break;
    }
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
