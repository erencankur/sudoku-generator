from ..schemas.puzzle import PuzzleDocument
from ..schemas.solve import SolveResponse, SolveResultSet
from ..domain.consecutive import count_added_consecutive_markers
from ..solver.backtracking import enumerate_solutions
from .validation_service import validate_puzzle


def _build_result_set(validation, enumeration) -> SolveResultSet:
    if enumeration is None:
        return SolveResultSet(
            has_solution=False,
            solution_count_found=0,
            truncated=False,
            is_unique=False,
            solutions=[],
            validation=validation,
        )

    solution_count = enumeration.found_count
    return SolveResultSet(
        has_solution=solution_count > 0,
        solution_count_found=solution_count,
        truncated=enumeration.truncated,
        is_unique=solution_count == 1 and not enumeration.truncated,
        solutions=enumeration.solutions,
        validation=validation,
    )


def _filter_by_marker_limit(
    puzzle: PuzzleDocument,
    result: SolveResultSet,
    max_added_blue_circles: int,
) -> SolveResultSet:
    if puzzle.variant != "consecutive" or not result.has_solution:
        return result

    filtered_solutions = [
        solution
        for solution in result.solutions
        if count_added_consecutive_markers(puzzle, solution) <= max_added_blue_circles
    ]

    filtered_count = len(filtered_solutions)
    return SolveResultSet(
        has_solution=filtered_count > 0,
        solution_count_found=filtered_count,
        truncated=result.truncated,
        is_unique=filtered_count == 1 and not result.truncated,
        solutions=filtered_solutions,
        validation=result.validation,
    )


def solve_puzzle_document(
    puzzle: PuzzleDocument,
    solution_limit: int,
    max_added_blue_circles: int,
) -> SolveResponse:
    strict_validation = validate_puzzle(puzzle, allow_blank_as_circle=False)
    strict_enumeration = (
        enumerate_solutions(puzzle, solution_limit, allow_blank_as_circle=False)
        if strict_validation.is_valid
        else None
    )
    strict_result = _build_result_set(strict_validation, strict_enumeration)

    relaxed_result = None
    if puzzle.variant == "consecutive":
        relaxed_validation = validate_puzzle(puzzle, allow_blank_as_circle=True)
        relaxed_enumeration = (
            enumerate_solutions(puzzle, solution_limit, allow_blank_as_circle=True)
            if relaxed_validation.is_valid
            else None
        )
        relaxed_result = _build_result_set(relaxed_validation, relaxed_enumeration)
        relaxed_result = _filter_by_marker_limit(puzzle, relaxed_result, max_added_blue_circles)

    return SolveResponse(**strict_result.model_dump(), relaxed=relaxed_result)

