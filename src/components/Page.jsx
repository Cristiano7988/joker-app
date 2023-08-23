import { useEffect } from "react";

const createCopy = (type, data, form) => {
    const text = form.querySelector(".form-" + type).textContent;
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

export const Page = ({ __html }) => {
    useEffect(() => {
        if (!__html) return;

        Array.from(document.querySelectorAll('form')).map(form => {
            form.addEventListener('submit', e => {
                e.preventDefault();

                // Clear errors 
                Array.from(form.querySelectorAll('.input-error')).map(error => error.remove());
                // Clear submit's messages
                form.querySelector(".form-success.copy, .form-error.copy")?.remove();

                // Submit form
                const { action, method, elements } = e.target;
                const config = { method };
                if (method.toLowerCase() == "post") {
                    var data = Array.from(elements).map(({name, value}) => (name && value) && ({[name]: value})).filter(Boolean);
                    config.body = JSON.stringify(Object.assign({}, ...data));
                    config.headers = { 'Content-Type': 'application/json' };
                }

                fetch(action, config)
                    .then(r => r.json())
                    .then(response => {
                        const { errors } = response;

                        if (errors) {
                            // Add error messages for each input
                            errors.map(({ extensions, message }) => {
                                const { field, code } = extensions;
                                if (code != "FORBIDDEN") elements[field].parentElement.innerHTML += `<span class="input-error">${message}</span>`;
                            });

                            createCopy("error", data, form);
                        } else {
                            createCopy("success", data, form);

                            // Clear inputs
                            data.map(element => {
                                const [[key, value]] = Object.entries(element);
                                if (!/store_in/.test(key)) elements[key].value = "";
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        createCopy("error", data, form);
                    })
            })
        });
    }, [__html]);
    return <div dangerouslySetInnerHTML={{ __html }} />
};
