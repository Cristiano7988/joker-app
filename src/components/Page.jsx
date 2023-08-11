import { useEffect } from "react";

export const Page = ({ ...page }) => {
  useEffect(() => {
    page.sections.map(({ component: section, props }) => {
      const url = [
        process.env.REACT_APP_LOCAL_NODE_SERVER,
        "content",
        "public",
        "components",
        section.key
      ].join("/");

      fetch(url)
        .then(r => r.json())
        .then((component) => {
          const tags = ['{{', '}}'];
          props?.map(({ key, value }) => component.content = component.content.replaceAll(tags.join(key), value));
          document.querySelector(".contents-of-the-template").innerHTML += (["<style>", "</style>"].join(component.css) + component.content);
        })
        .catch(error => console.log(error));
    });
  }, []);

  return <div className="contents-of-the-template" />;
}
