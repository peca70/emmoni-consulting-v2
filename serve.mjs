import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const vite = spawn('npx', ['vite', '--port', '3000'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
})

vite.on('close', (code) => {
  process.exit(code)
})
