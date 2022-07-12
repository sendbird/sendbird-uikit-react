1. Run npm build
2. Update and replace dist/index.d.ts with scripts/index_d_ts
3. Update and replace dist/package.json with scripts/package.template.json
4. Update and replace dist/README.md with main README.md
4. Update and replace dist/CHANGELOG.md with main CHANGELOG.md
4. Update and replace dist/LICENSE with main LICENSE
5. npm publish inside dist

We do step 2 because half project is in TS and other half in JS. Will update tooling soon to fix this issue
