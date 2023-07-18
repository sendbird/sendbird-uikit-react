const { default: simpleGit } = require('simple-git');

const SB_ISSUE_PREFIX = 'https://sendbird.atlassian.net/browse/SBISSUE';

/**
 * generate change log from current version to provided tag
 * @param options { from_tag: string, to_tag: string }
 * @returns result { changelog: string, sb_issues: string[] }
 */
async function generate_changelog_to({
  from_tag,
  to_tag,
}) {
  // assume that git has information about all tags
  // see scripts/version_bump/git_fetch_tags
  if (!from_tag) {
    throw new Error('No from_tag provided');
  }
  if (!to_tag) {
    throw new Error('No to_tag provided');
  }
  const git = simpleGit();
  const log = await git.log({ from: from_tag });
  const commits = log.all;

  // date formatting
  const date = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formatted_date = date.toLocaleDateString('en-US', options);
  // end date formatting

  let changelog = `## [v${to_tag}] (${formatted_date})\n`;
  const sb_issues = [];
  const feats = {
    type: 'feat',
    title: '### Features',
    commits: [],
  };
  const fixes = {
    type: 'fix',
    title: '### Fixes',
    commits: [],
  };
  const chores = {
    type: 'chore',
    title: '### Chores',
    commits: [],
  };

  console.log('Sorting commits');
  commits.forEach((commit) => {
    // find sb issue
    const { body, message } = commit;
    const jira_sb_issue = body
      .split('/n')
      .find((line) => line.startsWith(SB_ISSUE_PREFIX));
    if (jira_sb_issue) {
      sb_issues.push(jira_sb_issue[0]);
    }

    // sort by type
    if (message.startsWith('feat')) {
      feats.commits.push(commit);
    } else if (message.startsWith('fix')) {
      fixes.commits.push(commit);
    } else {
      chores.commits.push(commit);
    }
  });
  console.log('Finished sorting commits');

  console.log('Generating changelog');
  [feats, fixes, chores].forEach((type) => {
    if (type.commits.length > 0) {
      changelog += `${type.title}\n`;
      type.commits.forEach((commit) => {
        const { body, message } = commit;
        const commit_message = message.replace(`${type.type}: `, '');
        changelog += `* ${commit_message}\n`;
        if (body) {
          changelog += `  ${body}\n`;
        }
      });
    }
  });
  console.log('Finished generating changelog');
  return {
    changelog,
    sb_issues,
  };
}

module.exports = {
  generate_changelog_to,
};
