import { useState } from "react";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Page } from "./components/Page";

const App = () => {
  const [pages, setPages] = useState();

  useEffect(() => {
    const endpoint = [
      process.env.REACT_APP_LOCAL_NODE_SERVER,
      "content",
      "public",
      "pages"
    ].join("/");

    fetch(endpoint)
      .then(r => r.json())
      .then(pages => setPages(pages))
      .catch(error => console.log(error));
  }, []);

  if (pages) return (
    <BrowserRouter>
      <Routes>
        {pages.map(page => <Route
          key={page.id}
          path={page.slug}
          element={<Page {...page}
          />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
