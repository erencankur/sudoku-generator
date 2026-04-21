from fastapi import APIRouter

from ...schemas.solve import SolveRequest, SolveResponse
from ...services.solve_service import solve_puzzle_document


router = APIRouter(prefix="/api", tags=["solve"])


@router.post("/solve", response_model=SolveResponse)
def solve_route(request: SolveRequest) -> SolveResponse:
    return solve_puzzle_document(
        request.puzzle,
        request.solution_limit,
        request.max_added_blue_circles,
    )