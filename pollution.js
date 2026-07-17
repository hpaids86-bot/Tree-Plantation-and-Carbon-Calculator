// City Pollution & Tree Recommendation Calculator Logic

let cityPollutionCache = {};

// Main search/lookup function
async function lookupCityPollution() {
    const input = document.getElementById('citySearchInput');
    const cityName = input.value.trim();

    if (!cityName) {
        showError('Please enter a city name.');
        return;
    }

    const loading = document.getElementById('loadingIndicator');
    const errorBanner = document.getElementById('errorBanner');
    const dashboard = document.getElementById('pollutionDashboard');

    loading.style.display = 'block';
    errorBanner.style.display = 'none';
    dashboard.style.display = 'none';

    try {
        // Resolve city coordinates and default data
        let cityKey = Object.keys(INDIAN_CITIES).find(k => k.toLowerCase() === cityName.toLowerCase());
        let coords = null;
        let localData = null;

        if (cityKey) {
            coords = { lat: INDIAN_CITIES[cityKey].lat, lng: INDIAN_CITIES[cityKey].lng };
            localData = INDIAN_CITIES[cityKey];
        } else {
            // Fallback: Geocode using Open-Meteo if city not in our database
            try {
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();
                if (geoData.results && geoData.results.length > 0) {
                    coords = { lat: geoData.results[0].latitude, lng: geoData.results[0].longitude };
                    // Create default climate profile for geocoded city
                    localData = {
                        zone: geoData.results[0].timezone && geoData.results[0].timezone.includes('Kolkata') ? 'Tropical' : 'Subtropical',
                        avgTemp: 25,
                        rainfall: 900,
                        humidity: 60,
                        aqi: 120
                    };
                    cityKey = geoData.results[0].name;
                }
            } catch (e) {
                console.warn('Geocoding search failed:', e);
            }
        }

        if (!coords) {
            throw new Error(`City "${cityName}" not found. Please try another Indian city.`);
        }

        // Fetch Live Weather & Air Quality from Open-Meteo APIs
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,rain&timezone=auto`;
        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lng}&current=pm10,pm2_5,us_aqi&timezone=auto`;

        const [weatherRes, aqiRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(aqiUrl)
        ]);

        if (!weatherRes.ok || !aqiRes.ok) {
            throw new Error('Failed to retrieve live sensor values from Open-Meteo APIs.');
        }

        const weatherData = await weatherRes.json();
        const aqiData = await aqiRes.json();

        const currentAQI = aqiData.current ? Math.round(aqiData.current.us_aqi) : (localData.aqi || 100);
        const currentPM25 = aqiData.current ? Math.round(aqiData.current.pm2_5) : (localData.pm25 || 50);
        const currentPM10 = aqiData.current ? Math.round(aqiData.current.pm10) : (localData.pm10 || 90);
        const currentTemp = weatherData.current ? Math.round(weatherData.current.temperature_2m) : (localData.avgTemp || 25);
        const currentHumidity = weatherData.current ? Math.round(weatherData.current.relative_humidity_2m) : (localData.humidity || 60);

        const dataPayload = {
            city: cityKey,
            aqi: currentAQI,
            pm25: currentPM25,
            pm10: currentPM10,
            temp: currentTemp,
            humidity: currentHumidity,
            zone: localData.zone || 'Tropical'
        };

        // Cache result
        cityPollutionCache[cityKey] = dataPayload;
        
        // Render Dashboard
        renderPollutionDashboard(dataPayload);
        
        loading.style.display = 'none';
        dashboard.style.display = 'block';

    } catch (err) {
        console.error('Pollution analysis lookup failed:', err);
        showError(err.message || 'Error occurred while connecting to meteorological endpoints.');
        loading.style.display = 'none';
    }
}

function showError(msg) {
    const errorBanner = document.getElementById('errorBanner');
    errorBanner.textContent = msg;
    errorBanner.style.display = 'block';
}

function getPollutionDetails(aqi) {
    if (aqi <= 50) {
        return {
            status: 'Good',
            desc: 'Excellent Air Quality 🌿',
            color: '#2E7D32',
            bg: '#E8F5E9',
            suggestions: [
                'Air quality is excellent. Focus on planting diverse native species to protect urban biodiversity.',
                'Establish shade gardens and bird-friendly tree corridors to improve biodiversity.',
                'Encourage citizen tree logging to maintain the city\'s green canopy cover.'
            ]
        };
    } else if (aqi <= 100) {
        return {
            status: 'Moderate',
            desc: 'Acceptable Air Quality 🌱',
            color: '#F57F17',
            bg: '#FFFDE7',
            suggestions: [
                'Moderate air quality. Planting medium to high absorption trees will help filter low-level vehicle emissions.',
                'Establish buffer tree rows near busy street lanes or ring roads.',
                'Encourage neighborhood green clubs to plant fast growers like Bamboo and Gulmohar.'
            ]
        };
    } else if (aqi <= 200) {
        return {
            status: 'Poor',
            desc: 'Unhealthy / Polluted Air 🍃',
            color: '#D84315',
            bg: '#FBE9E7',
            suggestions: [
                'Significant particulate levels detected. Prioritize high-canopy trees to trap suspended dust particles.',
                'Plant thick green barriers around schools, residential blocks, and parks.',
                'Select high pollution-tolerant species like Peepal, Banyan, Neem, and Arjun.'
            ]
        };
    } else {
        return {
            status: 'Severe',
            desc: 'Hazardous Air Quality ⚠️',
            color: '#C62828',
            bg: '#FFEBEE',
            suggestions: [
                'CRITICAL POLLUTION DETECTED. Immediate eco-intervention required.',
                'Deploy dense, multi-layered forest buffers using Very High tolerance species (Neem, Arjun, Bamboo).',
                'Support local administration dust control measures: spray water over streets and construct windbreaks.'
            ]
        };
    }
}

function getCoolingCategory(species) {
    const vc = ['Banyan', 'Peepal', 'Banyan Fig', 'Neem'];
    const hc = ['Mango', 'Tamarind', 'Bamboo', 'Teak', 'Mahogany', 'Sal', 'Deodar', 'Moringa'];
    
    if (vc.includes(species)) return 'Very High 🌡️';
    if (hc.includes(species)) return 'High 🌡️';
    return 'Medium 🌡️';
}

function renderPollutionDashboard(data) {
    // 1. Update Atmospheric Metrics
    document.getElementById('metricAQI').textContent = data.aqi;
    document.getElementById('metricPM25').textContent = `${data.pm25} μg/m³`;
    document.getElementById('metricPM10').textContent = `${data.pm10} μg/m³`;
    document.getElementById('metricTemp').textContent = `${data.temp} °C`;
    document.getElementById('metricHumidity').textContent = `${data.humidity} %`;
    document.getElementById('metricZone').textContent = data.zone;

    // 2. Set Status Card
    const details = getPollutionDetails(data.aqi);
    const statusCard = document.getElementById('statusCard');
    statusCard.style.borderLeftColor = details.color;
    statusCard.style.backgroundColor = details.bg;

    const badge = document.getElementById('pollutionStatusBadge');
    badge.textContent = details.status;
    badge.style.color = details.color;

    const desc = document.getElementById('pollutionCategoryDesc');
    desc.textContent = details.desc;
    desc.style.color = details.color;

    // 3. Render suggestions
    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = `
        <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem;">
            ${details.suggestions.map(s => `<li>${s}</li>`).join('')}
        </ul>
    `;

    // 4. Score and Recommend Trees
    const recommendedTreeRows = document.getElementById('recommendedTreeRows');
    const recommendations = [];

    Object.keys(TREE_SPECIES).forEach(species => {
        const tree = getTreeData(species);
        let score = 0;

        // Climate match (Max 40 pts)
        if (tree.climateZones.includes(data.zone)) {
            score += 40;
        } else {
            score += 12;
        }

        // Pollution tolerance match (Max 40 pts)
        if (data.aqi > 100) {
            if (tree.pollutionTolerance === 'Very High') score += 40;
            else if (tree.pollutionTolerance === 'High') score += 30;
            else if (tree.pollutionTolerance === 'Medium') score += 20;
            else score += 5;
        } else {
            score += 30; // base score if clean air
        }

        // Soil compatibility baseline (Max 20 pts)
        score += 20; // default baseline match

        recommendations.push({
            name: species,
            co2: tree.co2PerYear,
            cooling: getCoolingCategory(species),
            water: tree.waterPerWeek,
            score: Math.min(100, score)
        });
    });

    // Sort by suitability score descending, then by CO2 absorption
    recommendations.sort((a, b) => b.score - a.score || b.co2 - a.co2);

    // Take top 5
    const topRecommendations = recommendations.slice(0, 5);

    recommendedTreeRows.innerHTML = topRecommendations.map(rec => `
        <tr style="border-bottom: 1px solid rgba(126, 217, 87, 0.15); font-size: 0.95rem;">
            <td style="padding: 1rem 0.5rem; font-weight: 700; color: var(--text-primary);">${rec.name}</td>
            <td style="padding: 1rem 0.5rem; color: var(--text-secondary);">${rec.co2} kg/year</td>
            <td style="padding: 1rem 0.5rem; color: var(--text-secondary);">${rec.cooling}</td>
            <td style="padding: 1rem 0.5rem; color: var(--text-secondary);">${rec.water} L/week</td>
            <td style="padding: 1rem 0.5rem; text-align: right; font-weight: 700; color: var(--green-accent);">${rec.score}%</td>
        </tr>
    `).join('');
}

window.lookupCityPollution = lookupCityPollution;
