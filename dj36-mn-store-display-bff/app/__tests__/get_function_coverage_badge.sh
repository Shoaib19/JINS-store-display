#! /bin/bash
echo "[ get_function_coverage_badge.sh ]"

# get num of functions
n_total_functions=$(jq '.total.functions.total' "./docs/jest-report/coverage/coverage-summary.json")
n_covered_functions=$(jq '.total.functions.covered' "./docs/jest-report/coverage/coverage-summary.json")

# define badge color
if [ $n_total_functions -eq 0 ]; then
    badge_color="red"
elif [ $n_covered_functions -eq 0 ]; then
    badge_color="red"
elif [ $n_covered_functions -eq $n_total_functions ]; then
    badge_color="green"
else
    badge_color="yellow"
fi

# define shiled.io StaticBadge URL
badge_url="https://img.shields.io/badge/FunctionCoverage-${n_covered_functions}/${n_total_functions}-${badge_color}"

# download badge image
echo "Badge URL: ${badge_url}"
wget $badge_url -O ./docs/function_coverage_badge.svg 2>/dev/null || true  # ignore Error
