#!/bin/bash

# Create memory bank structure for a new project
create_memory_bank() {
    local PROJECT_DIR="$1"
    local MEMORY_BANK_DIR="$PROJECT_DIR/memory-bank"

    # Create main directory structure
    mkdir -p "$MEMORY_BANK_DIR"/{templates,tasks,sessions,archive,database,implementation-details,task-contexts}

    # Create core files with basic structure
    echo "# Project Brief
*Created: $(date '+%Y-%m-%d')*

## Overview
[Project overview goes here]

## Objectives
- [Objective 1]
- [Objective 2]" > "$MEMORY_BANK_DIR/projectbrief.md"

    echo "# Task Registry
*Created: $(date '+%Y-%m-%d')*

## Active Tasks
| ID | Title | Status | Priority | Started | Dependencies |
|----|-------|--------|----------|---------|--------------|

## Task Details

## Completed Tasks
| ID | Title | Completed |
|----|-------|-----------|" > "$MEMORY_BANK_DIR/tasks.md"

    echo "# Session Cache
*Created: $(date '+%Y-%m-%d')*

## Overview
- Active: 0
- Paused: 0
- Focus: None

## Task Registry

## Active Tasks" > "$MEMORY_BANK_DIR/session_cache.md"

    echo "# Edit History
*Created: $(date '+%Y-%m-%d')*

## Changes" > "$MEMORY_BANK_DIR/edit_history.md"

    echo "# Error Log
*Created: $(date '+%Y-%m-%d')*

## Errors" > "$MEMORY_BANK_DIR/errorLog.md"

    # Create template files
    echo "# [Task ID]: [Task Title]
*Created: [Date]*
*Last Updated: [Date]*

## Task Information
**Status:** [🔄/⏸️/✅]
**Priority:** [HIGH/MEDIUM/LOW]
**Started:** [Date]
**Dependencies:** [Task IDs]

## Description
[Task description]

## Completion Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Related Files
- \`[file1]\`
- \`[file2]\`

## Progress
1. ⬜ [Step 1]
2. ⬜ [Step 2]

## Context
[Important decisions or context]" > "$MEMORY_BANK_DIR/templates/task-template.md"

    echo "# Session [DATE] - [PERIOD]
*Created: [TIMESTAMP]*

## Focus Task
[TASK ID]: [DESCRIPTION]
**Status:** [STATUS]

## Active Tasks

## Context and Working State

## Critical Files

## Session Notes" > "$MEMORY_BANK_DIR/templates/session-template.md"

    echo "Memory bank structure created successfully in: $MEMORY_BANK_DIR"
}

# Check if directory argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <project_directory>"
    exit 1
fi

create_memory_bank "$1"
