import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Loaded once per cold-start. `included_files = ["content/corpus.md"]` in
// netlify.toml ships the file next to the function bundle. process.cwd()
// resolves to the repo root at invocation time on Netlify.
const CORPUS = readFileSync(join(process.cwd(), 'content/corpus.md'), 'utf8');

export type SystemBlock = {
  type: 'text';
  text: string;
  cache_control?: { type: 'ephemeral' };
};

/**
 * Returns the `system` array for Anthropic messages.create().
 * The corpus block is marked with cache_control:"ephemeral" so repeat requests
 * hit the prompt cache (Anthropic charges 10% of input cost on cacheRead).
 */
export function buildSystem(): SystemBlock[] {
  return [
    {
      type: 'text',
      text: CORPUS,
      cache_control: { type: 'ephemeral' },
    },
  ];
}

// Exported for sanity checks and future eval tooling.
export const CORPUS_LENGTH = CORPUS.length;
