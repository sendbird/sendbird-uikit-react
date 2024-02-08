# Release Steps

## Step 0 - Setup
1. Create a new branch for the release: `git checkout -b release/{X.X.X}` (before it was `release/v{X.X.X}`) 
2. Write/Generate changelog in CHANGELOG.md and bump package version in package.json
3. Commit all changes, push to remote
4. Comment `/bot create ticket` on github PR to make release ticket automatically

## Step 1 - Release Candidate
4. Update the version in `package.json` and `package-lock.json` to the new Release Candidate version: Run `npm version prepatch/preminor/premajor`
5. Run `npm run build`
6. Inside `./<root>/dist`, Run `npm publish --tag beta` for beta release. You can also use `npm publish --tag <next | rc>` for other release candidates
7. Commit .bundle_analysis.json, encouraged to summarize the bundle-size in the changelog
8. Test the rc version in your project(s) https://github.com/sendbird/sendbird-uikit-react-e2e (WIP: We are automating this step)
9. If everything is fine go to Step 2, otherwise make changes to main branch, rebase and repeat Step 1

## Step 2 - Actual release
10. Commit all changes
11. Update the version in `package.json` and `package-lock.json` to the new real release version: Run `npm version patch/minor/major`
12. Run `npm run build`
13. Inside `./<root>/dist`, Run `npm publish`

# Manual release steps (Updated on 2024-02-08)
1. At main branch, make sure everything is ready to deployment.
2. Checkout release branch `git checkout -b release/{X.X.X}`.
3. In the branche update two files:
  - In `package.json`, update new version. 
  - In `CHANGELOG.md`, add a new changelog.
5. Commit and push to the branch.
6. In the created pull request, add a comment `/bot create ticket` to create a release ticket.
7. In the created ticket, update the followings:
  - Set `Assignee` to your engineering manager.
  - Update changelog link to the correct path: `CHANGELOG.md`.
  - Add all merged [SBISSUES tickets](https://sendbird.atlassian.net/jira/dashboards/11202?maximized=25045) in the `Linked issues` as `blocks` (When the ticket status changes to `Released`, Atlassan automatically adds a comment to each linked issues).
8. Ask EM to review the release ticket and await for `Release approved`.
9. In the release branch, create a new tag `v{X.X.X}` and the push the tag `git push v{X.X.X} origin`
10. In the root, `yarn build` to create new build files. Once created, make sure files in `dist` is newly created/updated.
11. Change directory to `./dist` and then publish `npm publish`
12. After release do the followings:
  - Update release ticket to `Released`
  - In the [releases](https://github.com/sendbird/sendbird-uikit-react/releases) draft a new release note with the new tag (write changelog in the description) and then publish release.
  - In the `sdk-release`, post a release message. 