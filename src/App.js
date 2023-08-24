import { useEffect, useState } from "react";
import { Page } from "./components/Page";

const handleSection = async (type, key, props, nestedPage) => {
  const updatedSection = await new Promise(resolveSection => {
    const url = [
      process.env.REACT_APP_LOCAL_NODE_SERVER,
      "content",
      "public",
      type,
      key
    ].join("/");

    fetch(url)
      .then(r => r.json())
      .then(async ({ data, content }) => {
        
        // Here we update the content inside the scope of the custom tag
        if (data) content = await new Promise(async resolve => {
          const updatedContent = await handleData(data, content, props);
          resolve(updatedContent);
        });

        // Here we update the content outside the scope of the custom tag (based in the props passed in Templates Collection)
        const tags = ['{{$', '}}'];
        props?.map(({ key, value }) => content = content.replaceAll(tags.join(key), value));

        if (nestedPage) {
          nestedPage = Object.entries(nestedPage).map(([key, value]) => ({ [key]: value }));
          content = nestedPage.reduce((updatedText, item) => {
            const [[key, value]] = Object.entries(item);
            const tag = ["{{$", "}}"].join(key);
            return updatedText.replaceAll(tag, value);
          }, content);
        }

        resolveSection(content);
      })
      .catch(error => console.log(error));
  })

  return updatedSection;
}

const updateNewText = (data, text) => {
  if (!data) return text;

  const response = data.map(item => {
    let textWithData = Object.getOwnPropertyNames(item);

    textWithData = textWithData.reduce((currentValue, nextKey) => {
      const regex = new RegExp(`({{\\$${nextKey}}})`, 'g');
      return currentValue.replaceAll(regex, item[nextKey]);
    }, text);

    return textWithData;
  });

  return response.join("");
}

const handleData = async (array, defaultText, props) => {
  const contentsCollections = [];

  const data = await new Promise(resolve => {
    array.map(({ name, source, filters, pre_code, code }, index) => {
      try {
        eval(pre_code);
      } catch (error) {
        console.log(error);
        return resolve("");
      }

      const url = [
        process.env.REACT_APP_LOCAL_NODE_SERVER,
        "collections",
        source
      ].join("/");

      if (!filters) filters = [{ key: "status", value: "published",  condition: "_eq" }];

      fetch(url, {
        method: "POST",
        body: JSON.stringify(filters),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(r => r.json())
        .then(data => {
          if (source == "forms") defaultText = defaultText.replace("<form", `<form data-content='${JSON.stringify(data)}'`);

          if (code?.match(`dataComingFromTheCollection`)) {
            code = code.replace('`dataComingFromTheCollection`', JSON.stringify(data));
            data = eval(code);
          }

          contentsCollections[source] = data;
          if ((array.length - 1) == index) resolve(contentsCollections);
        });
    });
  });

  let newText = array.reduce((updatedText, { source, name }) => {
    const customtag = new RegExp(`<${name}>([\\s\\S]*?)<\/${name}>`, 'g');
    let scopes = updatedText.split(customtag);
    
    return scopes.map((text, index) => index % 2 == 1 ? updateNewText(data[source], text) : text).join("");
  }, defaultText);

  return newText;
}

const App = () => {
  const [page, setPage] = useState("");
  useEffect(() => {

    let [parent = 'home', nestedPage] = window.location.pathname.split("/").filter(Boolean);

    nestedPage = nestedPage
      ? ['nestedPage', nestedPage].join("=")
      : "";

    const url = [
      process.env.REACT_APP_LOCAL_NODE_SERVER,
      "page",
      [parent, nestedPage].join("?")
    ].join("/");

    fetch(url)
      .then(r => r.json())
      .then(page => {
        const sections = [];
        page.sections.map(async (section, sectionIndex) => {
          const [property] = Object.getOwnPropertyNames(section).filter(item => item != 'props');

          let sectionUpdated = await handleSection(property.concat("s"), section[property].key, section.props, page.nestedPage);

          sections[sectionIndex] = sectionUpdated;
          setPage(sections.join(""));
        });
      })
      .catch(error => {
        console.log({ error })
      })
    
  }, []);

  if (page) return <Page __html={page} />
}

export default App;
