## For Internal Contributors

* Follow the [Scaled Trunk-Based Development workflow](https://trunkbaseddevelopment.com/)
* Branch naming format: `{type}/TICKET_ID/description`
  * Type: `feat` / `fix` / `chore` / `doc` / `release`
* Receive PR review approvals
* Rebase your branch with the main branch and wait for CI to pass
* Squash merge your commit
  * Use imperative language in the title and description
  * Follow the provided template for PR description and squashing

### Template
```
// PR title (Required)
[type]: A short description of the changes in imperative language.

// PR description (Optional)
Add a brief description of the changes in this PR. Bullet points are also fine.

// Footer (Recommended)
Fixes [<TICKET_ID>](https://sendbird.atlassian.net/browse/<TICKET_ID>)

// Changelogs (Recommended)
// Add (internal) at the end of each changelog if internal.
### Changelogs

// Co-authors
// Add this if you pair programmed or they made significant contributions to the ideas in the code and you want to thank them.
Co-authored-by: Name name@example.com, Name2 name@example.com

```

### Checklist

Put an `x` in the boxes that apply. You can also fill these out after creating the PR. If unsure, ask the members.
This is a reminder of what we look for before merging your code.

- [ ] **All tests pass locally with my changes**
- [ ] **I have added tests that prove my fix is effective or that my feature works**
- [ ] **Public components / utils / props are appropriately exported**
- [ ] I have added necessary documentation (if appropriate)


## External Contributions

This project is not yet set up to accept pull requests from external contributors.

If you have a pull request that you believe should be accepted, please contact
the Developer Relations team <developer-advocates@sendbird.com> with details
and we'll evaluate if we can set up a [CLA](https://en.wikipedia.org/wiki/Contributor_License_Agreement) to allow for the contribution.
