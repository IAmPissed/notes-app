import { addGlobalEventListener, querySelector, formatDateAndTime, save } from './utils/utils'
import './styles/main.css'

type note = {
    title: string
    content: string
    id: string
    createdAt: string
    updatedAt: string
}

const LOCAL_STORAGE_NOTES_KEY: string = 'notesapp.notes.list'
let notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTES_KEY) || '[]')
let selectedNoteIdForEdit: string|null = null

const overlay = querySelector('[data-overlay]') as HTMLDivElement
const addNoteModal = querySelector('[data-add-note-modal]') as HTMLElement
const notesList = querySelector('[data-notes-list]') as HTMLElement
const addNoteCard = querySelector('.card.add-note') as HTMLElement
const noteItemTemplate = querySelector('[data-note-item-template]') as HTMLTemplateElement
const noteTitleInput = querySelector('[data-note-title-input]') as HTMLInputElement
const noteContentInput = querySelector('[data-note-content-input]') as HTMLTextAreaElement
const previewModal = querySelector('[data-note-preview-modal]') as HTMLElement
const notePreviewTitle = querySelector('[data-note-preview-title]') as HTMLHeadingElement
const notePreviewContent = querySelector('[data-note-preview-content]') as HTMLParagraphElement
const editModal = querySelector('[data-note-edit-modal]') as HTMLElement
const newNoteTitleInput = querySelector('[data-new-note-title-input]') as HTMLInputElement
const newNoteContentInput = querySelector('[data-new-note-content-input]') as HTMLTextAreaElement

const render = () => {
    clearElement(notesList)
    renderNotes()
}
const clearElement = (element: HTMLElement) => {
    while (element.lastElementChild && element.lastElementChild !== addNoteCard) {
        element.removeChild(element.lastElementChild)
    }
}

const renderNotes = () => {
    notes.forEach((note: note) => {
        const noteItem = noteItemTemplate.content.cloneNode(true) as HTMLDivElement
        if (noteItem.firstElementChild instanceof HTMLElement) {
            noteItem.firstElementChild.dataset.noteId = note.id
        }
        const title = noteItem.querySelector('.note-title') as HTMLElement
        const content = noteItem.querySelector('.note-content') as HTMLElement
        const timestamps = noteItem.querySelector('.card-footer') as HTMLElement
        title.innerText = note.title
        content.innerText = note.content
        timestamps.innerText = note.updatedAt
        notesList.append(noteItem)
    })
}

const openCreateNoteModal = () => {
    const scale = '1'
    overlay.style.setProperty('--scale', scale)
    addNoteModal.style.setProperty('--scale', scale)
}

const closeModal = (e: Event)=> {
    const modal = e.target as HTMLElement
    if (isCloseModalButton(e)) {
        overlay.style.setProperty('--scale', '0')
        modal.parentElement?.style.setProperty('--scale', '0')
    }
}
const closeCreateNoteModal = () => {
    overlay.style.setProperty('--scale', '0')
    addNoteModal.style.setProperty('--scale', '0')
}

const isCloseModalButton = (e: Event) => {
    return e.target instanceof HTMLElement && e.target.matches('[data-close-modal-button]')
}


const createNewNote = () => {
    const {title, content} = {title: noteTitleInput.value, content: noteContentInput.value}
    const note = createNote(title, content)
    notes.push(note)
    save(LOCAL_STORAGE_NOTES_KEY, notes)
    render()
    closeCreateNoteModal()
    clearFields()
}

const createNote = (title: string, content: string): note => {
    return {
        id: Date.now().toString(),
        title: title.trim(), 
        content: content.trim(), 
        createdAt: formatDateAndTime(new Date()),
        updatedAt: formatDateAndTime(new Date())
    }
}



const deleteNote = (e: Event) => {
    const element = e.target as HTMLElement
    const noteId = getNoteId(element)
    notes = notes.filter((note: note) => note.id !== noteId)
    save(LOCAL_STORAGE_NOTES_KEY, notes)
    render()
}

const openNote = (e: Event) => {
    const element = e.target as HTMLElement
    const noteId = getNoteId(element)
    const note = notes.find((note: note) => note.id === noteId)
    openPreviewModal(note)
}
const openPreviewModal = (note: note) => {
    notePreviewTitle.innerText = note.title
    notePreviewContent.innerText = note.content
    overlay.style.setProperty('--scale', '1')
    previewModal.style.setProperty('--scale', '1')
}


const openEditModal = (e: Event) => {
    const note: note = getNote(e)
    overlay.style.setProperty('--scale', '1')
    editModal.style.setProperty('--scale', '1')
    newNoteTitleInput.value = note.title
    newNoteContentInput.value = note.content
    selectedNoteIdForEdit = note.id
}
const closeEditModal = () => {
    editModal.style.setProperty('--scale', '0')
    overlay.style.setProperty('--scale', '0')
}
const updateNote = () => {
    let selectedNote = notes.find((note: note) => note.id === selectedNoteIdForEdit)
    let updatedNote: note = { 
        ...selectedNote, 
        title: newNoteTitleInput.value, 
        content: newNoteContentInput.value , 
        updatedAt: formatDateAndTime(new Date())
    }
    notes = notes.filter((note:note) => note.id !== selectedNoteIdForEdit)
    notes.push(updatedNote)
    save(LOCAL_STORAGE_NOTES_KEY, notes)
    render()
}

const getNote = (e: Event): note => {
    const element = e.target as HTMLElement
    const noteId = getNoteId(element)
    return notes.find((note: note) => note.id === noteId)
}

const clearFields = () => {
    noteTitleInput.value = ''
    noteContentInput.value = ''
}

const getNoteId = (element: HTMLElement) => {
    return element.parentElement?.parentElement?.dataset.noteId
}

const areFieldsEmpty = () => {
    return noteTitleInput.value == '' || noteContentInput.value == ''
}

addGlobalEventListener('click', '[data-close-modal-button]', closeModal)
addGlobalEventListener('click', '[data-add-note-button]', openCreateNoteModal)
addGlobalEventListener('click', '[data-overlay]', (e: Event) => {
    overlay.style.setProperty('--scale', '0')
    addNoteModal.style.setProperty('--scale', '0')
    previewModal.style.setProperty('--scale', '0')
    editModal.style.setProperty('--scale', '0')
})
addGlobalEventListener('click', '[data-save-note-button]', () => {
    if (areFieldsEmpty()) return
    createNewNote()
})
addGlobalEventListener('click', '[data-edit-note-button]', (e: Event) => {
    if (newNoteContentInput.value === '' || newNoteTitleInput.value === '') return
    updateNote()
    closeEditModal()
})
addGlobalEventListener('click', '.circle', (e: Event) => {
    if (e.target instanceof HTMLElement && e.target.matches('.delete')) deleteNote(e)
    if (e.target instanceof HTMLElement && e.target.matches('.open')) openNote(e)
    if (e.target instanceof HTMLElement && e.target.matches('.edit')) openEditModal(e)
})


render()