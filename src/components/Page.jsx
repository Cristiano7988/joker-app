import { useEffect } from "react";

const createCopy = (type, data, formName) => {
    const form = document.querySelector(`[name=${formName}]`);
    const text = form.querySelector(".form-" + type)?.textContent;
    if (text == "null") return;
    const updatedText = data.reduce((text, item) => {
        const [[key, value]] = Object.entries(item);
        const tag = ["{{$", "}}"].join(key);
        
        return text.replaceAll(tag, value);
    }, text);
    const reference = form.querySelector(".form-" + type + ":not(.copy)");

    const copy = document.createElement(reference.nodeName);
    copy.textContent = updatedText;
    reference.parentNode.insertBefore(copy, reference.nextElementSibling);
    copy.classList.add("form-" + type);
    copy.classList.add("copy");
}


export const Page = ({ page, getResult }) => {
    const handleSubmit = (e) => {
        const form = e.target
        e.preventDefault();

        // Clear errors 
        Array.from(form.querySelectorAll('.input-error')).map(error => error.remove());
        // Clear submit's messages
        form.querySelector(".form-success.copy, .form-error.copy")?.remove();

        // Submit form
        let { action, elements, dataset } = e.target;
        let { content } = dataset;
        const [{ method, filters, store_in }] = JSON.parse(content);
        let config = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        var data = Array.from(elements).map(({name, value}) => (name && value) && ({[name]: value})).filter(Boolean);
        if (method == "GET") {
            const wrappedData = Object.assign({}, ...data, { store_in });
            const params = new URLSearchParams(wrappedData).toString();
            action = action.concat("?" + params);
        } else {
            config.body = {
                store_in,
                filters,
                ...Object.assign(config.body, ...data)
            }
        }

        config.body = JSON.stringify(config.body);

        fetch(action, config)
            .then(r => r.json())
            .then(response => {
                const { errors } = response;

                if (errors) {
                    // Add error messages for each input
                    errors.map(({ extensions, message }) => {
                        const { field, code } = extensions;
                        if (code != "FORBIDDEN" && elements[field]) elements[field].parentElement.innerHTML += `<span class="input-error">${message}</span>`;
                    });
                    getResult([]).then((e) => setTimeout(() => createCopy("error", data, form.name), 100));
                    
                } else {

                    // Clear inputs
                    data.map(element => {
                        const [[key, value]] = Object.entries(element);
                        if (!/store_in/.test(key)) elements[key].value = "";
                    });
                    getResult(response).then((e) => setTimeout(() => createCopy("success", data, form.name), 100));
                }
            })
            .catch(error => {
                console.log(error);
                createCopy("error", data, form.name).then((e) => setTimeout(() => createCopy("success", data, form.name), 100));
            });
    }

    useEffect(() => {
        if (!page) return;

        Array.from(document.querySelectorAll('form')).map(form => {
            form.removeEventListener('submit', handleSubmit);
        });

        Array.from(document.querySelectorAll('form')).map(form => {
            form.addEventListener('submit', handleSubmit);
        });
    }, [page]);
    return <div dangerouslySetInnerHTML={{ __html: page }} />
};
