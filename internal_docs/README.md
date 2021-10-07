# Commit Convention

To ensure uniformity, easier navigation, and automatic changelog generation, we use [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) as our commits convention. All commit should be written as follows:

```
<type>(<scope>): <subject>
```

## Type

Represent the type of the changes, should be on of the following types:

- `feat`: new feature for the user, not a new feature for build script
- `fix`: bug fix for the user, not a fix to a build script
- `ci`: github actions
- `docs`: changes to the documentation
- `style`: formatting, missing semi colons, etc; no production code change
- `refactor`: refactoring production code, eg. renaming a variable
- `test`: adding missing tests, refactoring tests; no production code change
- `chore`: updating build tasks etc; no production code change

## Scope

Which part the changes is involved. This is optional. It should be on of the following scopes:

- `style`: cosmetic changes of some component
- `component`: component related changes
- `util`: non-component related changes
- `github`: Github related changes

## Subject

The commit message. Written in simple present tense.

## Example:

```
feat(component): add Tooltip component
docs(github): update pull request template
fix: add ellipsis to handle overflowed content
```

> TODO: add commitlint to ensure those conventions


---


# Versioning, Branches, and Tags
![Versioning, Branches, and Tags Diagram](https://user-images.githubusercontent.com/24476578/136347141-54d6a270-5063-45f3-8825-d282d234c418.png)

## Versioning
We are following the Semantic Version specification. Please read more on the [semver documentation](https://semver.org/)

## Branches
There will be at least 3 kind of branches:

- **Main branch** (i.e. `main`)

  This is a branch that will be synced with the upstream. We should not use this branch as a dependency. 

- **Version branch** (e.g. `rogu/v1`, `rogu/v2`)

  This branch represents a major version of this project. It should be prefixed with `"rogu/v"`. All pull requests that contain minor change and/or patch should target this branch. We only create a new version branch if we introduce a new major version. Please refer to the [Versioning](#versioning) section for major, minor, and patch explanations.

## Tags (e.g. `v1.0.0`)

Tags is some git object that points to a spesific points in the repository. We use tags to release a version of this project. Each tags represent our release version. See [Release](release-version) section for more info.

# Make Changes

All changes should be made via a pull request (PR) that typically will target a version branch. We use Github action to automatically run the build process upon merged PR and commit the built artifacts (i.e. `./release` folder) to the version branch.

We can install the current state the branch as dependency via:
```
npm install --save "https://github.com/ruang-guru/sendbird-uikit-react.git#rogu/v1"

or 

yarn add "https://github.com/ruang-guru/sendbird-uikit-react.git#rogu/v1"
```

# Release Version

We release a version by creating a release PR ensuring that:
1. PR title should begin with `"release: "` word, followed by the release version. Example: `"release: v1.0.1"`. (TODO: add github action to check this)
2. Has `release` label
3. Update version `package.json` (TODO: add github action to check this)
4. Update `CHANGELOG.md` (TODO: add github action to auto-generates changelog)

> TODO: [ ] Add github action to check points 1 and 2. [ ] Add github action to auto-generates changelog (point 3).

We can install a specific version of this project as dependency via:
```
npm install github:ruang-guru/sendbird-uikit-react#semver:v1.0.0

or 

yarn add github:ruang-guru/sendbird-uikit-react#semver:v1.0.0
```



