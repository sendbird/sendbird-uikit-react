* Returns the instance of GroupChannelHandler
* workaround for: https://sendbird.atlassian.net/browse/UIKIT-1993
* Recommended fix: remove instanceOf validation check from SDK
* We keep these fns seperate from sendbird selectors because they seems
to break jest and lint, and fix is a bit tricky
