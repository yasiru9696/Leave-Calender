// Sri Lanka Public Holidays 2026 - Poya Days and Mercantile Holidays Only
const sriLankaHolidays2026 = {
    // January
    '2026-01-03': 'Duruthu Full Moon Poya Day',
    '2026-01-15': 'Tamil Thai Pongal Day',

    // February
    '2026-02-01': 'Navam Full Moon Poya Day',
    '2026-02-04': 'Independence Day',

    // March
    '2026-03-02': 'Medin Full Moon Poya Day',

    // April
    '2026-04-01': 'Bak Full Moon Poya Day',
    '2026-04-13': 'Day Prior to Sinhala and Tamil New Year Day',
    '2026-04-14': 'Sinhala and Tamil New Year Day',

    // May
    '2026-05-01': 'Vesak Full Moon Poya Day & May Day',
    '2026-05-02': 'Day Following Vesak Full Moon Poya Day',
    '2026-05-30': 'Poson Full Moon Poya Day',

    // June
    '2026-06-29': 'Esala Full Moon Poya Day',

    // July
    '2026-07-29': 'Nikini Full Moon Poya Day',

    // August
    '2026-08-26': 'Milad-Un-Nabi (Holy Prophet\'s Birthday)',
    '2026-08-27': 'Binara Full Moon Poya Day',

    // September
    '2026-09-26': 'Vap Full Moon Poya Day',

    // October
    '2026-10-25': 'Il Full Moon Poya Day',

    // November
    '2026-11-24': 'Unduvap Full Moon Poya Day',

    // December
    '2026-12-23': 'Duruthu Full Moon Poya Day',
    '2026-12-25': 'Christmas Day'
};

// Mercantile Holidays 2026 - Poya Days and Key Mercantile Holidays
const mercantileHolidays2026 = {
    '2026-01-03': 'Duruthu Full Moon Poya Day',
    '2026-01-15': 'Tamil Thai Pongal Day',
    '2026-02-01': 'Navam Full Moon Poya Day',
    '2026-02-04': 'Independence Day',
    '2026-03-02': 'Medin Full Moon Poya Day',
    '2026-04-01': 'Bak Full Moon Poya Day',
    '2026-04-03': 'Good Friday',
    '2026-04-13': 'Day Prior to Sinhala and Tamil New Year Day',
    '2026-04-14': 'Sinhala and Tamil New Year Day',
    '2026-05-01': 'Vesak Full Moon Poya Day & May Day',
    '2026-05-02': 'Day Following Vesak Full Moon Poya Day',
    '2026-05-30': 'Poson Full Moon Poya Day',
    '2026-06-29': 'Esala Full Moon Poya Day',
    '2026-07-29': 'Nikini Full Moon Poya Day',
    '2026-08-26': 'Milad-Un-Nabi (Holy Prophet\'s Birthday)',
    '2026-08-27': 'Binara Full Moon Poya Day',
    '2026-09-26': 'Vap Full Moon Poya Day',
    '2026-10-25': 'Il Full Moon Poya Day',
    '2026-11-24': 'Unduvap Full Moon Poya Day',
    '2026-12-23': 'Duruthu Full Moon Poya Day',
    '2026-12-25': 'Christmas Day'
};

// Combine all holidays
const holidays2026 = {
    ...sriLankaHolidays2026
};

// Function to get holiday for a specific date
function getHoliday(dateString) {
    return holidays2026[dateString] || null;
}

// Function to get all holidays for a specific month
function getHolidaysForMonth(year, month) {
    const monthHolidays = [];
    for (const [date, name] of Object.entries(holidays2026)) {
        const holidayDate = new Date(date);
        if (holidayDate.getFullYear() === year && holidayDate.getMonth() === month) {
            monthHolidays.push({
                date: date,
                name: name,
                day: holidayDate.getDate()
            });
        }
    }
    return monthHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Function to check if a date is a holiday
function isHoliday(year, month, day) {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays2026.hasOwnProperty(dateString);
}

// Function to get all mercantile holidays for the year
function getAllMercantileHolidays() {
    const allHolidays = [];
    for (const [date, name] of Object.entries(mercantileHolidays2026)) {
        const holidayDate = new Date(date);
        allHolidays.push({
            date: date,
            name: name,
            day: holidayDate.getDate(),
            month: holidayDate.getMonth(),
            year: holidayDate.getFullYear()
        });
    }
    return allHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));
}
