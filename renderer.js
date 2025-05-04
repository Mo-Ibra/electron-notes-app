const { ipcRenderer } = require('electron');
const noteText = document.getElementById('note-text');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');
const notesListDiv = document.getElementById('notes-list');

/**
 * Loads all notes from the main process and displays them in the notes list.
 */
async function loadNotes() {
  const notes = await ipcRenderer.invoke('get-notes');
  notesListDiv.innerHTML = '';
  notes.forEach(note => {
    const div = document.createElement('div');
    div.classList.add('bg-white', 'p-4', 'mb-4', 'rounded-lg', 'shadow');

    // Use the textContent property to display the note content
    div.textContent = note.content;
    notesListDiv.appendChild(div);
  });
};

saveBtn.addEventListener('click', async () => {
  const content = noteText.value.trim()
  if (content) {
    await ipcRenderer.invoke('add-note', content)
    noteText.value = ''
    loadNotes()
  }
});

deleteBtn.addEventListener('click', async () => {
  await ipcRenderer.invoke('delete-notes');
  loadNotes();
});

loadNotes();