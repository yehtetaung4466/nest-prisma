import { exec } from 'child_process';
import { existsSync, copyFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const basePath = 'dist/';
const rootPackageJsonPath = join(process.cwd(), 'package.json');
const targetPackageJsonPath = join(basePath, 'package.json');

// Check if the target directory exists
if (!existsSync(basePath)) {
  console.error(`Error: Directory '${basePath}' does not exist.`);
  process.exit(1);
}

// Copy package.json from root to the target directory
if (existsSync(rootPackageJsonPath)) {
  console.log(`Copying package.json from root to '${basePath}'...`);
  
  // Read the package.json file
  const packageJson = require(rootPackageJsonPath);
  
  // Remove devDependencies
  delete packageJson.devDependencies;
  
  // Write the modified package.json to the target directory
  writeFileSync(targetPackageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log('package.json copied and devDependencies removed successfully.');
} else {
  console.error('Error: package.json does not exist in the root directory.');
  process.exit(1);
}
