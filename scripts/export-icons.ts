import { Command } from "commander";
import {
  importDirectorySync,
  cleanupSVG,
  runSVGO,
  parseColors,
  isEmptyColor,
} from "@iconify/tools";
import fs from "fs";

const program = new Command();

program
  .name("export-icons")
  .description("Export icons from a directory into JSON format")
  .option("-d, --directory <directory>", "directory to export icons from", "assets/icons")
  .option("-p, --prefix <prefix>", "prefix to add to icon names", "test")
  .option("-o, --output <output>", "output file to write the JSON to", "assets/icons.json")
  .action((options) => {
    if (!options.directory) {
      console.error("Please provide a directory to export icons from.");
      process.exit(1);
    }
    if (!options.prefix) {
      console.error("Please provide a prefix to add to icon names.");
      process.exit(1);
    }
    // Import icons
    const iconSet = importDirectorySync(options.directory, {
      prefix: options.prefix,
    });

    // Validate, clean up, fix palette and optimise
    iconSet.forEachSync((name, type) => {
      if (type !== "icon") {
        return;
      }

      const svg = iconSet.toSVG(name);
      if (!svg) {
        // Invalid icon
        iconSet.remove(name);
        return;
      }

      // Clean up and optimise icons
      try {
        // Clean up icon code
        cleanupSVG(svg);

        // Assume icon is monotone: replace color with currentColor, add if missing
        // If icon is not monotone, remove this code
        parseColors(svg, {
          defaultColor: "currentColor",
          callback: (attr, colorStr, color) => {
            return !color || isEmptyColor(color) ? colorStr : "currentColor";
          },
        });

        // Optimise
        runSVGO(svg);
      } catch (err) {
        // Invalid icon
        console.error(`Error parsing ${name}:`, err);
        iconSet.remove(name);
        return;
      }

      // Update icon
      iconSet.fromSVG(name, svg);

      // Export icon to JSON
      const iconData = iconSet.export();
      fs.writeFileSync(options.output, JSON.stringify(iconData, null, 2));
    });
  });

// スクリプトを実行する
program.parse(process.argv);
