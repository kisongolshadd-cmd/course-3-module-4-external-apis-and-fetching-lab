// Task 2 - Step 1: Fetch Alerts for a State from the API
async function fetchWeatherAlerts(state) {
    // Task 3: Clear previous errors using classList before fetching
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.add('hidden');
    }

    // Clean up the user input
    if (!state || state.trim() === '') {
        showError("Input cannot be empty");
        return;
    }

    try {
        const url = `https://api.weather.gov/alerts/active?area=${state.toUpperCase().trim()}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        // Pass data to display
        displayAlerts(data, state);
    } catch (error) {
        showError(error.message);
    }
}

// Task 2 - Step 2: Display the Alerts on the Page
function displayAlerts(data, state) {
    const alertList = document.getElementById('weather-alerts');
    const summaryContainer = document.getElementById('alert-summary');
    const errorDiv = document.getElementById('error-message');

    // Clear the old text string AND apply the hidden class on success
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.add('hidden');
    }
    
    if (alertList) alertList.innerHTML = '';
    
    const totalAlerts = data.features ? data.features.length : 0;
    const title = data.title || `Current watches, warnings, and advisories for ${state.toUpperCase()}`;

    if (summaryContainer) {
        summaryContainer.textContent = `${title}: ${totalAlerts}`;
    }

    if (data.features && data.features.length > 0) {
        data.features.forEach(alert => {
            const li = document.createElement('li');
            li.textContent = alert.properties.headline;
            if (alertList) alertList.appendChild(li);
        });
    }
}

// Task 4: Implement Error Handling using classList
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
}

// Hook up the DOM interactive elements safely using the correct button ID
document.addEventListener('DOMContentLoaded', () => {
    const fetchAlertsBtn = document.getElementById('fetch-alerts');
    const stateInput = document.getElementById('state-input');

    // FIXED: Corrected getAlertsBtn to fetchAlertsBtn here
    if (fetchAlertsBtn && stateInput) {
        fetchAlertsBtn.addEventListener('click', () => {
            fetchWeatherAlerts(stateInput.value);
            stateInput.value = '';
        });
    }
});

// CRITICAL FOR JEST: Export functions so the terminal test suite can find them
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchWeatherAlerts,
        displayAlerts,
        showError
    };
}