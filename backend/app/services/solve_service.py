from ..schemas.puzzle import PuzzleDocument
from ..schemas.solve import SolveResponse
from .validation_service import validate_puzzle
from ..solver.backtracking import enumerate_solutions


def solve_puzzle_document(puzzle: PuzzleDocument, solution_limit: int) -> SolveResponse:
    validation = validate_puzzle(puzzle)
    if not validation.is_valid:
        return SolveResponse(
            has_solution=False,
            solution_count_found=0,
            truncated=False,
            is_unique=False,
            solutions=[],
            validation=validation,
        )

    enumeration = enumerate_solutions(puzzle, solution_limit)
    solution_count = enumeration.found_count

    return SolveResponse(
        has_solution=solution_count > 0,
        solution_count_found=solution_count,
        truncated=enumeration.truncated,
        is_unique=solution_count == 1 and not enumeration.truncated,
        solutions=enumeration.solutions,
        validation=validation,
    )

