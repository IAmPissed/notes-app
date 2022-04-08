export const addGlobalEventListener = (type, selector, callback, parent = document, options = {}) => {
    parent.addEventListener(type, (e) => {
        if (e.target instanceof HTMLElement && e.target.matches(selector))
            callback(e);
    }, options);
};
export const querySelector = (selector, parent = document) => {
    return parent.querySelector(selector);
};
export const querySelectorAll = (selector, parent = document) => {
    return [...parent.querySelectorAll(selector)];
};
