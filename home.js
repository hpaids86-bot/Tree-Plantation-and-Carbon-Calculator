// Home page logic: Seeds Catalog and Budget Calculator

const HomeInsights = {
    seedCatalog: [
        { name: 'Neem', price: 45, growth: 'Fast (3-5 yrs)', co2PerYear: 20, suitability: 'All Regions / Arid' },
        { name: 'Banyan', price: 80, growth: 'Slow (10+ yrs)', co2PerYear: 48, suitability: 'Tropical Savanna' },
        { name: 'Peepal', price: 70, growth: 'Medium (5-8 yrs)', co2PerYear: 45, suitability: 'Tropical Monsoon' },
        { name: 'Bamboo', price: 30, growth: 'Very Fast (1-3 yrs)', co2PerYear: 40, suitability: 'Humid / Coastal' },
        { name: 'Mango', price: 120, growth: 'Medium (5-8 yrs)', co2PerYear: 22, suitability: 'Tropical/Sub-tropical' },
        { name: 'Mahogany', price: 150, growth: 'Slow (10+ yrs)', co2PerYear: 32, suitability: 'Wet Zone / Rainforest' },
        { name: 'Eucalyptus', price: 40, growth: 'Fast (3-5 yrs)', co2PerYear: 30, suitability: 'Highlands / Plain' },
        { name: 'Teak', price: 110, growth: 'Slow (10+ yrs)', co2PerYear: 28, suitability: 'Alluvial / Dry zones' },
        { name: 'Acacia', price: 35, growth: 'Fast (2-4 yrs)', co2PerYear: 15, suitability: 'Hot Desert / Arid' },
        { name: 'Pine', price: 90, growth: 'Medium (8-12 yrs)', co2PerYear: 12, suitability: 'Temperate / Hilly' },
        { name: 'Cedar', price: 140, growth: 'Slow (15+ yrs)', co2PerYear: 35, suitability: 'Sub-alpine / Cold' },
        { name: 'Gulmohar', price: 55, growth: 'Fast (3-5 yrs)', co2PerYear: 18, suitability: 'Tropical Streets' },
        { name: 'Jamun', price: 80, growth: 'Medium (5-8 yrs)', co2PerYear: 24, suitability: 'Wet Soils / Clay' },
        { name: 'Arjun', price: 75, growth: 'Medium (6-10 yrs)', co2PerYear: 26, suitability: 'Riverbanks / Alluvial' },
        { name: 'Guava', price: 50, growth: 'Fast (2-4 yrs)', co2PerYear: 18, suitability: 'Tropical orchards' },
        { name: 'Lemon', price: 40, growth: 'Fast (2-3 yrs)', co2PerYear: 15, suitability: 'Loamy garden soil' },
        { name: 'Papaya', price: 25, growth: 'Very Fast (1 yr)', co2PerYear: 10, suitability: 'Warm Sandy Loam' },
        { name: 'Curry Leaf', price: 20, growth: 'Fast (1-2 yrs)', co2PerYear: 8, suitability: 'Sub-tropical gardens' },
        { name: 'Drumstick', price: 30, growth: 'Very Fast (1 yr)', co2PerYear: 25, suitability: 'Arid / Low Water' },
        { name: 'Amla', price: 50, growth: 'Medium (4-6 yrs)', co2PerYear: 22, suitability: 'Sub-tropical Plains' },
        { name: 'Custard Apple', price: 45, growth: 'Fast (3-4 yrs)', co2PerYear: 16, suitability: 'Stony / Rocky slopes' },
        { name: 'Sapodilla', price: 60, growth: 'Medium (5-8 yrs)', co2PerYear: 20, suitability: 'Coastal / Saline soils' },
        { name: 'Sandalwood', price: 150, growth: 'Slow (12-15 yrs)', co2PerYear: 29, suitability: 'Dry Deciduous Forest' },
        { name: 'Casuarina', price: 38, growth: 'Fast (3-5 yrs)', co2PerYear: 27, suitability: 'Sandy Coastal dunes' },
        { name: 'Tamarind', price: 58, growth: 'Slow (10+ yrs)', co2PerYear: 26, suitability: 'Dry plains / Roadsides' },
        { name: 'Coconut', price: 90, growth: 'Medium (6-8 yrs)', co2PerYear: 22, suitability: 'Coastal Sandy soils' },
        { name: 'Jackfruit', price: 95, growth: 'Slow (8-12 yrs)', co2PerYear: 24, suitability: 'Humid Tropical plains' },
        { name: 'Palash', price: 45, growth: 'Medium (5-7 yrs)', co2PerYear: 19, suitability: 'Arid / Forest margins' },
        { name: 'Amaltas', price: 50, growth: 'Medium (4-6 yrs)', co2PerYear: 20, suitability: 'Roadsides / Dry forests' },
        { name: 'Kadam', price: 55, growth: 'Fast (3-5 yrs)', co2PerYear: 22, suitability: 'Moist clay valleys' },
        { name: 'Shisham', price: 80, growth: 'Medium (6-8 yrs)', co2PerYear: 28, suitability: 'Alluvial river valleys' },
        { name: 'Moringa', price: 35, growth: 'Very Fast (1 yr)', co2PerYear: 35, suitability: 'Dry Plains / Drought hit' }
    ],

    init() {
        this.initSeedsPricing();
    },

    initSeedsPricing() {
        this.renderSeedsCatalog(this.seedCatalog);
        const budgetInput = document.getElementById('budgetInput');
        if (budgetInput) {
            budgetInput.addEventListener('input', (e) => this.calculateBudget(e.target.value));
        }
    },

    renderSeedsCatalog(seeds) {
        const grid = document.getElementById('seedsGrid');
        if (!grid) return;

        grid.innerHTML = seeds.map(seed => `
            <div class="seed-card">
                <div class="seed-header">
                    <span class="seed-title">${seed.name}</span>
                    <span class="seed-price">₹${seed.price}</span>
                </div>
                <div class="seed-stats">
                    <div><span>Growth Time:</span> <strong>${seed.growth}</strong></div>
                    <div><span>CO₂ Absorption:</span> <strong>${seed.co2PerYear} kg/yr</strong></div>
                    <div><span>Ideal Habitat:</span> <strong>${seed.suitability}</strong></div>
                </div>
            </div>
        `).join('');
    },

    calculateBudget(amount) {
        const budget = parseFloat(amount);
        const elTrees = document.getElementById('calcPotentialTrees');
        const elCO2 = document.getElementById('calcPotentialCO2');

        if (!budget || budget <= 0) {
            elTrees.textContent = '--';
            elCO2.textContent = '--';
            return;
        }

        // Calculate based on a weighted average of affordable seeds
        const sortedByPrice = [...this.seedCatalog].sort((a, b) => a.price - b.price);
        
        // Find how many of the cheapest species can be bought
        const cheapestPrice = sortedByPrice[0].price;
        const potentialMaxTrees = Math.floor(budget / cheapestPrice);
        
        // Let's also do a realistic mix calculation:
        // Assume they buy a balanced mix of popular seeds (avg price of catalog)
        let totalCost = 0;
        let count = 0;
        let idx = 0;
        while (totalCost <= budget) {
            const currentItem = sortedByPrice[idx % sortedByPrice.length];
            if (totalCost + currentItem.price > budget) {
                break;
            }
            totalCost += currentItem.price;
            count++;
            idx++;
        }

        const avgCO2PerYear = 25; // average absorption rate (kg)
        const totalCO2 = count * avgCO2PerYear * 10; // offset over 10 years

        elTrees.textContent = `${count} - ${potentialMaxTrees}`;
        elCO2.textContent = new Intl.NumberFormat('en-IN').format(totalCO2);
    }
};

window.HomeInsights = HomeInsights;
