1. Run `npm run build`
2. Commit .size-snapshot.json, encouraged to summarize the bundle-size in the changelog
3. Add a package version to the `dist/package.json` and `dist/index.d.ts`
4. `npm publish` inside dist
   * Run `npm publish --tag beta` for beta
