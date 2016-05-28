/*eslint no-console: 0 */
// @flow

import ReleasabilityChecker from '../lib/releasability-checker'

export default function run() {
    const checker = new ReleasabilityChecker()
    const code = checker.isReleasable ? 0 : 1
    process.exit(code)
}

if (require.main === module) run()
