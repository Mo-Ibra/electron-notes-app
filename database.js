/**
 * Database module for storing and retrieving notes.
 * @module database
 */

const { app } = require('electron');
const path = require('path');
const { LowSync } = require('lowdb');
const { JSONFileSync } = require('lowdb/node');

// Get the user data path and append your custom folder name
const userDataPath = app.getPath('userData');
const dbDirectory = path.join(userDataPath, 'myAppData');

console.log(userDataPath);

// Ensure the folder exists
const fs = require('fs');
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory);
}

const dbPath = path.join(dbDirectory, 'db.json');

// Initialize the adapter with the dbPath
const adapter = new JSONFileSync(dbPath);
const defaultData = { notes: [] };
const db = new LowSync(adapter, defaultData);

// Read data from the JSON file, this will set db.data content
db.read();

// Write default data if the file is empty
if (!db.data) {
  db.data = defaultData;
  db.write();
}

/**
 * Retrieves all notes from the database.
 * @returns {Array<Object>} An array of note objects with properties 'id' and 'content'.
 */
function getAllNotes() {
  // Read the current state of the database from the JSON file
  db.read();

  // Return the array of notes
  return db.data.notes;
}

/**
 * Adds a new note to the database.
 * @param {string} content - The content of the note to add.
 */
function addNote(content) {
  // Read the current state of the database from the JSON file
  db.read();

  // Add the new note to the array of notes
  db.data.notes.push({ id: Date.now(), content });

  // Write the updated data back to the JSON file
  db.write();
}


/**
 * Updates an existing note in the database.
 * @param {number} id - The id of the note to update.
 * @param {string} newContent - The new content of the note.
 */
function updateNote(id, newContent) {
  // Read the current state of the database from the JSON file
  db.read();

  // Find the note to update
  const note = db.data.notes.find((note) => note.id === id);

  // If the note exists, update its content
  if (note) {
    note.content = newContent;

    // Write the updated data back to the JSON file
    db.write();
  }
}

/**
 * Deletes all notes from the database.
 */
function deleteAllNotes() {
  // Read the current state of the database from the JSON file
  db.read();

  // Clear the array of notes
  db.data.notes = [];

  // Write the updated data back to the JSON file
  db.write();
}

module.exports = { getAllNotes, addNote, deleteAllNotes, updateNote };