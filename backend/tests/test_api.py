from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)

SOLVED_6X6 = [
    [1, 2, 3, 4, 5, 6],
    [4, 5, 6, 1, 2, 3],
    [2, 3, 4, 5, 6, 1],
    [5, 6, 1, 2, 3, 4],
    [3, 4, 5, 6, 1, 2],
    [6, 1, 2, 3, 4, 5],
]


def build_classic_payload() -> dict:
    return {
        "name": "Test Puzzle",
        "created_at": "2026-04-21",
        "variant": "classic",
        "size": 6,
        "region_shape": {"rows": 2, "cols": 3},
        "grid": [
            [None, 2, 3, 4, 5, 6],
            [4, 5, 6, 1, 2, 3],
            [2, 3, 4, 5, 6, 1],
            [5, 6, 1, 2, 3, 4],
            [3, 4, 5, 6, 1, 2],
            [6, 1, 2, 3, 4, 5],
        ],
        "consecutive_edges": {
            "horizontal": [[False] * 5 for _ in range(6)],
            "vertical": [[False] * 6 for _ in range(5)],
        },
    }


def test_validate_returns_issue_for_duplicate() -> None:
    payload = build_classic_payload()
    payload["grid"][0][0] = 2

    response = client.post("/api/validate", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is False
    assert any(issue["type"] == "row_duplicate" for issue in data["issues"])


def test_solve_returns_unique_solution() -> None:
    payload = build_classic_payload()

    response = client.post("/api/solve", json={"puzzle": payload, "solution_limit": 12})

    assert response.status_code == 200
    data = response.json()
    assert data["has_solution"] is True
    assert data["is_unique"] is True
    assert data["solution_count_found"] == 1
    assert data["solutions"][0] == SOLVED_6X6


def test_solve_detects_multiple_solutions() -> None:
    payload = build_classic_payload()
    payload["grid"] = [
        [1, 2, 3, 4, 5, 6],
        [None, None, None, None, None, None],
        [None, None, None, None, None, None],
        [None, None, None, None, None, None],
        [None, None, None, None, None, None],
        [None, None, None, None, None, None],
    ]

    response = client.post("/api/solve", json={"puzzle": payload, "solution_limit": 2})

    assert response.status_code == 200
    data = response.json()
    assert data["has_solution"] is True
    assert data["is_unique"] is False
    assert data["solution_count_found"] >= 2


def test_export_returns_pdf_bytes() -> None:
    payload = build_classic_payload()

    response = client.post(
        "/api/export",
        json={
            "puzzle": payload,
            "approved_solution": SOLVED_6X6,
            "solution_index": 0,
        },
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.content.startswith(b"%PDF")