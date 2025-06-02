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
    updateClock();

}
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    
    // Add leading zeros
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    // Format time string with optional animation for the colon
    // Using a non-breaking space after each colon for better spacing
    const timeString = `${hours}:${minutes}:${seconds}`;

    // Update clock element
    const clockElement = document.getElementById('digital-clock');
    if (clockElement) {
        clockElement.textContent = timeString;
        
        // Optional: Add blink effect to the colons
        const pulseEffect = Math.floor(now.getSeconds()) % 2 === 0 ? 'pulse' : '';
        clockElement.className = `digital-clock ${pulseEffect}`;
    }
    
    // Update every second
    setTimeout(updateClock, 1000);
}



// Notes and Tasks functionality
let notes = [];
let tasks = {
    total: 0,
    completed: 0,
    categories: {
        notes: { total: 0, completed: 0 },
        tasks: { total: 0, completed: 0 },
        important: { total: 0, completed: 0 }
    }
};


// Load notes from localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('stitchNotes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
    
    const savedTasks = localStorage.getItem('stitchTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        // Initialize task tracking
        countTasksAndUpdateProgress();
    }
    
    renderNotes();
    updateProgressBar();
    setRandomQuote();
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('stitchNotes', JSON.stringify(notes));
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('stitchTasks', JSON.stringify(tasks));
}

// Set a random daily quote
function setRandomQuote() {
    const quoteElement = document.querySelector('.daily-quote');
    if (quoteElement) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteElement.textContent = quotes[randomIndex];
    }
}

// Count tasks and update progress
function countTasksAndUpdateProgress() {
    // Reset counts
    tasks.total = notes.length;
    tasks.completed = notes.filter(note => note.completed).length;
    
    // Reset categories
    tasks.categories = {
        notes: { total: 0, completed: 0 },
        tasks: { total: 0, completed: 0 },
        important: { total: 0, completed: 0 }
    };
    
    // Count by category
    notes.forEach(note => {
        const category = note.category || 'notes';
        tasks.categories[category].total++;
        if (note.completed) {
            tasks.categories[category].completed++;
        }
    });
    
    saveTasks();
    updateProgressBar();
}

// Update progress bar UI
function updateProgressBar() {
    const completedElement = document.querySelector('.completed-tasks');
    const progressBarElement = document.querySelector('.progress-bar');
    const totalTasksElement = document.querySelector('.stat-value:nth-child(1)');
    const completedTasksElement = document.querySelector('.stat-value:nth-child(1) + .stat-label + .stat-value');
    const remainingTasksElement = document.querySelector('.stat-value:nth-child(1) + .stat-label + .stat-value + .stat-label + .stat-value');
    
    if (completedElement && progressBarElement) {
        // Update text
        completedElement.textContent = `${tasks.completed}/${tasks.total} tasks`;
        
        // Update progress bar
        const progressPercentage = tasks.total > 0 ? (tasks.completed / tasks.total) * 100 : 0;
        progressBarElement.style.width = `${progressPercentage}%`;
        
        // Update stats
        if (totalTasksElement) totalTasksElement.textContent = tasks.total;
        if (completedTasksElement) completedTasksElement.textContent = tasks.completed;
        if (remainingTasksElement) remainingTasksElement.textContent = tasks.total - tasks.completed;
    }
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
    
    // Detect category based on content
    let category = 'notes';
    if (noteText.startsWith('!')) {
        category = 'important';
    } else if (noteText.toLowerCase().includes('todo') || 
               noteText.toLowerCase().includes('to do') || 
               noteText.toLowerCase().includes('task')) {
        category = 'tasks';
    }
    
    const newNote = {
        id: Date.now(),
        text: noteText.startsWith('!') ? noteText.substring(1).trim() : noteText,
        timestamp: new Date().toLocaleString(),
        completed: false,
        category: category
    };
    
    notes.unshift(newNote); // Add to beginning of array
    saveNotes();
    
    // Update task tracking
    countTasksAndUpdateProgress();
    renderNotes();
    
    // Clear input
    noteInput.value = '';
    
    // Optional: Play success sound or animation
    showSuccessAnimation();
}

// Toggle task completion
function toggleTaskCompletion(id) {
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].completed = !notes[noteIndex].completed;
        saveNotes();
        countTasksAndUpdateProgress();
        renderNotes();
    }
}

// Make deleteNote global so it can be called from HTML onclick
window.deleteNote = function(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    countTasksAndUpdateProgress();
    renderNotes();
}

// Make toggleTaskCompletion global
window.toggleTaskCompletion = toggleTaskCompletion;

// Filter notes by category
window.filterByCategory = function(category) {
    const allCategories = document.querySelectorAll('.category');
    allCategories.forEach(cat => {
        cat.classList.remove('active');
    });
    
    // Find the clicked category and add active class
    const clickedCategory = Array.from(allCategories).find(
        cat => cat.querySelector('span:last-child').textContent.toLowerCase() === category.toLowerCase()
    );
    
    if (clickedCategory) {
        clickedCategory.classList.add('active');
    }
    
    // If category is 'all', show all notes
    if (category.toLowerCase() === 'all') {
        renderNotes();
        return;
    }
    
    // Filter notes by category
    const filteredNotes = notes.filter(note => note.category === category.toLowerCase());
    renderFilteredNotes(filteredNotes);
}

// Render filtered notes
function renderFilteredNotes(filteredNotes) {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';
    
    if (filteredNotes.length === 0) {
        notesContainer.innerHTML = '<div class="no-notes">No notes in this category</div>';
        return;
    }
    
    filteredNotes.forEach(note => {
        renderNoteElement(note, notesContainer);
    });
}

// Render a single note element
function renderNoteElement(note, container) {
    const noteElement = document.createElement('div');
    noteElement.className = `note-item ${note.category}-category`;
    if (note.completed) {
        noteElement.classList.add('completed');
    }
    
    noteElement.innerHTML = `
        <button class="delete-note" onclick="deleteNote(${note.id})">×</button>
        <div class="note-content ${note.completed ? 'completed-text' : ''}" onclick="toggleTaskCompletion(${note.id})">
            ${note.category === 'tasks' || note.category === 'important' ? 
              `<input type="checkbox" class="task-checkbox" ${note.completed ? 'checked' : ''}>` : ''}
            ${escapeHtml(note.text)}
        </div>
        <div class="note-footer">
            <span class="note-category">${note.category}</span>
            <span class="note-timestamp">${note.timestamp}</span>
        </div>
    `;
    
    // Add fade-in animation
    noteElement.style.opacity = '0';
    container.appendChild(noteElement);
    
    // Trigger animation
    setTimeout(() => {
        noteElement.style.transition = 'opacity 0.3s ease';
        noteElement.style.opacity = '1';
    }, 10);
}

// Render all notes
function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';
    
    if (notes.length === 0) {
        notesContainer.innerHTML = '<div class="no-notes">No notes yet. Add one above!</div>';
        return;
    }
    
    notes.forEach(note => {
        renderNoteElement(note, notesContainer);
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
    
    // Initialize category buttons
    const categoryButtons = document.querySelectorAll('.category');
    categoryButtons.forEach(button => {
        const categoryName = button.querySelector('span:last-child').textContent.toLowerCase();
        button.addEventListener('click', () => {
            filterByCategory(categoryName);
        });
    });
});

// Add animations keyframes
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
    
    .category.active {
        background-color: var(--primary-purple);
        color: white;
    }
    
    .note-item.completed {
        border-left: 4px solid var(--dark-purple);
        opacity: 0.8;
    }
    
    .completed-text {
        text-decoration: line-through;
        color: var(--text-secondary);
    }
    
    .tasks-category {
        border-left: 4px solid var(--dark-blue);
    }
    
    .important-category {
        border-left: 4px solid var(--dark-purple);
    }
    
    .notes-category {
        border-left: 4px solid var(--medium-purple);
    }
    
    .note-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 12px;
    }
    
    .note-category {
        text-transform: capitalize;
        color: var(--dark-purple);
        font-weight: 500;
    }
    
    .task-checkbox {
        margin-right: 8px;
        cursor: pointer;
    }
    
    .no-notes {
        text-align: center;
        color: var(--text-secondary);
        padding: 20px;
    }
`;
document.head.appendChild(style);

// Export for use in other modules if needed
module.exports = {
    updateDate,
    addNote,
    deleteNote,
    loadNotes,
    toggleTaskCompletion,
    filterByCategory
};
// change AddNotes to let the user specify the type of note or task or stuff. For task let the note displayed have a functionaity to choose 
// frequency of the task daily , weekly, bi weekly or monthly
// let the tasks have the prgress bar alone and only daily tasks get deleted everyday at 12:00 ist others wvery week 2 weeks and month. when 
// user says completed task on;y then is the task complete and the progress increases.
// allow u to make tasks for future date by  clicking on the date-div open a calendar modal and choose the date on which you want to create the task.
// make a digital clock under the the date of the date div

// Im trying i really am thisis just to maintain mystreak :(