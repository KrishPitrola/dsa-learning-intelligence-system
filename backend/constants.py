"""Application constants."""

from typing import Dict, List


CONCEPTS: Dict[str, List[str]] = {
    "Arrays": ["Prefix Sum", "Sliding Window", "Two Pointers", "Kadane"],
    "Recursion": ["Base Case", "Tree Recursion"],
    "Trees": ["DFS", "BFS", "BST Logic"],
    "DP": ["Knapsack", "Memoization"],
    "Graphs": ["DFS", "BFS"],
}

ACCURACY_WEIGHT = 0.4
DIFFICULTY_WEIGHT = 0.3
TIME_WEIGHT = 0.2
CONSISTENCY_WEIGHT = 0.1

CRITICAL_THRESHOLD = 40
WEAK_THRESHOLD = 60
MODERATE_THRESHOLD = 80
