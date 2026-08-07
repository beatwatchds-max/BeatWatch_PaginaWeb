import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const ignored = new Set(['node_modules', '.git', 'dist', 'security-reports'])
const extensions = new Set(['.js', '.jsx', '.mjs', '.json', '.yml', '.yaml', '.md', '.html'])

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return []
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return files(full)
    return extensions.has(path.extname(entry.name)) ? [full] : []
  })
}

const patterns = [
  { name: 'private key', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'AWS access key', regex: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'GitHub personal access token', regex: /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/ },
  { name: 'Stripe live secret key', regex: /\bsk_live_[A-Za-z0-9]{16,}\b/ },
]

test('repository does not contain common committed secret formats', () => {
  const offenders = []
  for (const file of files(root)) {
    const relative = path.relative(root, file).replaceAll('\\', '/')
    if (relative.startsWith('tests/security/')) continue
    const content = fs.readFileSync(file, 'utf8')
    for (const pattern of patterns) {
      if (pattern.regex.test(content)) offenders.push(`${relative}: ${pattern.name}`)
    }
  }

  assert.deepEqual(offenders, [])
})
