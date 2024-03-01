'use strict';

var _tslib = require('./bundle-zYqQA3cT.js');
var React = require('react');
var SuggestedMentionListView = require('./bundle-QLdAEK3e.js');
var Thread_context = require('../Thread/context.js');

var SuggestedMentionList = function (props) {
    var currentChannel = Thread_context.useThreadContext().currentChannel;
    return (React.createElement(SuggestedMentionListView.SuggestedMentionListView, _tslib.__assign({}, props, { currentChannel: currentChannel })));
};

exports.SuggestedMentionList = SuggestedMentionList;
//# sourceMappingURL=bundle-qjBqtuP3.js.map
