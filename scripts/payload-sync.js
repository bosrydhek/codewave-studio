import { spawn } from 'child_process';

const child = spawn('pnpm', ['payload', 'migrate'], {
  shell: true,
  stdio: ['pipe', 'pipe', 'inherit'],
});

child.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  if (output.includes('?')) {
    console.log('Detected prompt, sending y...');
    child.stdin.write('y\r\n');
  }
});

child.on('close', (code) => {
  process.exit(code);
});
