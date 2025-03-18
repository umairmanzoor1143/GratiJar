// DOM Elements
const gratitudeInput = document.getElementById('gratitude-input');
const saveBtn = document.getElementById('save-btn');
const currentDateEl = document.getElementById('current-date');
const dateTextEl = currentDateEl.querySelector('.date-text');
const jarFillLevel = document.getElementById('jar-fill-level');
const notesContainer = document.getElementById('notes-container');
const jarCountEl = document.getElementById('jar-count');
const shuffleBtn = document.getElementById('shuffle-btn');
const charCountEl = document.getElementById('char-count');
const exportBtn = document.getElementById('export-btn');
const clearBtn = document.getElementById('clear-btn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const confettiContainer = document.getElementById('confetti-container');
const appreciationToast = document.getElementById('appreciation-toast');
const jarBody = document.querySelector('.jar-body');
const suggestionsListEl = document.getElementById('suggestions-list');
const reloadSuggestionsBtn = document.getElementById('reload-suggestions');

// Constants
const MAX_JAR_CAPACITY = 30; // Number of notes to fill the jar
const NOTE_COLORS = ['#f0abfc', '#c084fc', '#a78bfa', '#818cf8', '#60a5fa'];
const STORAGE_KEY = 'gratijar_notes';
const MAX_CHARS = 200;
const EMOJIS = ['✨', '🌟', '💫', '⭐', '🙏', '💖', '🌈', '🌻', '🌞', '🦋'];
const APPRECIATION_MESSAGES = [
  { title: "Wonderful! ✨", message: "One more moment of gratitude in your collection!" },
  { title: "Beautiful! 🌟", message: "Your jar is filling with positive energy!" },
  { title: "Fantastic! 💫", message: "Taking time for gratitude changes everything!" },
  { title: "Amazing! 🌈", message: "You're building a treasure of beautiful memories!" },
  { title: "Brilliant! 💖", message: "Every note adds to your happiness journey!" },
  { title: "Awesome! ⭐", message: "Your future self will thank you for this!" },
  { title: "Excellent! 🌻", message: "Small moments of gratitude create big joy!" },
  { title: "Magnificent! 🦋", message: "Your gratitude practice is blossoming!" }
];

// Helper emojis for different types of gratitude prompts
const GRATITUDE_EMOJIS = {
  "help": ["🤝", "🙌", "🧠", "💪", "🔆", "🌟", "💡", "🌈", "💖", "🙏"],
  "kindness": ["💕", "🫂", "💝", "💞", "🤗", "💓", "👋", "🌻", "🌷", "🍀"],
  "growth": ["🌱", "🚀", "📈", "🌞", "📚", "🧩", "✨", "🔍", "🎯", "💭"],
  "self": ["🧘", "💆", "🌿", "🍃", "☕", "🫖", "🧠", "💫", "🦋", "🍵"],
  "nature": ["🌳", "🌊", "🏞️", "🦜", "🐝", "🌸", "☀️", "🌙", "🌿", "🍂"]
};

// OpenAI API configuration
const OPENAI_API_KEY = 'sk-proj-EKl6QzNoRk3dFhtiJtl7T3BlbkFJu29kXbxBsZRcqmz6PCwd';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// State
let notes = [];
let isShuffling = false;
let todayStr = formatDate(new Date());
let currentSuggestions = [];
let selectedSuggestion = null;
let isLoadingSuggestions = false;

// Initialize App
function init() {
  // Load notes from localStorage
  loadNotes();
  
  // Display current date
  updateDateDisplay();
  
  // Set up event listeners
  setupEventListeners();
  
  // Check if already submitted today
  checkTodaySubmission();
  
  // Update jar fill level and count
  updateJarVisuals();
  
  // Load initial suggestions
  loadSuggestions();
}

// Helper Functions
function formatDate(date) {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
}

function getRandomRotation() {
  return getRandomInt(-20, 20) + 'deg';
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Note Management Functions
function loadNotes() {
  const storedNotes = localStorage.getItem(STORAGE_KEY);
  notes = storedNotes ? JSON.parse(storedNotes) : [];
  renderNotes();
}

function getAllNotes() {
  // This function returns all notes from localStorage
  const storedNotes = localStorage.getItem(STORAGE_KEY);
  return storedNotes ? JSON.parse(storedNotes) : [];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function addNote(text) {
  const note = {
    id: Date.now(),
    text,
    date: new Date().toISOString(),
    color: getRandomColor(),
    rotation: getRandomRotation(),
    position: {
      x: getRandomInt(20, 80), // percent from left
      y: getRandomInt(0, 75)   // percent from bottom
    }
  };
  
  notes.push(note);
  saveNotes();
  renderNewNote(note);
  updateJarVisuals();
  
  // Add celebration effects when a note is added
  celebrateNoteAdded();
  
  return note;
}

function renderNotes() {
  notesContainer.innerHTML = '';
  notes.forEach(note => {
    createNoteElement(note);
  });
}

function renderNewNote(note) {
  const noteEl = createNoteElement(note);
  
  // Calculate final position for drop animation
  const finalY = `${note.position.y}%`;
  noteEl.style.setProperty('--final-y', finalY);
  
  // Apply drop animation
  noteEl.classList.add('drop-animation');
}

function createNoteElement(note) {
  const noteEl = document.createElement('div');
  noteEl.className = 'note';
  noteEl.textContent = note.text;
  noteEl.style.setProperty('--note-color', note.color);
  noteEl.style.setProperty('--rotation', note.rotation);
  noteEl.style.left = `${note.position.x}%`;
  noteEl.style.bottom = `${note.position.y}%`;
  
  // Set data attributes
  noteEl.setAttribute('data-id', note.id);
  noteEl.setAttribute('data-date', new Date(note.date).toLocaleDateString());
  
  // Add click listener to show the full note text
  noteEl.addEventListener('click', (e) => {
    // Prevent click if we're currently shuffling
    if (isShuffling) return;
  });
  
  notesContainer.appendChild(noteEl);
  return noteEl;
}

// Visual Updates
function updateJarVisuals() {
  // Update jar fill level
  const fillPercentage = Math.min(notes.length / MAX_JAR_CAPACITY * 100, 100);
  jarFillLevel.style.height = `${fillPercentage}%`;
  
  // Update jar count text
  const count = notes.length;
  const emoji = count > 0 ? (count >= MAX_JAR_CAPACITY ? '✨' : '🌱') : '';
  jarCountEl.textContent = `${emoji} ${count} note${count !== 1 ? 's' : ''} in your jar ${emoji}`;
  
  // Show/hide shuffle button if there are notes
  if (count > 0 && shuffleBtn.classList.contains('opacity-0')) {
    shuffleBtn.classList.remove('opacity-0', 'pointer-events-none');
  } else if (count === 0 && !shuffleBtn.classList.contains('opacity-0')) {
    shuffleBtn.classList.add('opacity-0', 'pointer-events-none');
  }
}

function updateDateDisplay() {
  dateTextEl.textContent = formatDate(new Date());
}

function checkTodaySubmission() {
  // Check if we already have a note for today
  const todayNote = notes.find(note => {
    const noteDate = new Date(note.date);
    return formatDate(noteDate) === todayStr;
  });
  
  if (todayNote) {
    gratitudeInput.value = todayNote.text;
    gratitudeInput.disabled = true;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '✓';
    charCountEl.textContent = `${todayNote.text.length}/${MAX_CHARS}`;
    
    // Hide the suggestions container since we already have a note for today
    const suggestionsContainer = document.querySelector('.suggestions-container');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
  }
}

// Input handling
function handleInput() {
  const text = gratitudeInput.value.trim();
  const charCount = text.length;
  
  // Update character count
  charCountEl.textContent = `${charCount}/${MAX_CHARS}`;
  
  // Enable or disable save button
  saveBtn.disabled = charCount === 0 || charCount > MAX_CHARS;
}

function handleSave() {
  const text = gratitudeInput.value.trim();
  
  if (text.length === 0 || text.length > MAX_CHARS) return;
  
  // Add the note
  addNote(text);
  
  // Update UI state
  gratitudeInput.disabled = true;
  saveBtn.disabled = true;
  saveBtn.innerHTML = '✓';
  
  // Reset selected suggestion if any
  if (selectedSuggestion !== null) {
    const selectedEl = document.querySelector('.suggestion-item.selected');
    if (selectedEl) {
      selectedEl.classList.remove('selected');
    }
    selectedSuggestion = null;
  }
}

// Celebration Effects
function celebrateNoteAdded() {
  // Add jar celebration animation
  jarBody.classList.add('jar-celebration');
  setTimeout(() => {
    jarBody.classList.remove('jar-celebration');
  }, 1200);
  
  // Create confetti
  createConfetti();
  
  // Create floating emojis
  createFloatingEmojis();
  
  // Show appreciation toast
  showAppreciationToast();
}

function createConfetti() {
  // Clear any existing confetti
  confettiContainer.innerHTML = '';
  
  // Create new confetti pieces
  const confettiCount = 60;
  const confettiShapes = ['circle', 'square', 'triangle'];
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Random properties
    const color = getRandomColor();
    const left = getRandomInt(0, 100);
    const fallDuration = getRandomInt(2000, 5000);
    const shakeDuration = getRandomInt(500, 1500);
    const size = getRandomInt(6, 12);
    const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
    
    // Apply styles
    confetti.style.setProperty('--confetti-color', color);
    confetti.style.setProperty('--fall-duration', `${fallDuration}ms`);
    confetti.style.setProperty('--shake-duration', `${shakeDuration}ms`);
    confetti.style.left = `${left}%`;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    // Add shape styles
    if (shape === 'square') {
      confetti.style.borderRadius = '2px';
    } else if (shape === 'triangle') {
      confetti.style.width = '0';
      confetti.style.height = '0';
      confetti.style.borderLeft = `${size}px solid transparent`;
      confetti.style.borderRight = `${size}px solid transparent`;
      confetti.style.borderBottom = `${size * 1.5}px solid ${color}`;
      confetti.style.backgroundColor = 'transparent';
    }
    
    // Add to container
    confettiContainer.appendChild(confetti);
    
    // Remove after animation completes
    setTimeout(() => {
      if (confetti.parentNode === confettiContainer) {
        confettiContainer.removeChild(confetti);
      }
    }, fallDuration + 100);
  }
}

function createFloatingEmojis() {
  const emojiCount = 12;
  const jarRect = jarBody.getBoundingClientRect();
  
  for (let i = 0; i < emojiCount; i++) {
    const emoji = document.createElement('div');
    emoji.className = 'emoji';
    emoji.textContent = getRandomItem(EMOJIS);
    
    // Position around the jar
    const left = getRandomInt(jarRect.left - 50, jarRect.right + 50);
    const top = getRandomInt(jarRect.top + jarRect.height / 2, jarRect.bottom + 50);
    const rotation = getRandomInt(-30, 30) + 'deg';
    const delay = getRandomInt(0, 500);
    
    // Apply styles
    emoji.style.left = `${left}px`;
    emoji.style.top = `${top}px`;
    emoji.style.setProperty('--rotation', rotation);
    emoji.style.animationDelay = `${delay}ms`;
    
    // Add to document
    document.body.appendChild(emoji);
    
    // Remove after animation completes
    setTimeout(() => {
      if (emoji.parentNode === document.body) {
        document.body.removeChild(emoji);
      }
    }, 3000 + delay);
  }
}

function showAppreciationToast() {
  // Get random appreciation message
  const appreciation = getRandomItem(APPRECIATION_MESSAGES);
  
  // Set message content
  const titleEl = appreciationToast.querySelector('h3');
  const messageEl = appreciationToast.querySelector('p');
  
  titleEl.textContent = appreciation.title;
  messageEl.textContent = appreciation.message;
  
  // Add animation class (animation is handled by CSS)
  appreciationToast.style.display = 'block';
  
  // Remove after animation completes
  setTimeout(() => {
    appreciationToast.style.display = 'none';
  }, 3500);
}

// Shuffle animation
function shuffleNotes() {
  if (isShuffling || notes.length === 0) return;
  
  isShuffling = true;
  shuffleBtn.disabled = true;
  shuffleBtn.classList.add('loading');
  
  const noteElements = document.querySelectorAll('.note');
  let animationsCompleted = 0;
  
  noteElements.forEach(noteEl => {
    // Get current position and rotation
    const currY = noteEl.style.bottom;
    const currRotation = noteEl.style.transform;
    
    // Set initial values for animation
    noteEl.style.setProperty('--initial-y', currY);
    noteEl.style.setProperty('--initial-rotation', currRotation);
    
    // Add shuffle animation
    noteEl.classList.add('shuffle-animation');
    
    // Listen for animation end to count completed animations
    noteEl.addEventListener('animationend', () => {
      noteEl.classList.remove('shuffle-animation');
      animationsCompleted++;
      
      if (animationsCompleted === noteElements.length) {
        // All animations completed
        isShuffling = false;
        shuffleBtn.disabled = false;
        shuffleBtn.classList.remove('loading');
      }
    }, { once: true });
  });
}

// Modal handling
function openModal(title, content) {
  modalTitle.textContent = title;
  modalContent.innerHTML = content;
  modal.classList.add('modal-open');
}

function closeModal() {
  modal.classList.remove('modal-open');
}

function exportNotes() {
  const notes = getAllNotes();
  
  if (notes.length === 0) {
    modalTitle.textContent = '📔 Your Gratitude Journal is Empty';
    modalContent.innerHTML = '<p class="text-center py-4">No entries yet. Start adding some gratitude notes to fill your jar!</p>';
    modal.classList.add('modal-open');
    return;
  }
  
  // Sort notes by date (newest first)
  notes.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Group notes by month
  const notesByMonth = {};
  
  for (const note of notes) {
    const date = new Date(note.date);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    
    if (!notesByMonth[monthYear]) {
      notesByMonth[monthYear] = [];
    }
    
    notesByMonth[monthYear].push(note);
  }
  
  // Generate HTML content
  let content = '<div class="journal-container">';
  
  for (const month in notesByMonth) {
    content += `
      <div class="journal-month">
        <h3 class="month-title">✨ ${month} ✨</h3>
        <div class="month-entries">
    `;
    
    for (const note of notesByMonth[month]) {
      const date = new Date(note.date);
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric'
      });
      
      // Create a gradient background based on the date to make each entry unique
      const hue1 = (date.getDate() * 13) % 360;
      const hue2 = (hue1 + 40) % 360;
      
      content += `
        <div class="journal-entry" style="background: linear-gradient(135deg, hsla(${hue1}, 70%, 15%, 0.8), hsla(${hue2}, 70%, 25%, 0.8));">
          <div class="entry-date">
            <span class="date-icon">📅</span>
            <span class="date-text">${formattedDate}</span>
          </div>
          <div class="entry-content">${note.text}</div>
        </div>
      `;
    }
    
    content += `
    </div>
  </div>
`;
  }
  
  content += '</div>';
  
  modalTitle.innerHTML = '📔 Your Gratitude Journal <span style="font-size: 0.9em">✨</span>';
  modalContent.innerHTML = content;
  modal.classList.add('modal-open');
}

function clearJar() {
  if (notes.length === 0) return;
  
  if (confirm('Are you sure you want to clear your jar? This action cannot be undone.')) {
    notes = [];
    saveNotes();
    renderNotes();
    updateJarVisuals();
    
    // Reset today's input if needed
    gratitudeInput.value = '';
    gratitudeInput.disabled = false;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>';
    charCountEl.textContent = `0/${MAX_CHARS}`;
    
    showToast('Your jar has been cleared.');
  }
}

// Toast notification
function showToast(message) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-800 text-white py-3 px-5 rounded-xl shadow-lg z-50';
  toast.innerHTML = `<span class="mr-2">✨</span>${message}`;
  
  // Add to body
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 20px)';
    
    // Remove from DOM after animation
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Suggestion Functions
async function loadSuggestions() {
  // Clear any existing suggestions
  suggestionsListEl.innerHTML = '';
  
  // Show loading state
  isLoadingSuggestions = true;
  showSuggestionsLoading();
  
  try {
    // Fetch AI-generated suggestions from OpenAI API
    const suggestions = await fetchAISuggestions();
    currentSuggestions = suggestions;
    
    // Add each suggestion to the DOM
    suggestions.forEach((suggestion, index) => {
      const suggestionEl = createSuggestionElement(suggestion, index);
      suggestionsListEl.appendChild(suggestionEl);
    });
    
    // Show success toast
    showToast('New AI-generated gratitude prompts loaded!');
  } catch (error) {
    console.error('Error loading AI suggestions:', error);
    showToast('Error loading AI suggestions. Please try again.');
    
    // Clear loading state in case of error
    suggestionsListEl.innerHTML = `
      <div class="col-span-2 flex justify-center items-center py-4">
        <span class="text-red-300">❌ Could not load AI suggestions. Click refresh to try again.</span>
      </div>
    `;
  } finally {
    // Hide loading state
    isLoadingSuggestions = false;
    reloadSuggestionsBtn.classList.remove('loading');
    reloadSuggestionsBtn.disabled = false;
  }
}

function showSuggestionsLoading() {
  // Also update the reload button state
  reloadSuggestionsBtn.classList.add('loading');
  reloadSuggestionsBtn.disabled = true;
}

// Fetch AI-generated suggestions from OpenAI API
async function fetchAISuggestions() {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a gratitude assistant. Generate 5 unique gratitude prompts that focus on support, help and kindness from others. Format your response as a JSON array of objects with 'text' and 'type' properties. Types should be one of: 'help', 'kindness', 'growth'. Example format: [{\"text\":\"Someone who helped you today\",\"type\":\"help\"}]"
          },
          {
            role: "user",
            content: "Generate 5 unique gratitude prompts focusing on help and support from others."
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let parsedSuggestions;
    try {
      parsedSuggestions = JSON.parse(content);
    } catch (error) {
      // If JSON parsing fails, try to extract the array using regex
      const match = content.match(/\[\s*\{.*\}\s*\]/s);
      if (match) {
        parsedSuggestions = JSON.parse(match[0]);
      } else {
        throw new Error("Failed to parse suggestions from API response");
      }
    }
    
    // Add emoji icons to each suggestion
    return parsedSuggestions.map(suggestion => {
      const type = suggestion.type || 'help';
      const emoji = getRandomItem(GRATITUDE_EMOJIS[type] || GRATITUDE_EMOJIS.help);
      return {
        ...suggestion,
        icon: emoji
      };
    });
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

function createSuggestionElement(suggestion, index) {
  const suggestionEl = document.createElement('div');
  suggestionEl.className = 'suggestion-item';
  suggestionEl.setAttribute('data-index', index);
  
  suggestionEl.innerHTML = `
    <span class="suggestion-icon">${suggestion.icon}</span>
    <span class="suggestion-text">${suggestion.text}</span>
    <span class="check-icon">✓</span>
  `;
  
  // Add click event listener
  suggestionEl.addEventListener('click', () => {
    selectSuggestion(index);
  });
  
  return suggestionEl;
}

function selectSuggestion(index) {
  // Remove selection from previously selected item
  const previousSelectedEl = document.querySelector('.suggestion-item.selected');
  if (previousSelectedEl) {
    previousSelectedEl.classList.remove('selected');
  }
  
  // If clicking the same item, deselect it
  if (selectedSuggestion === index) {
    selectedSuggestion = null;
    return;
  }
  
  // Select the new item
  selectedSuggestion = index;
  const suggestionEl = document.querySelector(`.suggestion-item[data-index="${index}"]`);
  suggestionEl.classList.add('selected');
  
  // Update the input with a prompt based on the suggestion
  const suggestion = currentSuggestions[index];
  gratitudeInput.value = `I'm grateful for ${suggestion.text.toLowerCase()}: `;
  
  // Focus the input and place cursor at the end
  gratitudeInput.focus();
  gratitudeInput.selectionStart = gratitudeInput.value.length;
  gratitudeInput.selectionEnd = gratitudeInput.value.length;
  
  // Update character count
  handleInput();
}

// Reload suggestions button functionality
async function handleReloadSuggestions() {
  if (isLoadingSuggestions) return;
  
  try {
    await loadSuggestions();
    
    // Reset selected suggestion if any
    if (selectedSuggestion !== null) {
      selectedSuggestion = null;
    }
  } catch (error) {
    console.error('Error reloading suggestions:', error);
    showToast('Could not load AI suggestions. Please try again.');
  }
}

// Event Listeners
function setupEventListeners() {
  // Input events
  gratitudeInput.addEventListener('input', handleInput);
  saveBtn.addEventListener('click', handleSave);
  
  // Enter key to save
  gratitudeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !saveBtn.disabled) {
      e.preventDefault();
      handleSave();
    }
  });
  
  // Shuffle button
  shuffleBtn.addEventListener('click', shuffleNotes);
  
  // Export button
  exportBtn.addEventListener('click', exportNotes);
  
  // Clear button
  clearBtn.addEventListener('click', clearJar);
  
  // Modal close button
  closeModalBtn.addEventListener('click', closeModal);
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal-open')) {
      closeModal();
    }
  });
  
  // Reload suggestions button
  reloadSuggestionsBtn.addEventListener('click', handleReloadSuggestions);
  
  // Initialize appreciation toast style
  appreciationToast.style.display = 'none';
}

// Initialize app
document.addEventListener('DOMContentLoaded', init); 