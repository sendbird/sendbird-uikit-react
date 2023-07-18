// Usage:
// npm run version-bump -- --type=patch/minor/major
const simpleGit = require('simple-git');
const { inc } = require('semver');
const fs = require('fs').promises;
const pkg = require('../package.json');
const { generate_changelog_to } = require('./generate_changelog');

const ARG_1 = '--type=';
const CHANGELOG_PATH = './CHANGELOG.md';

async function git_fetch_tags() {
  console.log('Fetching tags');
  const git = simpleGit();
  await git.fetch(['--tags']);
}

function parse_arguments() {
  const args = process.argv;
  const parsed_args = {};
  const type = args.find((arg) => arg.startsWith(ARG_1));
  if (type) {
    return type.replace(ARG_1, '');
  }
  throw new Error('No version bump type provided');
}

function get_next_version(type, current_version) {
  if (['patch', 'minor', 'major'].indexOf(type) === -1) {
    throw new Error('No version bump type provided');
  }
  if (!current_version) {
    throw new Error('No current version provided');
  }
  return inc(current_version, type);
}

async function cut_branch(next_version) {
  console.log(`Cutting branch release/v${next_version}`);
  const git = simpleGit();
  const branch_name = `release/v${next_version}`;
  // uncomment this line before merging to main
  // await git.checkoutLocalBranch(branch_name);
  console.log(`Checked out ${branch_name}`);
}

async function update_package_json(next_version) {
  console.log('Updating package.json');
  const new_pkg = { ...pkg, version: next_version };
  await fs.writeFile('./package.json', JSON.stringify(new_pkg, null, 2));
  console.log('Updated package.json');
}

async function write_changelog(changelog) {
  console.log('Writing changelog');
  // strip out the first line of file using stream
  // prepend the new changelog to the file using stream

  console.log('Wrote changelog');
}

async function version_bump() {
  await git_fetch_tags();
  const current_version_with_v = `v${pkg.version}`;
  const type = parse_arguments();
  const next_version = get_next_version(type, pkg.version);
  console.log(`Bumping version from ${pkg.version} to ${next_version}`);
  // await cut_branch(next_version);
  // await update_package_json(next_version);
  const { result, sb_issues } = await generate_changelog_to({
    from_tag: current_version_with_v,
    to_tag: next_version,
  });
  await write_changelog(result.changelog);
}

version_bump();
