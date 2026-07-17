// EcoTree AI – Enhanced Smart Budget Calculator
// 30+ Indian tree species with comprehensive data

const BudgetCalculator = (() => {
    const SPECIES_CATALOG = [
        { name: 'Neem',            cost: 45,  co2: 20, cooling: 7, growth: 'Fast',    survival: 92, category: 'shade' },
        { name: 'Peepal',          cost: 70,  co2: 45, cooling: 9, growth: 'Medium',  survival: 95, category: 'shade' },
        { name: 'Banyan',          cost: 80,  co2: 48, cooling: 9, growth: 'Slow',    survival: 96, category: 'shade' },
        { name: 'Mango',           cost: 120, co2: 22, cooling: 6, growth: 'Medium',  survival: 88, category: 'fruit' },
        { name: 'Tamarind',        cost: 58,  co2: 26, cooling: 7, growth: 'Slow',    survival: 94, category: 'shade' },
        { name: 'Teak',            cost: 110, co2: 28, cooling: 6, growth: 'Slow',    survival: 87, category: 'timber' },
        { name: 'Bamboo',          cost: 30,  co2: 40, cooling: 5, growth: 'V.Fast',  survival: 91, category: 'fastgrow' },
        { name: 'Moringa',         cost: 35,  co2: 35, cooling: 5, growth: 'V.Fast',  survival: 90, category: 'fastgrow' },
        { name: 'Casuarina',       cost: 38,  co2: 27, cooling: 5, growth: 'Fast',    survival: 89, category: 'fastgrow' },
        { name: 'Eucalyptus',      cost: 40,  co2: 30, cooling: 4, growth: 'Fast',    survival: 90, category: 'fastgrow' },
        { name: 'Jamun',           cost: 80,  co2: 24, cooling: 7, growth: 'Medium',  survival: 88, category: 'fruit' },
        { name: 'Arjun',           cost: 75,  co2: 26, cooling: 7, growth: 'Medium',  survival: 89, category: 'shade' },
        { name: 'Indian Rosewood', cost: 140, co2: 32, cooling: 8, growth: 'Slow',    survival: 87, category: 'timber' },
        { name: 'Amla',            cost: 50,  co2: 22, cooling: 6, growth: 'Medium',  survival: 88, category: 'fruit' },
        { name: 'Mahogany',        cost: 150, co2: 32, cooling: 7, growth: 'Slow',    survival: 86, category: 'timber' },
        { name: 'Ashoka',          cost: 60,  co2: 18, cooling: 6, growth: 'Medium',  survival: 87, category: 'ornamental' },
        { name: 'Kadamba',         cost: 55,  co2: 22, cooling: 7, growth: 'Fast',    survival: 88, category: 'shade' },
        { name: 'Gulmohar',        cost: 55,  co2: 18, cooling: 6, growth: 'Fast',    survival: 85, category: 'ornamental' },
        { name: 'Pongamia',        cost: 50,  co2: 24, cooling: 7, growth: 'Medium',  survival: 92, category: 'shade' },
        { name: 'Jackfruit',       cost: 95,  co2: 24, cooling: 7, growth: 'Slow',    survival: 87, category: 'fruit' },
        { name: 'Coconut',         cost: 90,  co2: 22, cooling: 5, growth: 'Medium',  survival: 85, category: 'fruit' },
        { name: 'Palmyra',         cost: 85,  co2: 20, cooling: 5, growth: 'Slow',    survival: 88, category: 'timber' },
        { name: 'Drumstick',       cost: 30,  co2: 25, cooling: 5, growth: 'V.Fast',  survival: 93, category: 'fastgrow' },
        { name: 'Bael',            cost: 50,  co2: 21, cooling: 6, growth: 'Medium',  survival: 90, category: 'fruit' },
        { name: 'Karanj',          cost: 40,  co2: 24, cooling: 6, growth: 'Medium',  survival: 94, category: 'shade' },
        { name: 'Silver Oak',      cost: 75,  co2: 30, cooling: 7, growth: 'Fast',    survival: 88, category: 'timber' },
        { name: 'Rain Tree',       cost: 90,  co2: 35, cooling: 9, growth: 'Fast',    survival: 90, category: 'shade' },
        { name: 'Wild Almond',     cost: 65,  co2: 28, cooling: 8, growth: 'Medium',  survival: 89, category: 'shade' },
        { name: 'Indian Cork Tree',cost: 70,  co2: 22, cooling: 6, growth: 'Medium',  survival: 87, category: 'ornamental' },
        { name: 'Peltophorum',     cost: 60,  co2: 26, cooling: 7, growth: 'Fast',    survival: 88, category: 'ornamental' },
    ];

    // Category distribution ratios and colors
    const CATEGORIES = {
        shade:      { label: 'Native Shade Trees',  pct: 0.40, color: '#4CAF50' },
        fruit:      { label: 'Fruit & Food Trees',  pct: 0.25, color: '#FF9800' },
        fastgrow:   { label: 'Fast-Growing Species',pct: 0.20, color: '#03A9F4' },
        ornamental: { label: 'Ornamental Trees',    pct: 0.10, color: '#9C27B0' },
        timber:     { label: 'Timber Trees',        pct: 0.05, color: '#795548' },
    };

    // Budget preset values
    const PRESETS = [500, 1000, 5000, 10000, 50000, 100000];

    function calculate(budget) {
        if (!budget || budget <= 0) return null;

        // Sort by cost ascending to find cheapest first
        const sorted = [...SPECIES_CATALOG].sort((a, b) => a.cost - b.cost);
        const avgCost = SPECIES_CATALOG.reduce((s, x) => s + x.cost, 0) / SPECIES_CATALOG.length;

        // Max trees at cheapest price
        const maxTrees = Math.floor(budget / sorted[0].cost);

        // Realistic mix count using rotating cheapest allocation
        let totalCost = 0, count = 0, idx = 0;
        while (totalCost + sorted[idx % sorted.length].cost <= budget) {
            totalCost += sorted[idx % sorted.length].cost;
            count++;
            idx++;
        }

        // Distribution per category
        const distribution = {};
        Object.entries(CATEGORIES).forEach(([cat, cfg]) => {
            const alloc = budget * cfg.pct;
            const catSpecies = sorted.filter(s => s.category === cat);
            const avgCatCost = catSpecies.length > 0
                ? catSpecies.reduce((s, x) => s + x.cost, 0) / catSpecies.length
                : avgCost;
            distribution[cat] = {
                ...cfg,
                budget: alloc,
                trees: Math.floor(alloc / avgCatCost),
                avgCost: Math.round(avgCatCost)
            };
        });

        // Species mix: top 6 most affordable, sorted by value (CO₂ per rupee)
        const speciesMix = [...SPECIES_CATALOG]
            .filter(s => s.cost <= budget)
            .sort((a, b) => (b.co2 / b.cost) - (a.co2 / a.cost))
            .slice(0, 6)
            .map(s => ({
                ...s,
                affordable: Math.floor(budget / s.cost),
                co2_10yr: s.co2 * 10
            }));

        const totalCO2_10yr = count * 22 * 10; // avg 22 kg/yr per tree over 10 years
        const totalO2_10yr = count * 740;       // avg 740 kg O₂/yr per tree

        return { budget, maxTrees, count, distribution, speciesMix, totalCO2_10yr, totalO2_10yr };
    }

    function renderResults(result, containerId) {
        const container = document.getElementById(containerId);
        if (!container || !result) return;

        const fmt = n => n.toLocaleString('en-IN');

        container.innerHTML = `
            <!-- Summary Row -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div class="score-metric-card" style="text-align: center;">
                    <div class="score-metric-label">🌳 Total Trees</div>
                    <div class="score-metric-value text-gradient" data-countup="${result.count}" data-duration="1500">${fmt(result.count)}</div>
                    <div style="font-size:0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Max possible: ${fmt(result.maxTrees)}</div>
                </div>
                <div class="score-metric-card" style="text-align: center;">
                    <div class="score-metric-label">💨 CO₂ Offset (10yr)</div>
                    <div class="score-metric-value text-gradient" data-countup="${result.totalCO2_10yr}" data-duration="1800">${fmt(result.totalCO2_10yr)}</div>
                    <div style="font-size:0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">kg of CO₂</div>
                </div>
                <div class="score-metric-card" style="text-align: center;">
                    <div class="score-metric-label">🌬️ O₂ Generated (10yr)</div>
                    <div class="score-metric-value text-gradient" data-countup="${result.totalO2_10yr}" data-duration="1800">${fmt(result.totalO2_10yr)}</div>
                    <div style="font-size:0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">kg of Oxygen</div>
                </div>
            </div>

            <!-- Distribution -->
            <div class="budget-distribution">
                <h4>📊 Recommended Plantation Distribution</h4>
                ${Object.entries(result.distribution).map(([cat, d]) => `
                    <div class="distribution-row">
                        <div class="distribution-label">${d.label}</div>
                        <div class="distribution-bar-wrap">
                            <div class="distribution-bar-fill" style="width: 0%; background: ${d.color};" data-width="${d.pct * 100}%"></div>
                        </div>
                        <div class="distribution-amount">~${fmt(d.trees)} trees</div>
                    </div>
                `).join('')}
            </div>

            <!-- Species Mix Table -->
            <div class="species-mix-table">
                <div class="species-mix-row head-row">
                    <span>Species</span>
                    <span>₹/Sapling</span>
                    <span>CO₂/yr</span>
                    <span>Cooling</span>
                    <span>Growth</span>
                    <span>Survival</span>
                </div>
                ${result.speciesMix.map(s => `
                    <div class="species-mix-row fade-up">
                        <span><strong>${s.name}</strong></span>
                        <span>₹${s.cost}</span>
                        <span>${s.co2} kg</span>
                        <span>${'⭐'.repeat(Math.ceil(s.cooling/2))}</span>
                        <span class="speed-${s.growth === 'Fast' || s.growth === 'V.Fast' ? 'fast' : s.growth === 'Medium' ? 'medium' : 'slow'}">${s.growth}</span>
                        <span>${s.survival}%</span>
                    </div>
                `).join('')}
            </div>
        `;

        // Trigger animations after render
        setTimeout(() => {
            container.querySelectorAll('.distribution-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.width || '0%';
            });
            container.querySelectorAll('.fade-up').forEach((el, i) => {
                setTimeout(() => el.classList.add('revealed'), i * 80);
            });
        }, 100);
    }

    function initPresets(inputId, calcFn) {
        const presetContainer = document.getElementById('budgetPresets');
        if (!presetContainer) return;
        presetContainer.innerHTML = PRESETS.map(p => `
            <button class="budget-preset-btn" onclick="setBudgetPreset(${p})">₹${p.toLocaleString('en-IN')}</button>
        `).join('');
    }

    return { calculate, renderResults, initPresets, SPECIES_CATALOG, CATEGORIES, PRESETS };
})();

window.BudgetCalculator = BudgetCalculator;
