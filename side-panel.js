// Render combined list of mercantile holidays and planned leaves
function renderCombinedList() {
    const list = document.getElementById('combinedList');
    const combinedItems = [];

    // Add all mercantile holidays
    const holidays = getAllMercantileHolidays();
    holidays.forEach(holiday => {
        combinedItems.push({
            date: holiday.date,
            sortDate: new Date(holiday.date),
            type: 'holiday',
            name: holiday.name
        });
    });

    // Add all planned leaves
    for (const [dateString, leaveType] of Object.entries(leaves)) {
        if (leaveType !== 'none') {
            let leaveName;
            if (leaveType === 'casual') leaveName = 'Casual Leave';
            else if (leaveType === 'casual-morning') leaveName = 'Casual Leave - Morning Half';
            else if (leaveType === 'casual-evening') leaveName = 'Casual Leave - Evening Half';
            else if (leaveType === 'annual') leaveName = 'Annual Leave';

            combinedItems.push({
                date: dateString,
                sortDate: new Date(dateString),
                type: leaveType,
                name: leaveName,
                note: getNote(dateString)
            });
        }
    }

    // Sort all items by date
    combinedItems.sort((a, b) => a.sortDate - b.sortDate);

    list.innerHTML = '';

    if (combinedItems.length === 0) {
        list.innerHTML = '<div class="no-leaves-message">No holidays or leaves</div>';
        return;
    }

    combinedItems.forEach(item => {
        const itemDiv = document.createElement('div');

        // Set class based on type
        if (item.type === 'holiday') {
            itemDiv.className = 'panel-list-item mercantile-holiday-item';
        } else if (item.type === 'casual') {
            itemDiv.className = 'panel-list-item casual-leave-item';
        } else if (item.type === 'casual-morning' || item.type === 'casual-evening') {
            itemDiv.className = 'panel-list-item casual-leave-item';
        } else if (item.type === 'annual') {
            itemDiv.className = 'panel-list-item annual-leave-item';
        }

        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });

        let html = `
            <div class="item-date">${dateStr}</div>
            <div class="item-name">${item.name}</div>
        `;

        if (item.note) {
            html += `<div class="item-note">${item.note}</div>`;
        }

        itemDiv.innerHTML = html;
        list.appendChild(itemDiv);
    });
}

// Toggle side panel
function toggleSidePanel() {
    const panel = document.getElementById('sidePanel');
    panel.classList.toggle('active');

    // Render content when opening
    if (panel.classList.contains('active')) {
        renderCombinedList();
        updateSidePanelCounters();
    }
}

// Close side panel
function closeSidePanel() {
    const panel = document.getElementById('sidePanel');
    panel.classList.remove('active');
}

// Update side panel counters
function updateSidePanelCounters() {
    const usage = getLeaveUsage();
    const sideCasual = document.getElementById('sideCasualCount');
    const sideAnnual = document.getElementById('sideAnnualCount');
    if (sideCasual) sideCasual.textContent = usage.casualUsed;
    if (sideAnnual) sideAnnual.textContent = usage.annualUsed;
}
