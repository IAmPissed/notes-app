export const addGlobalEventListener = (
    type: string,
    selector: string,
    callback: Function, 
    parent: Document | Window | HTMLElement = document,
    options: {} = {},
) => {
        parent.addEventListener(type, (e) => {
            if(e.target instanceof HTMLElement && e.target.matches(selector)) callback(e)
        }, options)
}

export const querySelector = (selector: string, parent: Document | HTMLElement = document) => {
    return parent.querySelector(selector)
}

export const querySelectorAll = (selector: string, parent: Document | HTMLElement = document) => {
    return [...parent.querySelectorAll(selector)]
}

const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export const formatDateAndTime = (date: Date) => {
    const DAY_OF_WEEK = WEEKDAYS[date.getDay()]
    const DAY_OF_MONTH = date.getDate()
    const YEAR = date.getFullYear()
    const TIME = date.toLocaleString(undefined, { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit'})
    return `${DAY_OF_WEEK}, ${MONTHS[date.getMonth()]} ${DAY_OF_MONTH}, ${YEAR}, at ${TIME}`
}

export const save = (key: string, value: []) => {
    localStorage.setItem(key, JSON.stringify(value))
}
