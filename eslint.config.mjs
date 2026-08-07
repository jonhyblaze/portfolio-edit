import { createRequire } from 'node:module'
import next from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const require = createRequire(import.meta.url)

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...next,
  ...nextTypescript,
  {
    // eslint-config-next asks eslint-plugin-react to `detect` the React version,
    // and that code path calls context.getFilename(), which ESLint 10 removed —
    // it throws before linting a single file. Passing the version explicitly
    // skips detection entirely. Read from the installed package so a React
    // upgrade can't silently leave this stale.
    settings: { react: { version: require('react/package.json').version } },
  },
  {
    // Vendored from the react-bits registry — not ours to lint.
    ignores: ['components/SplashCursor.jsx'],
  },
]

export default config
