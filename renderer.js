const { ipcRenderer } = require("electron");
const noteText = document.getElementById("note-text");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const notesListDiv = document.getElementById("notes-list");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

let selectedNoteId = null;
let selectedNoteDiv = null;

/**
 * Loads all notes from the main process and displays them in the notes list.
 */
async function loadNotes() {
  const notes = await ipcRenderer.invoke("get-notes");
  notesListDiv.innerHTML = "";
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.classList.add("p-4", "mb-4", "rounded-lg", "shadow");
    div.classList.remove("bg-blue-100");

    // Use the textContent property to display the note content
    div.textContent = note.content;

    // Add a click event listener to select the note
    div.addEventListener("click", () => {

      if (selectedNoteDiv) {
        selectedNoteDiv.classList.remove("bg-blue-100");
      }

      noteText.value = note.content;
      selectedNoteId = note.id;
      selectedNoteDiv = div;

      div.classList.add("bg-blue-100");

      // Show the cancel edit button
      cancelEditBtn.classList.remove("hidden");
    });

    notesListDiv.appendChild(div);
  });
}

saveBtn.addEventListener("click", async () => {
  const content = noteText.value.trim();
  if (content) {
    if (selectedNoteId) {
      await ipcRenderer.invoke("update-note", selectedNoteId, content);
    } else {
      await ipcRenderer.invoke("add-note", content);
    }
    noteText.value = "";
    selectedNoteId = null;
    cancelEditBtn.classList.add("hidden");
    loadNotes();
  }
});

cancelEditBtn.addEventListener("click", () => {
  selectedNoteId = null;
  cancelEditBtn.classList.add("hidden");
  noteText.value = "";

  // Remove the background color from the selected note
  if (selectedNoteDiv) {
    selectedNoteDiv.classList.remove("bg-blue-100");
  }
});

deleteBtn.addEventListener("click", async () => {
  await ipcRenderer.invoke("delete-notes");
  loadNotes();
});

loadNotes();