"""Database helpers for the Tree Plantation Carbon Reduction Calculator."""

from __future__ import annotations

import json
import sqlite3
from contextlib import closing
from datetime import datetime
from pathlib import Path
from typing import Dict, List

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "carbon.db"
TREES_JSON = BASE_DIR / "trees.json"
CITIES_JSON = BASE_DIR / "cities.json"


def get_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def initialize() -> None:
    """Create tables (if needed) and seed core data."""
    with closing(get_connection()) as conn:
        with conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS trees (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    absorption_rate REAL NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS cities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    climate TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS recommendations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    city_id INTEGER NOT NULL,
                    tree_id INTEGER NOT NULL,
                    UNIQUE(city_id, tree_id),
                    FOREIGN KEY(city_id) REFERENCES cities(id),
                    FOREIGN KEY(tree_id) REFERENCES trees(id)
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tree_name TEXT NOT NULL,
                    quantity INTEGER NOT NULL,
                    city TEXT NOT NULL,
                    total_co2 REAL NOT NULL,
                    date TEXT NOT NULL
                )
                """
            )
        _seed_reference_data(conn)


def _seed_reference_data(conn: sqlite3.Connection) -> None:
    """Populate trees, cities, and recommendations from JSON assets."""
    trees = _load_json(TREES_JSON)
    cities_payload = _load_json(CITIES_JSON)
    cities = cities_payload.get("cities", [])
    recommendations = cities_payload.get("recommendations", [])

    with conn:
        for tree in trees:
            conn.execute(
                "INSERT OR IGNORE INTO trees (name, absorption_rate) VALUES (?, ?)",
                (tree["name"], tree["absorption_rate"]),
            )

        for city in cities:
            conn.execute(
                "INSERT OR IGNORE INTO cities (name, climate) VALUES (?, ?)",
                (city["name"], city["climate"]),
            )

        city_map = {
            row["name"]: row["id"]
            for row in conn.execute("SELECT id, name FROM cities")
        }
        tree_map = {
            row["name"]: row["id"]
            for row in conn.execute("SELECT id, name FROM trees")
        }

        for item in recommendations:
            city_id = city_map.get(item["city"])
            for tree_name in item.get("trees", []):
                tree_id = tree_map.get(tree_name)
                if city_id and tree_id:
                    conn.execute(
                        "INSERT OR IGNORE INTO recommendations (city_id, tree_id) VALUES (?, ?)",
                        (city_id, tree_id),
                    )


def _load_json(path: Path):
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


# Query helpers

def fetch_trees() -> List[sqlite3.Row]:
    with closing(get_connection()) as conn:
        return conn.execute(
            "SELECT id, name, absorption_rate FROM trees ORDER BY name"
        ).fetchall()


def fetch_cities() -> List[sqlite3.Row]:
    with closing(get_connection()) as conn:
        return conn.execute(
            "SELECT id, name, climate FROM cities ORDER BY name"
        ).fetchall()


def get_tree(tree_id: int):
    with closing(get_connection()) as conn:
        return conn.execute(
            "SELECT id, name, absorption_rate FROM trees WHERE id = ?",
            (tree_id,),
        ).fetchone()


def get_city(city_id: int):
    with closing(get_connection()) as conn:
        return conn.execute(
            "SELECT id, name, climate FROM cities WHERE id = ?",
            (city_id,),
        ).fetchone()


def get_recommendations_for_city(city_id: int) -> List[str]:
    with closing(get_connection()) as conn:
        rows = conn.execute(
            """
            SELECT t.name
            FROM recommendations r
            JOIN trees t ON t.id = r.tree_id
            WHERE r.city_id = ?
            ORDER BY t.name
            """,
            (city_id,),
        ).fetchall()
    return [row["name"] for row in rows]


def insert_history(tree_name: str, quantity: int, city: str, total_co2: float) -> None:
    with closing(get_connection()) as conn:
        with conn:
            conn.execute(
                "INSERT INTO history (tree_name, quantity, city, total_co2, date) VALUES (?, ?, ?, ?, ?)",
                (tree_name, quantity, city, total_co2, datetime.utcnow().isoformat()),
            )


def fetch_history(limit: int = 25) -> List[sqlite3.Row]:
    with closing(get_connection()) as conn:
        return conn.execute(
            "SELECT tree_name, quantity, city, total_co2, date FROM history ORDER BY date DESC LIMIT ?",
            (limit,),
        ).fetchall()


def get_total_co2() -> float:
    with closing(get_connection()) as conn:
        row = conn.execute("SELECT SUM(total_co2) as total FROM history").fetchone()
        return row["total"] or 0.0


def get_chart_points(limit: int = 30) -> Dict[str, float]:
    with closing(get_connection()) as conn:
        rows = conn.execute(
            """
            SELECT date(date) as label, SUM(total_co2) as total
            FROM history
            GROUP BY label
            ORDER BY label ASC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    return {row["label"]: row["total"] for row in rows}


initialize()
