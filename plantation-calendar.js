// Visual Plantation Calendar

const PlantationCalendar = {
    // Generate visual calendar for a city
    generateCalendar(city) {
        const climate = ClimateRecommender.getClimateZone(city);
        const calendar = ClimateCalendar.getPlantingCalendar(city);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];

        const calendarData = {
            city: city,
            climate: climate,
            months: months.map(month => ({
                name: month,
                trees: calendar.calendar[month] || [],
                isBestMonth: ClimateRecommender.getBestPlantingMonths(climate.zone, climate.subzone).includes(month)
            }))
        };

        return calendarData;
    },

    // Get visual calendar HTML
    getCalendarHTML(city) {
        const calendar = this.generateCalendar(city);
        const currentMonth = new Date().getMonth();

        let html = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
        `;

        calendar.months.forEach((month, index) => {
            const isCurrent = index === currentMonth;
            const hasTrees = month.trees.length > 0;
            const isBest = month.isBestMonth;

            html += `
                <div class="card" style="border-left: 4px solid ${isBest ? 'var(--green-primary)' : isCurrent ? '#FF9800' : 'var(--border-color)'}; 
                                        ${isCurrent ? 'box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="color: ${isBest ? 'var(--green-primary)' : 'var(--text-primary)'}; margin: 0;">
                            ${month.name}
                            ${isCurrent ? ' <span style="color: #FF9800;">(Current)</span>' : ''}
                        </h3>
                        ${isBest ? '<span class="achievement-badge unlocked">🌱 Best</span>' : ''}
                    </div>
                    
                    ${hasTrees ? `
                        <div style="display: grid; gap: 0.5rem;">
                            ${month.trees.slice(0, 5).map(tree => `
                                <div style="background: var(--green-light); padding: 0.75rem; border-radius: 6px; border-left: 3px solid var(--green-primary);">
                                    <strong>${tree.species}</strong><br>
                                    <small>${tree.co2PerYear} kg CO₂/year | Priority: ${Math.round(tree.priority)}</small>
                                </div>
                            `).join('')}
                            ${month.trees.length > 5 ? `<small style="text-align: center; color: var(--text-secondary); margin-top: 0.5rem;">
                                +${month.trees.length - 5} more species
                            </small>` : ''}
                        </div>
                    ` : `
                        <div style="text-align: center; color: var(--text-secondary); padding: 2rem 0;">
                            <p>No recommended plantings this month</p>
                        </div>
                    `}
                </div>
            `;
        });

        html += '</div>';

        return html;
    }
};


