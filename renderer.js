const { ipcRenderer } = require("electron");
const Toastify = require("toastify-js");
const noteText = document.getElementById("note-text");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const notesListDiv = document.getElementById("notes-list");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

let selectedNoteId = null;
let selectedNoteDiv = null;

/**
 * Displays a toast notification with a custom message and type.
 * @param {string} message - The message to display in the toast.
 * @param {string} [type="info"] - The type of toast ('success', 'error', 'info') which determines the background color.
 */
function toast(message, type = "info") {
  
  // Determine the background color based on the type of toast
  const bgColor = {
    success: "#22c55e", // Green for success
    error: "#ef4444",   // Red for error
    info: "#3b82f6",    // Blue for info
  }[type] || "#3b82f6"; // Default to blue if type is not recognized

  // Use Toastify to create and show the toast notification
  Toastify({
    text: message,         // Message to display
    duration: 3000,        // Duration in milliseconds
    gravity: "top",        // Position of the toast ('top' or 'bottom')
    position: "right",     // Horizontal position ('left', 'center', 'right')
    backgroundColor: bgColor, // Background color of the toast
    stopOnFocus: true,     // Prevents dismissing of toast on hover
  }).showToast();
}

/**
 * Loads all notes from the main process and displays them in the notes list.
 * Each note is added as a clickable div element.
 * When a note is clicked, it highlights the note, pre-fills the textarea with its content,
 * and displays the cancel edit button.
 */
async function loadNotes() {
  // Retrieve all notes from the main process
  const notes = await ipcRenderer.invoke("get-notes");

  // Clear the current notes list
  notesListDiv.innerHTML = "";

  // Iterate through each note and create a corresponding div element
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.classList.add("p-4", "mb-4", "rounded-lg", "shadow");

    // Initially, remove any highlight from the note
    div.classList.remove("bg-blue-100");

    // Set the note content as the text of the div
    div.textContent = note.content;

    // Add a click event listener to handle note selection
    div.addEventListener("click", () => {
      // Remove highlight from any previously selected note
      if (selectedNoteDiv) {
        selectedNoteDiv.classList.remove("bg-blue-100");
      }

      // Fill the textarea with the selected note's content
      noteText.value = note.content;

      // Update the selected note's ID and reference
      selectedNoteId = note.id;
      selectedNoteDiv = div;

      // Highlight the selected note
      div.classList.add("bg-blue-100");

      // Display the cancel edit button
      cancelEditBtn.classList.remove("hidden");
    });

    // Append the created div to the notes list
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
    await loadNotes();
    toast(selectedNoteId ? "Note updated!" : "Note saved!", "success");
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
  await loadNotes();
  toast("Notes deleted!", "success");
});

loadNotes();