## Step 0 - Setup
1. Create a new branch for the release: `git checkout -b release/vX.X.X`
2. Write changelog in CHANGELOG.md
3. Commit all changes

## Step 1 - Release Candidate
4. Update the version in `package.json` and `package-lock.json` to the new Release Candidate version: Run `npm version prepatch/preminor/premajor`
5. Run `npm run build`
6. Inside `./<root>/dist`, Run `npm publish --tag beta` for beta release. You can also use `npm publish --tag <next | rc>` for other release candidates
7. Commit .bundle_analysis.json, encouraged to summarize the bundle-size in the changelog
8. Test the rc version in your project(s) https://github.com/sendbird/uikit-react-test_suite (WIP: We are automating this step)
9. If everything is fine go to Step 2, otherwise make changes to main branch, rebase and repeat Step 1

## Step 2 - Actual release
10. Commit all changes
11. Update the version in `package.json` and `package-lock.json` to the new Release Candidate version: Run `npm version patch/minor/major`
12. Run `npm run build`
13. Inside `./<root>/dist`, Run `npm publish`
