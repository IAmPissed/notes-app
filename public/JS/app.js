import { addGlobalEventListener, querySelector, formatDateAndTime, save } from './utils/utils.js';
const LOCAL_STORAGE_NOTES_KEY = 'notesapp.notes.list';
let notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTES_KEY) || '[]');
let selectedNoteIdForEdit = null;
const overlay = querySelector('[data-overlay]');
const addNoteModal = querySelector('[data-add-note-modal]');
const notesList = querySelector('[data-notes-list]');
const addNoteCard = querySelector('.card.add-note');
const noteItemTemplate = querySelector('[data-note-item-template]');
const noteTitleInput = querySelector('[data-note-title-input]');
const noteContentInput = querySelector('[data-note-content-input]');
const previewModal = querySelector('[data-note-preview-modal]');
const notePreviewTitle = querySelector('[data-note-preview-title]');
const notePreviewContent = querySelector('[data-note-preview-content]');
const editModal = querySelector('[data-note-edit-modal]');
const newNoteTitleInput = querySelector('[data-new-note-title-input]');
const newNoteContentInput = querySelector('[data-new-note-content-input]');
const render = () => {
    clearElement(notesList);
    renderNotes();
};
const clearElement = (element) => {
    while (element.lastElementChild && element.lastElementChild !== addNoteCard) {
        element.removeChild(element.lastElementChild);
    }
};
const renderNotes = () => {
    notes.forEach((note) => {
        const noteItem = noteItemTemplate.content.cloneNode(true);
        if (noteItem.firstElementChild instanceof HTMLElement) {
            noteItem.firstElementChild.dataset.noteId = note.id;
        }
        const title = noteItem.querySelector('.note-title');
        const content = noteItem.querySelector('.note-content');
        const timestamps = noteItem.querySelector('.card-footer');
        title.innerText = note.title;
        content.innerText = note.content;
        timestamps.innerText = note.updatedAt;
        notesList.append(noteItem);
    });
};
const openCreateNoteModal = () => {
    const scale = '1';
    overlay.style.setProperty('--scale', scale);
    addNoteModal.style.setProperty('--scale', scale);
};
const closeModal = (e) => {
    var _a;
    const modal = e.target;
    if (isCloseModalButton(e)) {
        overlay.style.setProperty('--scale', '0');
        (_a = modal.parentElement) === null || _a === void 0 ? void 0 : _a.style.setProperty('--scale', '0');
    }
};
const closeCreateNoteModal = () => {
    overlay.style.setProperty('--scale', '0');
    addNoteModal.style.setProperty('--scale', '0');
};
const isCloseModalButton = (e) => {
    return e.target instanceof HTMLElement && e.target.matches('[data-close-modal-button]');
};
const createNewNote = () => {
    const { title, content } = { title: noteTitleInput.value, content: noteContentInput.value };
    const note = createNote(title, content);
    notes.push(note);
    save(LOCAL_STORAGE_NOTES_KEY, notes);
    render();
    closeCreateNoteModal();
    clearFields();
};
const createNote = (title, content) => {
    return {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        createdAt: formatDateAndTime(new Date()),
        updatedAt: formatDateAndTime(new Date())
    };
};
const deleteNote = (e) => {
    const element = e.target;
    const noteId = getNoteId(element);
    notes = notes.filter((note) => note.id !== noteId);
    save(LOCAL_STORAGE_NOTES_KEY, notes);
    render();
};
const openNote = (e) => {
    const element = e.target;
    const noteId = getNoteId(element);
    const note = notes.find((note) => note.id === noteId);
    openPreviewModal(note);
};
const openPreviewModal = (note) => {
    notePreviewTitle.innerText = note.title;
    notePreviewContent.innerText = note.content;
    overlay.style.setProperty('--scale', '1');
    previewModal.style.setProperty('--scale', '1');
};
const openEditModal = (e) => {
    const note = getNote(e);
    overlay.style.setProperty('--scale', '1');
    editModal.style.setProperty('--scale', '1');
    newNoteTitleInput.value = note.title;
    newNoteContentInput.value = note.content;
    selectedNoteIdForEdit = note.id;
};
const closeEditModal = () => {
    editModal.style.setProperty('--scale', '0');
    overlay.style.setProperty('--scale', '0');
};
const updateNote = () => {
    let selectedNote = notes.find((note) => note.id === selectedNoteIdForEdit);
    let updatedNote = Object.assign(Object.assign({}, selectedNote), { title: newNoteTitleInput.value, content: newNoteContentInput.value, updatedAt: formatDateAndTime(new Date()) });
    notes = notes.filter((note) => note.id !== selectedNoteIdForEdit);
    notes.push(updatedNote);
    save(LOCAL_STORAGE_NOTES_KEY, notes);
    render();
};
const getNote = (e) => {
    const element = e.target;
    const noteId = getNoteId(element);
    return notes.find((note) => note.id === noteId);
};
const clearFields = () => {
    noteTitleInput.value = '';
    noteContentInput.value = '';
};
const getNoteId = (element) => {
    var _a, _b;
    return (_b = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.dataset.noteId;
};
const areFieldsEmpty = () => {
    return noteTitleInput.value == '' || noteContentInput.value == '';
};
addGlobalEventListener('click', '[data-close-modal-button]', closeModal);
addGlobalEventListener('click', '[data-add-note-button]', openCreateNoteModal);
addGlobalEventListener('click', '[data-overlay]', (e) => {
    overlay.style.setProperty('--scale', '0');
    addNoteModal.style.setProperty('--scale', '0');
    previewModal.style.setProperty('--scale', '0');
    editModal.style.setProperty('--scale', '0');
});
addGlobalEventListener('click', '[data-save-note-button]', () => {
    if (areFieldsEmpty())
        return;
    createNewNote();
});
addGlobalEventListener('click', '[data-edit-note-button]', (e) => {
    if (newNoteContentInput.value === '' || newNoteTitleInput.value === '')
        return;
    updateNote();
    closeEditModal();
});
addGlobalEventListener('click', '.circle', (e) => {
    if (e.target instanceof HTMLElement && e.target.matches('.delete'))
        deleteNote(e);
    if (e.target instanceof HTMLElement && e.target.matches('.open'))
        openNote(e);
    if (e.target instanceof HTMLElement && e.target.matches('.edit'))
        openEditModal(e);
});
render();
