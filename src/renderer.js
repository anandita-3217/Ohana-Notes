/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

// console.log('👋 This message is being logged by "renderer.js", included via webpack');

function updateDate() {
    const now = new Date();
    
    // Get day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[now.getDay()];
    
    // Get date
    const currentDate = now.getDate();
    
    // Get month
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = months[now.getMonth()];
    
    // Update the HTML elements
    document.getElementById('current-day').textContent = currentDay;
    document.getElementById('current-date').textContent = currentDate;
    document.getElementById('current-month').textContent = currentMonth;
}

// Notes functionality
let notes = [];

// Load notes from localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('stitchNotes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotes();
    }
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('stitchNotes', JSON.stringify(notes));
}

// Add a new note
function addNote() {
    const noteInput = document.getElementById('noteInput');
    const noteText = noteInput.value.trim();
    
    if (noteText === '') {
        // Optional: Add shake animation or show error
        noteInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            noteInput.style.animation = '';
        }, 500);
        return;
    }
    
    const newNote = {
        id: Date.now(),
        text: noteText,
        timestamp: new Date().toLocaleString()
    };
    
    notes.unshift(newNote); // Add to beginning of array
    saveNotes();
    renderNotes();
    
    // Clear input
    noteInput.value = '';
    
    // Optional: Play success sound or animation
    showSuccessAnimation();
}

// Delete a note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
}

// Render all notes
function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';
    
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `
            <button class="delete-note" onclick="deleteNote(${note.id})">×</button>
            <div class="note-content">${escapeHtml(note.text)}</div>
            <span class="note-timestamp">${note.timestamp}</span>
        `;
        
        // Add fade-in animation
        noteElement.style.opacity = '0';
        notesContainer.appendChild(noteElement);
        
        // Trigger animation
        setTimeout(() => {
            noteElement.style.transition = 'opacity 0.3s ease';
            noteElement.style.opacity = '1';
        }, 10);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Show success animation (optional)
function showSuccessAnimation() {
    // You can add a stitch gif animation here
    // For example, show stitch excited gif for a moment
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update date immediately
    updateDate();
    
    // Update date every minute
    setInterval(updateDate, 60000);
    
    // Load saved notes
    loadNotes();
    
    // Add event listeners
    const addButton = document.getElementById('addNoteBtn');
    const noteInput = document.getElementById('noteInput');
    
    addButton.addEventListener('click', addNote);
    
    // Add note on Enter key
    noteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNote();
        }
    });
});

// Add shake animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Export for use in other modules if needed
module.exports = {
    updateDate,
    addNote,
    deleteNote,
    loadNotes
};