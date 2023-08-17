import { useEffect } from "react";

const handleSection = async (type, key, props) => {
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
          const updatedContent = await handleData(data, content);
          resolve(updatedContent);
        });

        // Here we update the content outside the scope of the custom tag (based in the props passed in Templates Collection)
        const tags = ['{{$', '}}'];
        props?.map(({ key, value }) => content = content.replaceAll(tags.join(key), value));

        resolveSection(content);
      })
      .catch(error => console.log(error));
  })

  return updatedSection;
}

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

  const newText = array.reduce((updatedText, { source, name }) => {
    const customtag = new RegExp(`<${name}>([\\s\\S]*?)<\/${name}>`, 'g');
    let scopes = updatedText.split(customtag);

    return scopes.map((text, index) => index % 2 == 1 ? updateNewText(data[source], text) : text).join("");
  }, defaultText);

  return newText;
}

export const Page = ({ ...page }) => {
  useEffect(() => {
    document.querySelector(".contents-of-the-template").innerHTML = "";

    const sections = [];
    page.sections.map(async (section, sectionIndex) => {
      const [property] = Object.getOwnPropertyNames(section);

      let sectionUpdated = await handleSection(property.concat("s"), section[property].key, section.props);

      sections[sectionIndex] = sectionUpdated;
      document.querySelector(".contents-of-the-template").innerHTML = sections.join("");
    });
  }, []);

  return <div className="contents-of-the-template" />;
}
