import { createHashRouter, RouterProvider } from "react-router-dom";
import Info from "./Components/Info";
import TimeLine from "./Components/TimeLine";
import ContextProvider from "./Context/Context";
import { Context } from "./Context/Context";
import { useContext, useEffect } from "react";

const router = createHashRouter([
  {
    path: "/",
    element: <Info />,
  },
  {
    path: "/timeline",
    element: <TimeLine />,
  },
]);

function Router() {
  const { data, setData, id } = useContext(Context);
  useEffect(() => {
    /* eslint-disable no-undef */
    chrome.tabs
      .query({ active: true, lastFocusedWindow: true })
      .then((tabs) => {
        const url = new URL(tabs[0].url);
        let domain = url.hostname;
        domain = domain.replace(/^www\./i, "");
        let key = `${domain}${id}`;

        chrome.storage.local.get([key]).then((result) => {
          setData(result[key]);
        });
      });
  }, [data, data.alert]);

  return <>{data && <RouterProvider router={router} />}</>;
}

export default Router;
