require('dotenv').config();
const { spawn } = require('child_process');

console.log('Starting Stitch MCP server...');

// The user specifically requested @modelcontextprotocol/server-stitch
// If this fails on public npm, it may be due to a private registry or environment alias.
const server = spawn('npx', ['-y', '@modelcontextprotocol/server-stitch'], {
  stdio: 'inherit',
  shell: true,
  env: { 
    ...process.env, 
    OPENAI_API_KEY: process.env.OPENAI_API_KEY 
  }
});

server.on('error', (err) => {
  console.error('Failed to start Stitch MCP server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Stitch MCP server exited with code ${code}`);
  }
  process.exit(code);
});
