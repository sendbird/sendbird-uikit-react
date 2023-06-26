## For Internal Contributors

* Follow the trunk workflow(https://trunkbaseddevelopment.com/)
* Branch naming format -> `{type}/TICKET_ID/description`
  * Where type = `feat` / `feature` / `fix` / `chore` / `doc` / `release`
* Always receive PR review approvals
* Rebase your branch with the main branch, and wait for CI to pass
* Squash merge your commit
  * Follow the provided template for both the PR description and squashing to the main branch
  * Use imperative language in the title and description
  * The template is very similar to conventional commits. [Read More](https://www.conventionalcommits.org/en/v1.0.0/)

Template
```
// PR title (Required)
[type]: A short description of the changes in imperative language.

// Section: PR description (Optional)
Add a brief description of the changes that you have involved in this PR.
Bullet points are also fine.

// Section: Footer (Recommended)
// Recommended if you are dealing with SB_ISSUES (Customer issues) or release tickets.
Fixes: [<TICKET_ID>](https://sendbird.atlassian.net/browse/<TICKET_ID>)

// If you want to add coauthors - for example, if you pair programmed or they made significant contributions to the ideas in the code and you want to thank them.
Co-authored-by: Name <name@example.com>, Name2 <name@example.com>
```

## External Contributions

This project is not yet set up to accept pull requests from external contributors.

If you have a pull request that you believe should be accepted, please contact
the Developer Relations team <developer-advocates@sendbird.com> with details
and we'll evaluate if we can setup a [CLA](https://en.wikipedia.org/wiki/Contributor_License_Agreement) to allow for the contribution.
