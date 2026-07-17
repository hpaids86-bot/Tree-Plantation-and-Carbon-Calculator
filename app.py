from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

from flask import Flask, flash, redirect, render_template, request, url_for

import database as db

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev-secret-change-me"

CLIMATE_DESCRIPTIONS: Dict[str, str] = {
    "tropical": "Warm and humid most of the year with heavy monsoon rainfall.",
    "humid": "High moisture levels, ideal for broad-leaved evergreens.",
    "dry": "Hot summers, sparse rainfall – hardy drought-resistant trees thrive.",
    "temperate": "Mild temperatures with defined seasons, diverse species adapt well.",
}

BADGE_THRESHOLDS = [
    (5000, "Platinum"),
    (2500, "Gold"),
    (1000, "Silver"),
    (0, "Bronze"),
]


@dataclass
class ImpactBadge:
    label: str
    color: str


BADGE_COLORS = {
    "Platinum": "#b3c7f9",
    "Gold": "#f5c542",
    "Silver": "#c0c0c0",
    "Bronze": "#cd7f32",
}


def determine_badge(total_kg: float) -> ImpactBadge:
    for threshold, label in BADGE_THRESHOLDS:
        if total_kg >= threshold:
            return ImpactBadge(label=label, color=BADGE_COLORS.get(label, "#4caf50"))
    return ImpactBadge(label="Bronze", color=BADGE_COLORS["Bronze"])


def build_city_payload(cities) -> List[Dict]:
    payload = []
    for city in cities:
        payload.append(
            {
                "id": city["id"],
                "name": city["name"],
                "climate": city["climate"],
                "climateDescription": CLIMATE_DESCRIPTIONS.get(city["climate"], ""),
                "recommendations": db.get_recommendations_for_city(city["id"]),
            }
        )
    return payload


@app.route("/")
def index():
    trees = db.fetch_trees()
    cities = db.fetch_cities()

    if not trees or not cities:
        flash("Reference data missing. Please ensure JSON seed files are present.")

    default_city = cities[0] if cities else None
    recommendations = db.get_recommendations_for_city(default_city["id"]) if default_city else []

    app_payload = {
        "cities": build_city_payload(cities),
        "trees": [{"id": tree["id"], "name": tree["name"], "absorption": tree["absorption_rate"]} for tree in trees],
    }

    return render_template(
        "index.html",
        trees=trees,
        cities=cities,
        default_city=default_city,
        climate_info=CLIMATE_DESCRIPTIONS,
        recommendations=recommendations,
        app_payload=app_payload,
    )


@app.route("/calculate", methods=["POST"])
def calculate():
    tree_id = request.form.get("tree_id")
    city_id = request.form.get("city_id")
    quantity = request.form.get("quantity")

    if not tree_id or not city_id or not quantity:
        flash("Please fill in all the required fields.")
        return redirect(url_for("index"))

    try:
        quantity_val = max(1, int(quantity))
        tree = db.get_tree(int(tree_id))
        city = db.get_city(int(city_id))
    except ValueError:
        flash("Invalid numeric input.")
        return redirect(url_for("index"))

    if not tree or not city:
        flash("Selected tree or city is not available.")
        return redirect(url_for("index"))

    annual_per_tree = tree["absorption_rate"]
    annual_total = annual_per_tree * quantity_val
    projection_5 = annual_total * 5
    projection_10 = annual_total * 10
    impact_score = min(100, round((annual_total / 5000) * 100))
    badge = determine_badge(annual_total)

    db.insert_history(tree["name"], quantity_val, city["name"], annual_total)
    recs = db.get_recommendations_for_city(city["id"])

    result_payload = {
        "tree": tree,
        "city": city,
        "quantity": quantity_val,
        "annual_total": annual_total,
        "projection_5": projection_5,
        "projection_10": projection_10,
        "impact_score": impact_score,
        "badge": badge,
        "recommendations": recs,
        "climate_info": CLIMATE_DESCRIPTIONS,
    }

    return render_template("result.html", **result_payload)


@app.route("/dashboard")
def dashboard():
    history = db.fetch_history(limit=50)
    total_saved = db.get_total_co2()
    badge = determine_badge(total_saved)
    chart_points = db.get_chart_points(limit=30)

    dashboard_payload = {
        "labels": list(chart_points.keys()),
        "values": list(chart_points.values()),
    }

    return render_template(
        "dashboard.html",
        history=history,
        total_saved=total_saved,
        badge=badge,
        dashboard_payload=dashboard_payload,
    )


if __name__ == "__main__":
    app.run(debug=True)
