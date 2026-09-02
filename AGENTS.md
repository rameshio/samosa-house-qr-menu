# AI Agent Instructions

These instructions must be followed by any AI agent working on this project.

## Development Workflow
1. Read this `AGENTS.md`, `README.md`, and `docs/PROJECT_STATUS.md` before starting.
2. Inspect existing code before making changes.
3. Explain the small phase you are about to implement.
4. Implement only that phase.
5. Run automated checks and provide manual testing checklists.
6. Update relevant docs, `CHANGELOG.md`, `ERROR_LOG.md`, and `PROJECT_STATUS.md`.
7. Stop and wait for user approval before proceeding to the next phase. Never silently continue.

## Code Quality Rules
- Use descriptive naming and keep functions focused on one responsibility.
- Use reusable React components; do not duplicate logic.
- Validate backend data; include error handling.
- Never expose secrets in frontend code; use environment variables.
- Add comments only when code cannot express reasoning clearly.
- Preserve existing working code.
- Avoid hardcoded absolute paths.

## Testing Rules
- Verify before claiming it works.
- Test frontend, backend, linting, error states, and responsive layouts.
- Clearly distinguish between automated tests, agent manual tests, and user manual tests.
