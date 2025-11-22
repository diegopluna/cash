import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function syncVersions() {
  try {
    // Read package.json version
    const packageJsonPath = path.join(__dirname, "../package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const version = packageJson.version as string;

    console.log(`📦 Package.json version: ${version}`);

    // Update Cargo.toml
    const cargoTomlPath = path.join(__dirname, "../src-tauri/Cargo.toml");
    let cargoContent = readFileSync(cargoTomlPath, "utf-8");

    // Replace version in [package] section (only first occurence)
    const versionRegex = /^version = ".*"/m;
    const newCargoContent = cargoContent.replace(
      versionRegex,
      `version = "${version}"`
    );

    if (cargoContent !== newCargoContent) {
      writeFileSync(cargoTomlPath, newCargoContent, "utf-8");
      console.log(`🦀 Updated Cargo.toml to version: ${version}`);
    } else {
      console.log(`🦀 Cargo.toml already at version: ${version}`);
    }

    // Verify tauri.conf.json points to package.json
    const tauriConfigPath = path.join(
      __dirname,
      "../src-tauri/tauri.conf.json"
    );
    const tauriConfig = JSON.parse(readFileSync(tauriConfigPath, "utf-8"));

    if (tauriConfig.version === "../package.json") {
      console.log("⚙️  Tauri config correctly points to package.json");
    } else {
      console.log(
        `⚠️  Warning: tauri.conf.json version is "${tauriConfig.version}" instead of "../package.json"`
      );
    }

    console.log("✅ Version sync complete!");
  } catch (error) {
    console.error("❌ Error syncing versions:", error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncVersions();
}

export { syncVersions };
