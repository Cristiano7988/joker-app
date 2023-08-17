import { useEffect } from "react";

const updateNewText = (data, text) => {
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

const handleData = async (array, defaultText) => {
  const contentsCollections = [];

  const data = await new Promise(resolve => {
    array.map(({ source }, index) => {
      const url = [
        process.env.REACT_APP_LOCAL_NODE_SERVER,
        "collections",
        source
      ].join("/"); 

      fetch(url)
        .then(r => r.json())
        .then(data => {
          contentsCollections[source] = data;
          if ((array.length - 1) == index) resolve(contentsCollections);
        });
    });
  });

  const newText = array.reduce(( template, { source, name }) => {
    const tag = new RegExp(`<${name}>([\\s\\S]*?)<\/${name}>`, 'g');
    let scopes = template.split(tag);

    return scopes.map((text, index) => index % 2 == 1 ? updateNewText(data[source], text) : text).join("");
  }, defaultText);

  return newText;
}

export const Page = ({ ...page }) => {
  useEffect(() => {
    document.querySelector(".contents-of-the-template").innerHTML = "";

    const sections = [];
    page.sections.map(async (section, sectionIndex) => {
      const { component, module } = section;
      const newSection = await new Promise(resolveSection => {
        if (component) {
          const url = [
            process.env.REACT_APP_LOCAL_NODE_SERVER,
            "content",
            "public",
            "components",
            component.key
          ].join("/");

          fetch(url)
            .then(r => r.json())
            .then(component => {
              const tags = ['{{$', '}}'];
              section?.props?.map(({ key, value }) => component.content = component.content.replaceAll(tags.join(key), value));
              resolveSection(component.content);
            })
            .catch(error => console.log(error));

        } else if (module) {
          const url = [
            process.env.REACT_APP_LOCAL_NODE_SERVER,
            "content",
            "public",
            "modules",
            module.key
          ].join("/");

          fetch(url)
            .then(r => r.json())
            .then(async ({ data, content }) => {
              const moduleUpdated = await new Promise(async resolve => {
                const updatedContent = await handleData(data, content);
                resolve(updatedContent);
              });
              resolveSection(moduleUpdated);
            })
            .catch(error => console.log(error));
        }
      });

      sections[sectionIndex] = newSection;
      document.querySelector(".contents-of-the-template").innerHTML = sections.join("");
    });
  }, []);

  return <div className="contents-of-the-template" />;
}
