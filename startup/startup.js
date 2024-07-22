const { spawn } = require('child_process');
const path = require('path');
const process = require('process');
const net = require('net');

process.chdir(path.resolve(__dirname, '..'));

// Function to find an available port starting from a given port number
function findAvailablePort(startPort, maxPort) {
  return new Promise((resolve, reject) => {
    const checkPort = (port) => {
      const server = net.createServer();
      server.once('error', () => {
        if (port >= maxPort) {
          reject(new Error('No available ports found'));
        } else {
          checkPort(port + 1);
        }
      });
      server.once('listening', () => {
        server.close(() => resolve(port));
      });
      server.listen(port);
    };
    checkPort(startPort);
  });
}

// Start Expo on the available port
async function startExpo() {
  try {
    // Find an available port starting from 8082
    const port = await findAvailablePort(8082, 8090);
    console.log(`Starting Expo on port ${port}`);

    const npmProcess = spawn('npx', ['expo', 'start', '--port', port], { stdio: 'pipe', shell: true });

    npmProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);

      // Check if the output contains the prompt to open on a different port
      if (output.includes('open on a different port')) {
        npmProcess.stdin.write('Y\n');
      }
      
      // Check if Expo has started
      if (output.includes('Logs for your project will appear below.')) {
        npmProcess.stdin.write('r\n');
      }
    });

    npmProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    npmProcess.on('close', (code) => {
      console.log(`npx expo start process exited with code ${code}`);
    });

  } catch (error) {
    console.error(`Failed to start Expo: ${error.message}`);
  }
}

startExpo();
