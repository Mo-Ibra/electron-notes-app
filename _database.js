/***
 * This file for SQL Database
 * 
 * I won't use it anymore because::
 * 
 * The rebuild failed because Electron couldn’t download the required headers from its servers
 * the error socket hang up typically means a network issue, proxy, or firewall problem.
 */

const Database = require('better-sqlite3');
const db = new Database('notes.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
  )
`).run();

/**
 * Retrieves all the notes from the database.
 * @returns {Array<Object>|null} An array of objects with the properties 'id' and 'content', or null if an error occurs.
 */
function getAllNotes() {
  try {
    return db.prepare(`SELECT * FROM notes`).all();
  } catch (error) {
    console.error("Error retrieving notes:", error);
    return null;
  }
}

/**
 * Adds a new note to the database.
 * @param {string} content - The content of the note to be added.
 * @returns {object|null} The result of the insert operation or null if an error occurs.
 */
function addNote(content) {
  if (!content) {
    console.error("Note content cannot be empty.");
    return null;
  }

  try {
    // Insert the note content into the 'notes' table
    return db.prepare(`INSERT INTO notes (content) VALUES (?)`).run(content);
  } catch (error) {
    console.error("Error adding note to the database:", error);
    return null;
  }
}

/**
 * Deletes a note from the database by its ID.
 * @param {number} id - The ID of the note to be deleted.
 * @returns {object|null} The result of the delete operation or null if an error occurs.
 */
function deleteNote(id) {
  try {
    return db.prepare(`DELETE FROM notes WHERE id = ?`).run(id);
  } catch (error) {
    console.error("Error deleting note from the database:", error);
    return null;
  }
}

module.exports = { getAllNotes, addNote, deleteNote };