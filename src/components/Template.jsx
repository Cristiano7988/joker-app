import { useState } from "react";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Page } from "./Page";

export const Template = () => {
  const [pages, setPages] = useState();

  useEffect(() => {
    const endpoint = [
      process.env.REACT_APP_LOCAL_NODE_SERVER,
      "content",
      "public"
    ].join("/");

    fetch(endpoint)
      .then(r => r.json())
      .then(pages => {

        pages = pages.map(page => ({
          slug: page.title.toLowerCase().replaceAll(" ", "-").normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
          ...page
        }));
        setPages(pages);
      })
      .catch(error => console.log(error));
  }, []);

  return pages && <>
    <header className="App-header">
      {pages.map(({ id, slug, title }) => <a
        key={id}
        href={slug}
        children={title}
        className="App-link"
      />)}
    </header>

    <BrowserRouter>
      <Routes>
        {pages.map(page => <Route
          key={page.id}
          path={page.slug}
          element={<Page page={page}
          />} />
        )}
      </Routes>
    </BrowserRouter>
  </>
}
