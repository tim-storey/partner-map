// --- 1. INITIALIZE THE MAP ---
// This is the JavaScript equivalent of leaflet() %>% setView()
const map = L.map('map').setView([56, -98.5], 4);

// This is the equivalent of addTiles()
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// A layer group to hold the markers. This makes it easy to clear them all at once.
let markerGroup = L.layerGroup().addTo(map);
let allData = []; // Variable to store the fetched data

// --- 2. DEFINE THE COLOR PALETTE ---
// This is the JavaScript equivalent of your colorFactor() function
function getColor(type) {
    switch (type) {
        case 'Academic': return '#8DD3C7'; // Replace with your actual types and desired colors
        case 'Health System': return '#FFFFB3';
        case 'Government': return '#BEBADA';
        case 'Industry': return '#FB8072';
        case 'GPO': return '#80B1D3';
        case 'Citizens': return '#FDB462';
        default: return 'grey';
    }
}

// --- 3. FETCH AND PROCESS DATA ---
fetch('partner_orgs.json')
    .then(response => response.json())
    .then(data => {
        allData = data; // Store the data globally
        populateFilters(allData); // Create the filter checkboxes
        drawMarkers(allData); // Draw the initial markers on the map
    })
    .catch(error => console.error('Error loading the data:', error));


// --- 4. CREATE DYNAMIC FILTERS ---
function populateFilters(data) {
    const filterContainer = document.getElementById('type-filter');
    // Get unique types from the data
    const types = [...new Set(data.map(item => item.type))];

    types.forEach(type => {
        const option = document.createElement('div');
        option.classList.add('filter-option');

        // Get the color for the current type
        const color = getColor(type);

        option.innerHTML = `
            <input type="checkbox" id="${type}" name="type" value="${type}" checked>
            <label for="${type}">
                <span class="color-box" style="background-color: ${color};"></span>
                ${type}
            </label>
        `;
        filterContainer.appendChild(option);
    });

    // Add event listeners to the checkboxes
    filterContainer.addEventListener('change', () => {
        const selectedTypes = Array.from(document.querySelectorAll('#type-filter input:checked')).map(input => input.value);
        const filteredData = allData.filter(item => selectedTypes.includes(item.type));
        drawMarkers(filteredData);
    });
}

// --- 5. DRAW MARKERS ON THE MAP ---
// This function replaces your leafletProxy() and addCircleMarkers() logic
function drawMarkers(data) {
    // Clear existing markers
    markerGroup.clearLayers();

    data.forEach(item => {
        // Create the popup content, equivalent to your mutate() call
        const popupContent = `<b>${item.name}</b><br><a href="${item.website}" target="_blank">Go to website</a>`;

        // Create the circle marker
        L.circleMarker([item.latitude, item.longitude], {
            radius: 5,
            color: getColor(item.type),
            weight: 1,
            stroke: true,
            fillOpacity: 1
        })
        .bindPopup(popupContent)
        .addTo(markerGroup);
    });
}



