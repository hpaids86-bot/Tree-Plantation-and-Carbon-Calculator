// Carbon Calculator Logic

let currentCalculation = null;
let plannerTimelineChart = null;

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const speciesSelect = document.getElementById('species');

    // Handle species selection
    if (speciesSelect) {
        speciesSelect.addEventListener('change', (e) => {
            const isCustom = e.target.value === 'Custom';
            document.getElementById('customSpeciesGroup').style.display = isCustom ? 'block' : 'none';
            document.getElementById('customCO2Group').style.display = isCustom ? 'block' : 'none';

            if (isCustom) {
                document.getElementById('customSpeciesName').required = true;
                document.getElementById('customCO2').required = true;
            } else {
                document.getElementById('customSpeciesName').required = false;
                document.getElementById('customCO2').required = false;
            }
        });
    }

    // Handle form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateImpact();
        });
    }

    populatePlannerSpecies();
    populateCityDropdown();
    
    const footprintBtn = document.getElementById('footprintCalcBtn');
    if (footprintBtn) {
        footprintBtn.addEventListener('click', calculateTreesFromFootprint);
    }
    
    const timelineBtn = document.getElementById('timelineCalcBtn');
    if (timelineBtn) {
        timelineBtn.addEventListener('click', calculatePlannerTimeline);
    }
});

// Calculate carbon impact
function calculateImpact() {
    const species = document.getElementById('species').value;
    const count = parseInt(document.getElementById('count').value);
    const years = parseInt(document.getElementById('years').value);
    const city = document.getElementById('calculatorCity').value;

    if (!species || !count || !years || !city) {
        Utils.showAlert('Please fill in all required fields', 'error');
        return;
    }

    if (count > 1000000) {
        Utils.showAlert('Tree count is capped at 1,000,000 per scenario.', 'error');
        return;
    }

    let speciesName = species;
    let co2PerYear;

    if (species === 'Custom') {
        speciesName = document.getElementById('customSpeciesName').value;
        co2PerYear = parseFloat(document.getElementById('customCO2').value);

        if (!speciesName || !co2PerYear) {
            Utils.showAlert('Please enter custom species details', 'error');
            return;
        }
    } else {
        const tree = getTreeData(species);
        co2PerYear = tree ? (tree.co2PerYear || tree) : 20;
    }

    // Calculate CO2 absorption
    const annualCO2 = co2PerYear * count;
    const totalCO2 = annualCO2 * years;
    const totalCO2Tonnes = parseFloat(Utils.kgToTonnes(totalCO2));
    const carEquivalents = parseFloat(Utils.calculateCarEquivalents(totalCO2Tonnes));

    // Store calculation
    currentCalculation = {
        species: speciesName,
        count: count,
        years: years,
        co2PerYear: co2PerYear,
        annualCO2: annualCO2,
        totalCO2: totalCO2,
        totalCO2Tonnes: totalCO2Tonnes,
        carEquivalents: carEquivalents,
        location: city
    };

    // Save to localStorage
    Calculations.save(currentCalculation);

    // Display results
    displayResults(currentCalculation);

    Utils.showAlert('Calculation saved successfully!', 'success');
}

// Display calculation results
function displayResults(calc) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');

    resultsContent.innerHTML = `
        <div class="results" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div class="result-item" style="padding: 0.75rem 1rem; background: rgba(126, 217, 87, 0.1); border-radius: 10px;">
                <span><strong>Tree Species:</strong> ${calc.species}</span>
            </div>
            <div class="result-item" style="padding: 0.75rem 1rem; background: rgba(126, 217, 87, 0.1); border-radius: 10px;">
                <span><strong>Number of Trees:</strong> ${Utils.formatNumber(calc.count)}</span>
            </div>
            <div class="result-item" style="padding: 0.75rem 1rem; background: rgba(126, 217, 87, 0.1); border-radius: 10px;">
                <span><strong>Individual CO₂ Absorption:</strong> ${calc.co2PerYear} kg per tree per year</span>
            </div>
            <div class="result-item" style="padding: 0.75rem 1rem; background: rgba(126, 217, 87, 0.1); border-radius: 10px;">
                <span><strong>Annual Plantation Offset:</strong> ${Utils.formatNumber(calc.annualCO2)} kg (${Utils.kgToTonnes(calc.annualCO2)} tonnes/year)</span>
            </div>
            <div class="result-item" style="padding: 0.75rem 1rem; background: rgba(126, 217, 87, 0.1); border-radius: 10px;">
                <span><strong>Cumulative CO₂ Offset (${calc.years} years):</strong> ${Utils.formatNumber(calc.totalCO2)} kg (${calc.totalCO2Tonnes} tonnes total)</span>
            </div>
            <div class="result-item" style="padding: 0.75rem 1rem; background: rgba(126, 217, 87, 0.1); border-radius: 10px;">
                <span><strong>Equivalent Car Emissions Offset:</strong> ${calc.carEquivalents} cars (assuming avg 4.6 tonnes/car/year)</span>
            </div>
            ${calc.location ? `<div class="result-item" style="padding: 0.75rem 1rem; background: rgba(126, 217, 87, 0.1); border-radius: 10px;">
                <span><strong>Target City:</strong> ${calc.location}</span>
            </div>` : ''}
        </div>
    `;

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Reset calculator
function resetCalculator() {
    document.getElementById('calculatorForm').reset();
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('customSpeciesGroup').style.display = 'none';
    document.getElementById('customCO2Group').style.display = 'none';
    const citySelect = document.getElementById('calculatorCity');
    if (citySelect) {
        citySelect.value = '';
    }
    currentCalculation = null;
}

function populatePlannerSpecies() {
    if (typeof TREE_SPECIES === 'undefined') return;
    const speciesOptions = Object.keys(TREE_SPECIES)
        .map(species => {
            const tree = getTreeData(species);
            return `<option value="${species}">${species} (${tree.co2PerYear} kg CO₂/yr)</option>`;
        })
        .join('');
    
    ['species', 'footprintSpecies', 'plannerSpecies'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = `<option value="">Select species</option>${speciesOptions}<option value="Custom">Custom Species</option>`;
        }
    });
}

function populateCityDropdown() {
    const citySelect = document.getElementById('calculatorCity');
    if (!citySelect) return;
    const cities = typeof INDIAN_CITIES !== 'undefined'
        ? Object.keys(INDIAN_CITIES).sort()
        : [];
    const options = cities.length
        ? cities.map(city => `<option value="${city}">${city}</option>`).join('')
        : `<option value="Delhi">Delhi</option><option value="Mumbai">Mumbai</option>`;
    citySelect.innerHTML = `<option value="">Select a city</option>${options}`;
}

function calculateTreesFromFootprint() {
    const footprint = parseFloat(document.getElementById('annualFootprint').value);
    const species = document.getElementById('footprintSpecies').value;

    if (!footprint || footprint <= 0) {
        Utils.showAlert('Enter a valid CO₂ footprint.', 'error');
        return;
    }
    if (!species) {
        Utils.showAlert('Please select a tree species.', 'error');
        return;
    }

    const tree = getTreeData(species);
    const co2PerYear = tree?.co2PerYear || 20;
    const treesNeeded = Math.ceil(footprint / co2PerYear);
    const fiveYearAbsorption = treesNeeded * co2PerYear * 5;

    const result = `
        To offset ${Utils.formatNumber(footprint)} kg of CO₂ emissions annually, you need to plant:<br>
        <strong>${Utils.formatNumber(treesNeeded)}</strong> ${species} trees.<br><br>
        <small>Projected 5-year offset: <strong>${Utils.formatNumber(fiveYearAbsorption)}</strong> kg CO₂.</small>
    `;
    const resultEl = document.getElementById('footprintPlannerResult');
    resultEl.innerHTML = result;
    resultEl.style.display = 'block';
}

function calculatePlannerTimeline() {
    const trees = parseInt(document.getElementById('plannerTreeCount').value, 10);
    const species = document.getElementById('plannerSpecies').value;

    if (!trees || trees <= 0) {
        Utils.showAlert('Enter a valid tree count.', 'error');
        return;
    }
    if (!species) {
        Utils.showAlert('Please select a tree species.', 'error');
        return;
    }

    const tree = getTreeData(species);
    const co2PerYear = tree?.co2PerYear || 20;
    const intervals = [1, 5, 10, 20];
    const timeline = intervals.map(years => trees * co2PerYear * years);

    const chartBox = document.getElementById('chartContainer');
    if (chartBox) {
        chartBox.style.display = 'block';
    }

    const ctx = document.getElementById('plannerTimelineChart').getContext('2d');
    if (plannerTimelineChart) {
        plannerTimelineChart.destroy();
    }

    plannerTimelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: intervals.map(years => `${years} yr${years > 1 ? 's' : ''}`),
            datasets: [{
                label: `CO₂ absorbed (kg)`,
                data: timeline,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(126, 217, 87, 0.15)',
                tension: 0.35,
                fill: true,
                borderWidth: 3,
                pointBackgroundColor: '#1B4332'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(27, 67, 50, 0.05)'
                    },
                    ticks: {
                        color: '#1B4332',
                        font: { family: 'Outfit' }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#1B4332',
                        font: { family: 'Outfit' }
                    }
                }
            }
        }
    });

    const summary = `
        <strong> Plantation trajectory for ${Utils.formatNumber(trees)} ${species} trees:</strong><br>
        - Year 1: ${Utils.formatNumber(timeline[0])} kg CO₂ offset<br>
        - Year 5: ${Utils.formatNumber(timeline[1])} kg CO₂ offset<br>
        - Year 10: ${Utils.formatNumber(timeline[2])} kg CO₂ offset<br>
        - Year 20: ${Utils.formatNumber(timeline[3])} kg CO₂ offset
    `;
    const summaryEl = document.getElementById('timelineSummary');
    summaryEl.innerHTML = summary;
    summaryEl.style.display = 'block';
}

// Generate PDF Tree Passport
function generatePDF() {
    if (!currentCalculation) {
        Utils.showAlert('No calculation to generate PDF', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Theme green colors
    const primaryGreen = [76, 175, 80]; // #4CAF50
    const textGreen = [27, 67, 50]; // #1B4332

    // Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(textGreen[0], textGreen[1], textGreen[2]);
    doc.text('EcoTree AI Sustainability Platform', 105, 22, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('OFFICIAL ECOLOGICAL PASSPORT', 105, 30, { align: 'center' });

    // Border line
    doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.setLineWidth(1);
    doc.line(20, 36, 190, 36);

    let yPos = 48;

    // Spec card background
    doc.setFillColor(244, 255, 244);
    doc.rect(20, yPos - 5, 170, 42, 'F');
    doc.setDrawColor(200, 235, 200);
    doc.rect(20, yPos - 5, 170, 42, 'S');

    doc.setFontSize(11);
    doc.setTextColor(textGreen[0], textGreen[1], textGreen[2]);
    doc.setFont('Helvetica', 'bold');
    doc.text('PLANTATION OVERVIEW', 25, yPos);
    yPos += 8;

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Tree Species: ${currentCalculation.species}`, 25, yPos);
    doc.text(`Number of Trees Planted: ${Utils.formatNumber(currentCalculation.count)}`, 110, yPos);
    yPos += 8;
    doc.text(`Individual Absorption Rate: ${currentCalculation.co2PerYear} kg CO₂/tree/year`, 25, yPos);
    if (currentCalculation.location) {
        doc.text(`Plantation Location: ${currentCalculation.location}`, 110, yPos);
    }
    yPos += 8;
    doc.text(`Projected Horizon: ${currentCalculation.years} years`, 25, yPos);
    yPos += 15;

    // Table header
    doc.setFontSize(10);
    doc.setFillColor(textGreen[0], textGreen[1], textGreen[2]);
    doc.rect(20, yPos - 5, 170, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.text('Year', 25, yPos);
    doc.text('Annual CO₂ Absorbed (kg)', 75, yPos);
    doc.text('Cumulative CO₂ Offset (kg)', 135, yPos);

    yPos += 6;
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'normal');

    let cumulative = 0;
    const maxRows = Math.min(15, currentCalculation.years);
    for (let year = 1; year <= maxRows; year++) {
        const growthFactor = 0.6 + (year / currentCalculation.years) * 0.4;
        const yearCO2 = currentCalculation.annualCO2 * growthFactor;
        cumulative += yearCO2;

        doc.text(year.toString(), 25, yPos);
        doc.text(Math.round(yearCO2).toString(), 75, yPos);
        doc.text(Math.round(cumulative).toString(), 135, yPos);
        yPos += 6;
    }

    if (currentCalculation.years > 15) {
        doc.setFont('Helvetica', 'oblique');
        doc.text('... Timeline truncated for presentation. Full data available on portal.', 25, yPos);
        yPos += 8;
    }

    yPos += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Summary
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(textGreen[0], textGreen[1], textGreen[2]);
    doc.text('ECOLOGICAL IMPACT SUMMARY', 20, yPos);
    yPos += 8;

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Total Lifetime Offset: ${Utils.formatNumber(currentCalculation.totalCO2)} kg (${currentCalculation.totalCO2Tonnes} Tonnes) of carbon`, 20, yPos);
    yPos += 7;
    doc.text(`Car Emission Equivalents: ${currentCalculation.carEquivalents} passenger cars offset for one year`, 20, yPos);

    // QR Code
    yPos += 15;
    const qrData = `${window.location.origin}${window.location.pathname}?species=${encodeURIComponent(currentCalculation.species)}&count=${currentCalculation.count}`;

    QRCode.toDataURL(qrData, { width: 50, margin: 1 }, (err, url) => {
        if (!err) {
            doc.addImage(url, 'PNG', 145, yPos - 12, 30, 30);
        }
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text('Verification Code', 145, yPos + 22);

        // Footer
        doc.setFontSize(9);
        doc.text(`Generated on ${new Date().toLocaleDateString()} • EcoTree Research Network`, 105, 282, { align: 'center' });

        // Save PDF
        doc.save(`EcoTree_Passport_${currentCalculation.species.replace(/\s+/g, '_')}.pdf`);
    });
}
