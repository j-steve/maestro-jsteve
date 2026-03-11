# Maestro JSteve

This project is a fork of the [Maestro-Gemini](https://github.com/josstei/maestro-gemini) extension for the Gemini CLI. 

Please refer to the [upstream root project](https://github.com/josstei/maestro-gemini) for comprehensive documentation, usage instructions, and details on how the Maestro orchestrator works.

## Installation

You can install this extension directly into the Gemini CLI using the following command:

```bash
gemini extension install https://github.com/j-steve/maestro-jsteve
```

## Differences from Upstream

This fork includes several customizations and enhancements tailored for specific workflows:

- **New Agents:** Adds `qa_tester` and `deployer` agents to the roster, expanding the orchestrator's capabilities for post-deployment QA and rollout tasks.
- **Command Prefixing:** All commands have been renamed from `/maestro` to `/maestroj` (e.g., `/maestroj:design`, `/maestroj:status`) to avoid conflicts with the upstream extension or other tools.
- **Strict Execution Mode Gating:** Modifies the execution gating behavior to strictly read the `MAESTRO_EXECUTION_MODE` environment setting. It bypasses the interactive prompt asking the user to choose between parallel and sequential modes, allowing for smoother headless operation.
