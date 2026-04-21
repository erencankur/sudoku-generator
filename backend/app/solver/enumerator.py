from dataclasses import dataclass


@dataclass
class EnumerationResult:
    solutions: list[list[list[int]]]
    found_count: int
    truncated: bool
