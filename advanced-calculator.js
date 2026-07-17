// Advanced Calculator JavaScript (trimmed to active modules)

function showFeature(featureId, evt) {
    document.querySelectorAll('.feature-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.feature-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(featureId).classList.add('active');
    const trigger = evt?.currentTarget || evt?.target;
    if (trigger) {
        trigger.classList.add('active');
    }
}

function optimizeTrees(event) {
    event.preventDefault();

    const targetCO2 = parseFloat(document.getElementById('targetCO2').value);

    if (!targetCO2 || targetCO2 < 1) {
        Utils.showAlert('Please enter a valid target CO₂', 'error');
        return;
    }

    const solutions = TreeOptimizer.optimize(targetCO2);
    const bestSolution = solutions[0];

    let html = `
        <div class="optimizer-result">
            <h3>Optimal Tree Combination</h3>
            <p><strong>Target:</strong> ${Utils.formatNumber(targetCO2)} kg CO₂/year</p>
            <p><strong>Efficiency:</strong> ${bestSolution.efficiency.toFixed(2)} kg CO₂ per ₹</p>
            <p><strong>Total Cost:</strong> ₹${Utils.formatNumber(Math.round(bestSolution.totalCost))}</p>
            <p><strong>Annual Water Required:</strong> ${Utils.formatNumber(Math.round(bestSolution.totalWaterPerYear))} liters</p>
            <p><strong>People Supported:</strong> ${bestSolution.peopleSupported} adults</p>
            
            <h4 style="margin-top: 1.5rem;">Recommended Tree Mix:</h4>
            <div style="display: grid; gap: 1rem; margin-top: 1rem;">
    `;

    bestSolution.trees.forEach(tree => {
        html += `
            <div class="result-item">
                <div>
                    <strong>${tree.species}</strong><br>
                    <small>CO₂: ${tree.co2Reduction} kg/year | O₂: ${Utils.formatNumber(Math.round(tree.oxygenProduction))} kg/year</small>
                </div>
                <div style="text-align: right;">
                    <strong style="font-size: 1.2rem; color: var(--green-primary);">${tree.count} trees</strong><br>
                    <small>Cost: ₹${tree.cost} | Water: ${Utils.formatNumber(Math.round(tree.waterRequired))} L/year</small>
                </div>
            </div>
        `;
    });

    html += `
            </div>
            ${solutions.length > 1 ? `
            <details style="margin-top: 1rem;">
                <summary style="cursor: pointer; color: var(--green-primary); font-weight: bold;">View Alternative Solutions (${solutions.length - 1})</summary>
                <div style="margin-top: 1rem;">
            ` : ''}
    `;

    if (solutions.length > 1) {
        solutions.slice(1, 4).forEach((solution, index) => {
            html += `
                <div class="optimizer-result" style="margin-top: 1rem; opacity: 0.9;">
                    <strong>Alternative ${index + 2}:</strong>
                    <p>Cost: ₹${Utils.formatNumber(Math.round(solution.totalCost))} | 
                       Water: ${Utils.formatNumber(Math.round(solution.totalWaterPerYear))} L/year |
                       Efficiency: ${solution.efficiency.toFixed(2)} kg/₹</p>
                    <small>${solution.trees.map(t => `${t.count} ${t.species}`).join(', ')}</small>
                </div>
            `;
        });
        html += `</div></details>`;
    }

    html += '</div>';

    document.getElementById('optimizerResults').innerHTML = html;
    document.getElementById('optimizerResults').scrollIntoView({ behavior: 'smooth' });
}

function findSoilTrees(event) {
    event.preventDefault();

    const soilType = document.getElementById('soilType').value;
    const climateZone = document.getElementById('climateZone').value;

    if (!soilType || !climateZone) {
        Utils.showAlert('Please select soil type and climate zone', 'error');
        return;
    }

    const soilAliasMap = {
        Black: 'Clay',
        Red: 'Loamy',
        Laterite: 'Loamy',
        Arid: 'Sandy',
        Mountain: 'Loamy',
        Saline: 'Alluvial',
        Peaty: 'Alluvial'
    };

    const normalizedSoil = soilAliasMap[soilType] || soilType;
    const trees = SoilSuitability.getBestTreeForConditions(normalizedSoil, climateZone);

    let html = '<div style="margin-top: 1.5rem;"><h3>Recommended Trees:</h3>';
    html += '<div style="display: grid; gap: 1rem; margin-top: 1rem;">';

    trees.forEach(tree => {
        html += `
            <div class="result-item">
                <div>
                    <strong>${tree.species}</strong><br>
                    <small>CO₂: ${tree.co2PerYear} kg/year | O₂: ${Utils.formatNumber(tree.oxygenPerYear)} kg/year</small><br>
                    <small>Pollution Tolerance: ${tree.pollutionTolerance} | 
                           Disease Resistance: ${tree.diseaseResistance} | 
                           Survival Risk: ${tree.survivalRisk}</small>
                </div>
                <div style="text-align: right;">
                    <span style="color: var(--green-primary); font-weight: bold;">✓ Suitable</span>
                </div>
            </div>
        `;
    });

    html += '</div></div>';

    document.getElementById('soilResults').innerHTML = html;
    document.getElementById('soilResults').scrollIntoView({ behavior: 'smooth' });
}

function getClimateRecommendations(event) {
    event.preventDefault();

    const city = document.getElementById('climateCity').value;

    if (!city) {
        Utils.showAlert('Please select a city', 'error');
        return;
    }

    const recommendations = ClimateRecommender.getClimateRecommendations(city);
    const calendar = ClimateCalendar.getPlantingCalendar(city);

    const climateInfo = `
        <div class="result-item">
            <div><strong>City:</strong> ${city}</div>
            <div><strong>Climate Zone:</strong> ${recommendations.climate.zone}</div>
            <div><strong>Subzone:</strong> ${recommendations.climate.subzone}</div>
            <div><strong>Average Temperature:</strong> ${recommendations.climate.avgTemp}°C</div>
            <div><strong>Annual Rainfall:</strong> ${recommendations.climate.rainfall} mm</div>
            <div><strong>Humidity:</strong> ${recommendations.climate.humidity}%</div>
        </div>
    `;
    document.getElementById('climateInfo').innerHTML = climateInfo;

    let treesHtml = '<div style="display: grid; gap: 1rem; margin-top: 1rem;">';
    recommendations.recommendedTrees.forEach((tree, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        treesHtml += `
            <div class="result-item">
                <div>
                    <strong>${medal} ${tree.species}</strong><br>
                    <small>CO₂: ${tree.co2PerYear} kg/year | O₂: ${Utils.formatNumber(tree.oxygenPerYear)} kg/year</small><br>
                    <small>Pollution Tolerance: ${tree.pollutionTolerance} | Survival Risk: ${tree.survivalRisk} | Water: ${tree.waterPerWeek} L/week</small>
                </div>
                <div style="text-align: right;">
                    <span style="color: var(--green-primary); font-weight: bold;">Score: ${Math.round(tree.score)}</span>
                </div>
            </div>
        `;
    });
    treesHtml += '</div>';
    document.getElementById('climateTrees').innerHTML = treesHtml;

    let monthsHtml = '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;">';
    recommendations.bestPlantingMonths.forEach(month => {
        monthsHtml += `
            <span class="achievement-badge unlocked" style="font-size: 1rem; padding: 0.75rem 1rem;">
                ${month}
            </span>
        `;
    });
    monthsHtml += '</div>';
    document.getElementById('plantingMonths').innerHTML = monthsHtml;

    let considerationsHtml = '<ul style="margin-top: 1rem; padding-left: 1.5rem;">';
    recommendations.considerations.forEach(consideration => {
        considerationsHtml += `<li style="margin-bottom: 0.5rem;">${consideration}</li>`;
    });
    considerationsHtml += '</ul>';
    document.getElementById('climateConsiderations').innerHTML = considerationsHtml;

    let calendarHtml = '<div style="margin-top: 1rem;">';
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    months.forEach(month => {
        if (calendar.calendar[month] && calendar.calendar[month].length > 0) {
            calendarHtml += `
                <div class="card" style="margin-bottom: 1rem;">
                    <h4 style="color: var(--green-primary); margin-bottom: 1rem;">${month}</h4>
                    <div style="display: grid; gap: 0.75rem;">
            `;
            calendar.calendar[month].slice(0, 5).forEach(tree => {
                calendarHtml += `
                    <div style="background: var(--green-light); padding: 0.75rem; border-radius: 6px; border-left: 4px solid var(--green-primary);">
                        <strong>${tree.species}</strong> - ${tree.co2PerYear} kg CO₂/year
                        <span style="float: right; color: var(--green-primary); font-weight: bold;">
                            Priority: ${Math.round(tree.priority)}
                        </span>
                    </div>
                `;
            });
            calendarHtml += '</div></div>';
        }
    });
    calendarHtml += `
        <button class="btn btn-outline" style="margin-top: 1rem;" onclick="showVisualCalendar('${city}')">
            View Full Calendar
        </button>
    `;
    document.getElementById('plantingCalendar').innerHTML = calendarHtml;

    document.getElementById('climateResults').style.display = 'block';
    document.getElementById('climateResults').scrollIntoView({ behavior: 'smooth' });
}

function showCalendar(event) {
    event.preventDefault();
    
    const city = document.getElementById('calendarCity').value;
    if (!city) {
        Utils.showAlert('Please select a city', 'error');
        return;
    }

    const calendarHTML = PlantationCalendar.getCalendarHTML(city);
    document.getElementById('visualCalendar').innerHTML = calendarHTML;
    document.getElementById('calendarResults').style.display = 'block';
    document.getElementById('calendarResults').scrollIntoView({ behavior: 'smooth' });
}

function showVisualCalendar(city) {
    const calendarHTML = PlantationCalendar.getCalendarHTML(city);
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 90%; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="this.parentElement.parentElement.remove();">&times;</span>
            <h2>Planting Calendar for ${city}</h2>
            ${calendarHTML}
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

