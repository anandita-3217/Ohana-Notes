import './index.css';
import stitchIcon from './assets/images/stitch-icon.png';


// Theme functionality
function initTheme() {
    const savedTheme = localStorage.getItem('stitchTheme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stitchTheme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.checked = theme === 'dark';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Date and time functionality
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

// Make deleteNote global so it can be called from HTML onclick
window.deleteNote = function(id) {
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
    // Initialize theme
    initTheme();
    
    // Update date immediately
    updateDate();
    
    // Update date every minute
    setInterval(updateDate, 60000);
    
    // Load saved notes
    loadNotes();
    
    // Add event listeners
    const addButton = document.getElementById('addNoteBtn');
    const noteInput = document.getElementById('noteInput');
    const themeToggle = document.getElementById('themeToggle');
    
    addButton.addEventListener('click', addNote);
    themeToggle.addEventListener('change', toggleTheme);
    
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