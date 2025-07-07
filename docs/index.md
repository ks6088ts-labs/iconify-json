# References

- [node v22.7.x で TypeScript をそのまま実行する](https://zenn.dev/mizchi/articles/experimental-node-typescript)
- [Compile TypeScript code (Node.js)](https://learn.microsoft.com/visualstudio/javascript/compile-typescript-code-npm?view=vs-2022)

## Iconify

- [Importing SVG from directory](https://iconify.design/docs/libraries/tools/import/directory.html)

```shell
make run COMMAND="scripts/export-icons.ts --directory assets/icons --prefix test --output assets/icons.json"
```

### Azure

- [Download Azure icons to use in architecture diagrams and documentation](https://learn.microsoft.com/azure/architecture/icons/)

```shell
# Release workflow for Azure icons

VERSION=v21 # Update this version number as needed

# Create the directory for Azure icons
mkdir -p assets/azure/$VERSION

# Download the Azure icons from the official source

# Export Azure icons to JSON format
make run COMMAND="scripts/export-icons.ts --directory assets/icons --prefix azure --output assets/azure/$VERSION/icons.json"

# Create a new release branch for the Azure icons
git checkout -b releases/azure/$VERSION
```
