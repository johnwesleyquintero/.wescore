const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Ensure the dist directory exists
const distDir = path.join(__dirname, "..", "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Define files to include in the release
const filesToInclude = [
  "main.js",
  "config/loader.js",
  "config/schema.js",
  "reporting/reporter.js",
  "runner/commandRunner.js",
  "utils/errorCategorizer.js",
  "LICENSE",
  "README.md",
];

// Create release zip
function createZip(version) {
  const zipName = `wescore-${version}.zip`;
  const zipPath = path.join(distDir, zipName);

  // Create a temporary directory for zip contents
  const tempDir = path.join(distDir, "temp");
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  // Copy files to temp directory
  filesToInclude.forEach((file) => {
    const sourcePath = path.join(__dirname, "..", file);
    const targetPath = path.join(tempDir, file);

    // Create directory if it doesn't exist
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.copyFileSync(sourcePath, targetPath);
  });

  // Create zip file
  try {
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    execSync(
      `powershell Compress-Archive -Path "${tempDir}/*" -DestinationPath "${zipPath}"`
    );
    console.log(`Created ${zipPath}`);
  } catch (error) {
    console.error("Error creating zip:", error);
    process.exit(1);
  } finally {
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  return zipPath;
}

// Get version from package.json or use 'latest'
let version = "latest";
try {
  const packageJson = require("../package.json");
  version = packageJson.version;
} catch (error) {
  console.warn('Could not read package.json, using "latest" as version');
}

// Create both release and source code zips
createZip(version);
createZip("source");
