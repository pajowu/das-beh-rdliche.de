import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Index from "./routes/Index";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { register as registerServiceWorker } from "./serviceWorkerRegistration";
import Information from "./routes/Information";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/details/:address" element={<Information />} />
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);

registerServiceWorker({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", (event) => {
        // See https://github.com/microsoft/TypeScript/issues/37842
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (event?.target?.state === "activated") {
          window.location.reload();
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  },
});
