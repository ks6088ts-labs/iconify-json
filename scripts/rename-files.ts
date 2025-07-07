import { Command } from "commander";
import fs from "fs";
import path from "path";

const program = new Command();

function renameFilesRecursively(directory: string, pattern: RegExp) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 再帰的にディレクトリを処理
      renameFilesRecursively(filePath, pattern);
    } else {
      // ファイルをリネーム
      const match = file.match(pattern);
      if (match) {
        const newName = match[1]; // 正規表現の最初のキャプチャグループ
        const newPath = path.join(directory, newName);

        try {
          fs.renameSync(filePath, newPath);
          console.log(`Renamed: ${file} -> ${newName}`);
        } catch (err) {
          console.error(`Error renaming ${file}:`, err);
        }
      }
    }
  });
}

program
  .name("rename-files")
  .description("Recursively rename files in a directory")
  .option("-d, --directory <directory>", "directory to rename files in", "assets/icons")
  .option(
    "-p, --pattern <pattern>",
    "regex pattern to match and extract new filename",
    "^\\d+-icon-service-(.+)$",
  )
  .action((options) => {
    if (!options.directory) {
      console.error("Please provide a directory to rename files in.");
      process.exit(1);
    }

    if (!fs.existsSync(options.directory)) {
      console.error(`Directory ${options.directory} does not exist.`);
      process.exit(1);
    }

    try {
      const pattern = new RegExp(options.pattern);
      renameFilesRecursively(options.directory, pattern);
      console.log("File renaming completed successfully.");
    } catch (err) {
      console.error("Error creating regex pattern:", err);
      process.exit(1);
    }
  });

// スクリプトを実行する
program.parse(process.argv);
