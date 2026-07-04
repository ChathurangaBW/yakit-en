const { spawn } = require('child_process')
const path = require('path')

const electronCli = path.join(__dirname, '..', 'node_modules', 'electron', 'cli.js')
const env = { ...process.env }
const forceBuiltMode = process.argv.includes('--built')

delete env.ELECTRON_RUN_AS_NODE
if (forceBuiltMode) {
  env.ELECTRON_IS_DEV = '0'
}

const child = spawn(process.execPath, [electronCli, '.'], {
  stdio: 'inherit',
  env,
  windowsHide: false,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
