#!/usr/bin/env node
'use strict';

const { defineHook, response, hookState, state, log } = require('../src/lib/hooks/hook-facade');
const { execSync } = require('child_process');

function updateMain(cwd) {
  try {
    // Verify it's a git repository
    execSync('git rev-parse --is-inside-work-tree', { cwd, stdio: 'ignore' });

    log('INFO', 'Updating main branch from origin main...');
    
    // Fetch latest origin/main
    execSync('git fetch origin main', { cwd, stdio: 'ignore' });

    const currentBranch = execSync('git branch --show-current', { cwd }).toString().trim();

    if (currentBranch === 'main') {
      // If we are on main, try a fast-forward merge
      try {
        execSync('git merge origin/main --ff-only', { cwd, stdio: 'ignore' });
        log('INFO', 'Current branch (main) updated successfully.');
      } catch (e) {
        log('WARN', 'Could not fast-forward main. It may have diverged or has uncommitted changes.');
      }
    } else {
      // If we are on another branch, try to update the local main branch reference
      try {
        execSync('git fetch origin main:main', { cwd, stdio: 'ignore' });
        log('INFO', 'Local main branch updated successfully.');
      } catch (e) {
        // This fails if main is checked out elsewhere or has diverged
        log('WARN', 'Could not update local main branch reference. It may have diverged.');
      }
    }
  } catch (err) {
    // Not a git repo or other error - ignore silently as per hook best practices
  }
}

function handler(ctx) {
  hookState.pruneStale();

  if (!state.hasActiveSession(ctx.cwd)) {
    return response.advisory();
  }

  // Update main branch from origin
  updateMain(ctx.cwd);

  hookState.ensureSessionDir(ctx.sessionId);
  return response.advisory();
}

defineHook({ handler, fallbackResponse: response.advisory });

module.exports = { handler };
