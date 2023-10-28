import { createHashRouter, RouterProvider } from "react-router-dom";
import Info from "./Components/Info";
import TimeLine from "./Components/TimeLine";
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
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url);
          let domain = url.hostname;
          domain = domain.replace(/^www\./i, "");

          if (
            !tabs[0].url.startsWith("http://") &&
            !tabs[0].url.startsWith("https://")
          ) {
            const parts = tabs[0].url.split("://");
            if (parts.length > 1) {
              domain = parts[0];
            }
          }
          const key = `${id}_${domain}`;
          
          chrome.storage.local.get([key]).then((result) => {
            setData(result[key]);
          });
        }
      });
  }, [data, data?.alert]);

  return <>{data && <RouterProvider router={router} />}</>;
}

export default Router;
