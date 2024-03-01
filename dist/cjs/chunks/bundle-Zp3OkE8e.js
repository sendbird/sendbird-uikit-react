'use strict';

var _tslib = require('./bundle-2dG9SU7T.js');
var React = require('react');
var SuggestedMentionListView = require('./bundle-isZYiJlA.js');
var Thread_context = require('../Thread/context.js');

var SuggestedMentionList = function (props) {
    var currentChannel = Thread_context.useThreadContext().currentChannel;
    return (React.createElement(SuggestedMentionListView.SuggestedMentionListView, _tslib.__assign({}, props, { currentChannel: currentChannel })));
};

exports.SuggestedMentionList = SuggestedMentionList;
//# sourceMappingURL=bundle-Zp3OkE8e.js.map
