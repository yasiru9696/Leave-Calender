// Calendar state
let currentMonth = 0; // January 2026
let currentYear = 2026;
let notes = {};
let leaves = {}; // Store leave information for each date
let selectedDate = null;

// Leave limits
const CASUAL_LEAVE_TOTAL = 7;
const ANNUAL_LEAVE_TOTAL = 14;

// Load notes and leaves from localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('calendarNotes2026');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
    const savedLeaves = localStorage.getItem('calendarLeaves2026');
    if (savedLeaves) {
        leaves = JSON.parse(savedLeaves);
    }
}

// Save notes and leaves to localStorage
function saveNotes() {
    localStorage.setItem('calendarNotes2026', JSON.stringify(notes));
    localStorage.setItem('calendarLeaves2026', JSON.stringify(leaves));
    updateLeaveCounters();

    // Update side panel if it's open
    const panel = document.getElementById('sidePanel');
    if (panel && panel.classList.contains('active')) {
        renderPlannedLeaves();
    }
}

// Get note for a specific date
function getNote(dateString) {
    return notes[dateString] || '';
}

// Set note for a specific date
function setNote(dateString, noteText) {
    if (noteText.trim()) {
        notes[dateString] = noteText.trim();
    } else {
        delete notes[dateString];
    }
    saveNotes();
}

// Get leave type for a specific date
function getLeaveType(dateString) {
    return leaves[dateString] || 'none';
}

// Set leave type for a specific date
function setLeaveType(dateString, leaveType) {
    if (leaveType && leaveType !== 'none') {
        leaves[dateString] = leaveType;
    } else {
        delete leaves[dateString];
    }
    saveNotes();
}

// Calculate leave usage
function getLeaveUsage() {
    let casualUsed = 0;
    let annualUsed = 0;

    for (const leaveType of Object.values(leaves)) {
        if (leaveType === 'casual') casualUsed += 1;
        if (leaveType === 'casual-morning') casualUsed += 0.5;
        if (leaveType === 'casual-evening') casualUsed += 0.5;
        if (leaveType === 'annual') annualUsed += 1;
    }

    return {
        casualUsed,
        casualRemaining: CASUAL_LEAVE_TOTAL - casualUsed,
        annualUsed,
        annualRemaining: ANNUAL_LEAVE_TOTAL - annualUsed
    };
}

// Update leave counters in UI
function updateLeaveCounters() {
    const usage = getLeaveUsage();

    document.getElementById('casualUsed').textContent = usage.casualUsed;
    document.getElementById('casualRemaining').textContent = usage.casualRemaining;
    document.getElementById('annualUsed').textContent = usage.annualUsed;
    document.getElementById('annualRemaining').textContent = usage.annualRemaining;
}

// Format date as YYYY-MM-DD
function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Get month name
function getMonthName(month) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
}

// Get number of days in month
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// Get first day of month (0 = Monday, 6 = Sunday)
function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    // Convert from Sunday-based (0-6) to Monday-based (0-6)
    // Sunday (0) becomes 6, Monday (1) becomes 0, etc.
    return day === 0 ? 6 : day - 1;
}

// Check if date is today
function isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day;
}

// Check if day is weekend (Saturday or Sunday)
function isWeekend(dayOfWeek) {
    // In Monday-based system: Saturday = 5, Sunday = 6
    return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
}

// Render calendar
function renderCalendar() {
    const monthElement = document.getElementById('currentMonth');
    const daysElement = document.getElementById('calendarDays');

    monthElement.textContent = `${getMonthName(currentMonth)} ${currentYear}`;

    // Clear previous days
    daysElement.innerHTML = '';

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

    // Add previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const cell = createDayCell(day, true);
        daysElement.appendChild(cell);
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = createDayCell(day, false);
        daysElement.appendChild(cell);
    }

    // Add next month's days to fill the grid
    const totalCells = daysElement.children.length;
    const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const cell = createDayCell(day, true);
        daysElement.appendChild(cell);
    }

    // Render holidays list
    renderHolidaysList();
}

// Create day cell
function createDayCell(day, isOtherMonth) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';

    if (isOtherMonth) {
        cell.classList.add('other-month');
    }

    const dateString = formatDate(currentYear, currentMonth, day);
    const dayOfWeekRaw = new Date(currentYear, currentMonth, day).getDay();
    // Convert to Monday-based week (0 = Monday, 6 = Sunday)
    const dayOfWeek = dayOfWeekRaw === 0 ? 6 : dayOfWeekRaw - 1;

    // Day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;

    if (!isOtherMonth && isWeekend(dayOfWeek)) {
        dayNumber.classList.add('weekend');
    }

    // Add Monday class for styling
    if (!isOtherMonth && dayOfWeek === 0) {
        dayNumber.classList.add('monday');
    }

    cell.appendChild(dayNumber);

    if (!isOtherMonth) {
        // Check for leave
        const leaveType = getLeaveType(dateString);
        if (leaveType !== 'none') {
            if (leaveType === 'casual') {
                cell.classList.add('casual-leave-day');
                const badge = document.createElement('div');
                badge.className = 'leave-badge casual-badge';
                badge.textContent = 'Casual';
                cell.appendChild(badge);
            } else if (leaveType === 'casual-morning') {
                cell.classList.add('casual-morning-leave-day');
                const badge = document.createElement('div');
                badge.className = 'leave-badge morning-half-badge';
                badge.textContent = 'Morning';
                cell.appendChild(badge);
            } else if (leaveType === 'casual-evening') {
                cell.classList.add('casual-evening-leave-day');
                const badge = document.createElement('div');
                badge.className = 'leave-badge evening-half-badge';
                badge.textContent = 'Evening';
                cell.appendChild(badge);
            } else if (leaveType === 'annual') {
                cell.classList.add('annual-leave-day');
                const badge = document.createElement('div');
                badge.className = 'leave-badge annual-badge';
                badge.textContent = 'Annual';
                cell.appendChild(badge);
            }
        }

        // Check for holiday
        const holiday = getHoliday(dateString);
        if (holiday) {
            cell.classList.add('holiday');
            const holidayName = document.createElement('div');
            holidayName.className = 'holiday-name';
            holidayName.textContent = holiday;
            cell.appendChild(holidayName);
        }

        // Check for today
        if (isToday(currentYear, currentMonth, day)) {
            cell.classList.add('today');
        }

        // Check for note
        const hasNote = getNote(dateString);

        // Add note tooltip
        if (hasNote) {
            cell.setAttribute('data-note', hasNote);
            cell.classList.add('has-note-tooltip');
        }

        // Add indicators
        if (holiday || hasNote) {
            const indicators = document.createElement('div');
            indicators.className = 'day-indicator';

            if (holiday) {
                const holidayDot = document.createElement('div');
                holidayDot.className = 'indicator-dot holiday-dot';
                indicators.appendChild(holidayDot);
            }

            if (hasNote) {
                cell.classList.add('has-note');
                const noteDot = document.createElement('div');
                noteDot.className = 'indicator-dot note-dot';
                indicators.appendChild(noteDot);
            }

            cell.appendChild(indicators);
        }

        // Add click event
        cell.addEventListener('click', () => openNoteModal(dateString, day));
    }

    return cell;
}

// Render holidays list
function renderHolidaysList() {
    const holidaysList = document.getElementById('holidaysList');
    const monthHolidays = getHolidaysForMonth(currentYear, currentMonth);

    holidaysList.innerHTML = '';

    if (monthHolidays.length === 0) {
        holidaysList.innerHTML = '<div class="no-holidays">No public holidays this month</div>';
        return;
    }

    monthHolidays.forEach(holiday => {
        const item = document.createElement('div');
        item.className = 'holiday-item';

        const date = new Date(holiday.date);
        const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });

        item.innerHTML = `
            <div class="holiday-date">${dateStr}</div>
            <div class="holiday-item-name">${holiday.name}</div>
        `;

        holidaysList.appendChild(item);
    });
}

// Open note modal
function openNoteModal(dateString, day) {
    selectedDate = dateString;
    const modal = document.getElementById('noteModal');
    const modalTitle = document.getElementById('modalTitle');
    const noteInput = document.getElementById('noteInput');

    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    modalTitle.textContent = dateStr;
    noteInput.value = getNote(dateString);

    // Set leave type radio button and casual sub-type
    const leaveType = getLeaveType(dateString);
    const radioButtons = document.querySelectorAll('input[name="leaveType"]');
    const casualSubSelector = document.getElementById('casualSubSelector');

    // Handle existing leave types
    if (leaveType === 'casual-morning' || leaveType === 'casual-evening') {
        // Select casual leave radio
        radioButtons.forEach(radio => {
            radio.checked = radio.value === 'casual';
        });
        // Show sub-selector and select appropriate type
        casualSubSelector.classList.remove('hidden');
        const casualType = leaveType === 'casual-morning' ? 'morning' : 'evening';
        document.querySelectorAll('input[name="casualType"]').forEach(radio => {
            radio.checked = radio.value === casualType;
        });
    } else {
        radioButtons.forEach(radio => {
            radio.checked = radio.value === leaveType;
        });
        // Show/hide sub-selector based on selection
        if (leaveType === 'casual') {
            casualSubSelector.classList.remove('hidden');
            document.querySelector('input[name="casualType"][value="full"]').checked = true;
        } else {
            casualSubSelector.classList.add('hidden');
        }
    }

    modal.classList.add('active');
    noteInput.focus();
}

// Close note modal
function closeNoteModal() {
    const modal = document.getElementById('noteModal');
    modal.classList.remove('active');
    selectedDate = null;
}

// Save note
function saveNote() {
    const noteInput = document.getElementById('noteInput');
    const noteText = noteInput.value;
    let selectedLeaveType = document.querySelector('input[name="leaveType"]:checked').value;

    // If casual leave is selected, check the sub-type
    if (selectedLeaveType === 'casual') {
        const casualType = document.querySelector('input[name="casualType"]:checked').value;
        if (casualType === 'morning') {
            selectedLeaveType = 'casual-morning';
        } else if (casualType === 'evening') {
            selectedLeaveType = 'casual-evening';
        }
        // 'full' stays as 'casual'
    }

    if (selectedDate) {
        // Check leave limits
        const usage = getLeaveUsage();
        const currentLeaveType = getLeaveType(selectedDate);

        // Validate leave limits
        const isCasualLeave = selectedLeaveType === 'casual' || selectedLeaveType === 'casual-morning' || selectedLeaveType === 'casual-evening';
        const isCurrentCasual = currentLeaveType === 'casual' || currentLeaveType === 'casual-morning' || currentLeaveType === 'casual-evening';

        if (isCasualLeave && !isCurrentCasual) {
            const daysNeeded = selectedLeaveType === 'casual' ? 1 : 0.5;
            if (usage.casualRemaining < daysNeeded) {
                alert(`You need ${daysNeeded} day(s) but only have ${usage.casualRemaining} casual leave remaining!`);
                return;
            }
        } else if (selectedLeaveType === 'annual' && currentLeaveType !== 'annual') {
            if (usage.annualRemaining <= 0) {
                alert('You have no annual leave remaining!');
                return;
            }
        }

        setNote(selectedDate, noteText);
        setLeaveType(selectedDate, selectedLeaveType);
        renderCalendar();
        closeNoteModal();
    }
}

// Delete note
function deleteNote() {
    if (selectedDate) {
        setNote(selectedDate, '');
        setLeaveType(selectedDate, 'none');
        renderCalendar();
        closeNoteModal();
    }
}

// Navigate to previous month
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    // Keep within 2026
    if (currentYear < 2026) {
        currentYear = 2026;
        currentMonth = 0;
    }

    renderCalendar();
}

// Navigate to next month
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    // Keep within 2026
    if (currentYear > 2026) {
        currentYear = 2026;
        currentMonth = 11;
    }

    renderCalendar();
}

// Export data to JSON file
function exportData() {
    const data = {
        notes: notes,
        leaves: leaves,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `calendar-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('Calendar data exported successfully!');
}

// Import data from JSON file
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);

            // Validate data structure
            if (!data.notes || !data.leaves) {
                alert('Invalid backup file format!');
                return;
            }

            // Confirm before overwriting
            const confirm = window.confirm(
                'This will replace all your current calendar data. Are you sure you want to continue?'
            );

            if (confirm) {
                notes = data.notes;
                leaves = data.leaves;
                saveNotes();
                renderCalendar();
                alert('Calendar data imported successfully!');
            }
        } catch (error) {
            alert('Error reading backup file. Please make sure it\'s a valid calendar backup.');
            console.error('Import error:', error);
        }
    };

    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
}

// Initialize calendar
function init() {
    loadNotes();
    updateLeaveCounters();
    renderCalendar();

    // Event listeners
    document.getElementById('prevMonth').addEventListener('click', previousMonth);
    document.getElementById('nextMonth').addEventListener('click', nextMonth);
    document.getElementById('closeModal').addEventListener('click', closeNoteModal);
    document.getElementById('saveNote').addEventListener('click', saveNote);
    document.getElementById('deleteNote').addEventListener('click', deleteNote);

    // Side panel event listeners
    document.getElementById('sidePanelToggle').addEventListener('click', toggleSidePanel);
    document.getElementById('closeSidePanel').addEventListener('click', closeSidePanel);

    // Export/Import event listeners
    document.getElementById('exportData').addEventListener('click', exportData);
    document.getElementById('importData').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importData);

    // Close modal on outside click
    document.getElementById('noteModal').addEventListener('click', (e) => {
        if (e.target.id === 'noteModal') {
            closeNoteModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeNoteModal();
        }
    });

    // Save note on Ctrl+Enter
    document.getElementById('noteInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            saveNote();
        }
    });

    // Toggle casual leave sub-selector
    document.querySelectorAll('input[name="leaveType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const casualSubSelector = document.getElementById('casualSubSelector');
            if (e.target.value === 'casual') {
                casualSubSelector.classList.remove('hidden');
            } else {
                casualSubSelector.classList.add('hidden');
            }
        });
    });
}

// Start the calendar when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
