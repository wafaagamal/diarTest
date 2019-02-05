
for(let x =0; x<10; x++){

    let { spawn } = require('child_process')
let child = spawn('node', ['server.js']);

child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  child.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

}
