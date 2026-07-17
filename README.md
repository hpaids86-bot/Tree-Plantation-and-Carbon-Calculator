# Tree Plantation Carbon Reduction Calculator

A full-stack Flask application that estimates annual and long-range CO₂ absorption from tree plantation drives. Users can log tree types, discover climate-aware recommendations by city, and view a dashboard with impact badges and Chart.js visualizations.

## Features
- Tree CO₂ absorption calculator (Neem, Mango, Banyan, Teak, etc.) using fixed annual rates gathered from openly available forestry and plantation references (compiled via Google).
- City → climate mapping engine with tailored tree suggestions.
- 5-year and 10-year CO₂ projections using simple growth multipliers.
- History storage (tree, quantity, city, CO₂ result, timestamp) in SQLite.
- Dashboard showing totals, badges (Bronze → Platinum), history table, and Chart.js graph.
- Tree growth visualizer slider for quick horizon previews.

## Tech Stack
- **Backend:** Python 3.11+, Flask 3
- **Frontend:** HTML, CSS, vanilla JavaScript, Chart.js
- **Database:** SQLite (auto-created `carbon.db`)

## Quick Start
1. **Clone / open project** in VS Code.
2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv .venv
   .venv\\Scripts\\activate        # Windows PowerShell
   source .venv/bin/activate      # macOS / Linux
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the development server:**
   ```bash
   flask --app app run --debug
   ```
   On first launch the app seeds SQLite tables using `trees.json` and `cities.json`.
5. **Visit** http://127.0.0.1:5000 to use the calculator. Open `/dashboard` for history & charts.

## Project Structure
```
project-root/
├── app.py                # Flask routes and view logic
├── database.py           # SQLite helpers + seeders
├── carbon.db             # Auto-created database (git-ignored)
├── trees.json            # Tree absorption reference data
├── cities.json           # City climates + recommendations
├── requirements.txt
├── README.md
├── static/
│   ├── style.css
│   └── script.js
└── templates/
    ├── index.html
    ├── result.html
    └── dashboard.html
```

## Environmental Impact Scoring
- **Bronze:** < 1,000 kg annual CO₂ captured
- **Silver:** 1,000 – 2,499 kg
- **Gold:** 2,500 – 4,999 kg
- **Platinum:** 5,000+ kg

## Data Notes
- Tree absorption rates and climate recommendations are compiled from publicly shared horticulture and forestry statistics discoverable via Google (e.g., India State of Forest Report summaries, urban forestry guides, nursery advisories). Values are approximations for educational/demo use.
- You can edit `trees.json` / `cities.json` and re-run the app to customize datasets.

## Next Ideas
- Add authentication for multi-user tracking.
- Export historical data as CSV.
- Integrate geocoding or live weather APIs.
