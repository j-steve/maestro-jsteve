---
name: design-dialogue
description: Guides structured design conversations for complex engineering tasks
---

# Design Dialogue Skill

Activate this skill when beginning Phase 1 of Maestro orchestration. Use `ask_user` with `type: 'choice'` for approach selection (do NOT ask for yes/no approval of the final design doc). This skill provides the structured methodology for conducting design conversations that converge on architectural designs.

## Question Framework

### Principles
- Ask one question at a time — never batch multiple questions
- Prefer multiple choice format with 2-4 options over open-ended questions
- Lead with your recommended option and explain the rationale
- Wait for user response before proceeding to next question
- Adapt follow-up questions based on previous answers

### Required Coverage Areas

Ask questions in this order to progressively narrow the design space:

1. **Problem Scope & Boundaries**
   - What specific problem are we solving?
   - What is explicitly out of scope?
   - What are the expected inputs and outputs?

2. **Technical Constraints & Limitations**
   - Existing technology stack and infrastructure
   - Compatibility requirements with existing systems
   - Performance budgets (latency, throughput, resource limits)
   - Team expertise and familiarity

3. **Technology Preferences**
   - Language and framework preferences
   - Database and storage requirements
   - Third-party service dependencies
   - Build and deployment toolchain

4. **Quality Requirements**
   - Performance targets (response time, concurrent users)
   - Security requirements (authentication, authorization, data protection)
   - Scalability expectations (growth projections, peak loads)
   - Reliability requirements (uptime, disaster recovery)

5. **Deployment Context**
   - Target environment (cloud provider, on-premise, hybrid)
   - CI/CD pipeline requirements
   - Monitoring and observability needs
   - Operational constraints (team size, on-call, maintenance windows)

### Question Format

Use `ask_user` with `type: 'choice'` for structured selections:

```json
{
  "questions": [
    {
      "header": "[Short Label]",
      "question": "[Topic Area]: [Clear, specific question]",
      "type": "choice",
      "options": [
        { "label": "[Option A]", "description": "(Recommended) [Why this is recommended, key benefits]" },
        { "label": "[Option B]", "description": "[When this makes sense, trade-offs]" },
        { "label": "[Option C]", "description": "[When this makes sense, trade-offs]" }
      ]
    }
  ]
}
```

- `header`: Short label displayed as a chip/tag. Must not exceed 16 characters (enforced by Gemini CLI validation). Examples: `Database`, `Auth`, `Runtime`.
- `options`: 2-4 items, each with `label` (1-5 words) and `description`

Include your recommendation rationale in the question text so the user has context before choosing.

## Approach Presentation

### When to Present Approaches
Present 2-3 architectural approaches after gathering sufficient requirements (typically after covering scope, constraints, and technology preferences).

### Approach Format

For each approach, provide:

```
### Approach [N]: [Descriptive Name]

**Summary**: [2-3 sentence overview]

**Architecture**:
[Component diagram or description showing key components and their relationships]

**Pros**:
- [Concrete advantage with context]
- [Another advantage]

**Cons**:
- [Concrete disadvantage with context]
- [Another disadvantage]

**Best When**: [Specific conditions where this approach excels]

**Risk Level**: Low | Medium | High
```

### Presentation Rules
- Always lead with your recommended approach
- Explain why the recommended approach best fits the gathered requirements
- Highlight the key differentiator between approaches
- After presenting all approaches, explicitly ask the user to choose
- Accept user's choice without pushback, even if it differs from your recommendation

## Design Convergence Protocol

Generate the complete design document and present it as read-only output. 
**Do NOT** prompt the user with a `yesno` question to approve the document or individual sections. 
After presenting the document, proceed directly.

## Design Document Generation

### Output Location

Write directly to `<state_dir>/plans/YYYY-MM-DD-<topic-slug>-design.md` (`<state_dir>` resolves from `MAESTRO_STATE_DIR`, default `.gemini`).

Where:
- `YYYY-MM-DD` is the current date
- `<topic-slug>` is a lowercase, hyphenated summary of the task (e.g., `user-auth-system`, `data-pipeline-refactor`)
- `<project>` is the CLI's internal project hash (resolved automatically by `write_file`)

### Document Structure
Use the design document template from `templates/design-document.md`.

### Completion Criteria
The design document is complete when:
- The document has been presented as read-only output
- The agent team composition matches the task requirements
- Phase dependencies are clearly mapped
- Success criteria are measurable and specific
- (No explicit final yes/no approval is required; proceed automatically)

### Post-Generation
After writing the design document:
1. Confirm the file path to the user
2. Summarize key decisions made during the dialogue
3. Proceed automatically to implementation planning (Phase 2) without asking for yes/no approval.
