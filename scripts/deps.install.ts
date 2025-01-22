import { exec } from 'child_process';
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

const basePath = '.aws-sam/build/';
const functionPath = join(basePath, 'NestJsFunction');
const rootPackageJsonPath = join(process.cwd(), 'package.json');
const targetPackageJsonPath = join(functionPath, 'package.json');

// Check if the target directory exists
if (!existsSync(functionPath)) {
  console.error(`Error: Directory '${functionPath}' does not exist.`);
  process.exit(1);
}

// Copy package.json from root to the target directory
if (existsSync(rootPackageJsonPath)) {
  console.log(`Copying package.json from root to '${functionPath}'...`);
  copyFileSync(rootPackageJsonPath, targetPackageJsonPath);
  console.log('package.json copied successfully.');
} else {
  console.error('Error: package.json does not exist in the root directory.');
  process.exit(1);
}

// Run npm install in the target directory
const installDependencies = () => {
  console.log(`Installing node_modules in '${functionPath}'...`);
  exec('npm install --production', { cwd: functionPath }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: Failed to install node_modules in '${functionPath}'`);
      console.error(error.message);
      process.exit(1);
    }
    if (stderr) {
      console.error(`npm install stderr: ${stderr}`);
    }
    console.log(`npm install stdout: ${stdout}`);
    console.log('Dependencies installed successfully.');
  });
};

// Execute the script
installDependencies();
