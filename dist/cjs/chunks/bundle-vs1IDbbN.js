'use strict';

var _tslib = require('./bundle-xbdnJE9-.js');
var React = require('react');
var SuggestedMentionListView = require('./bundle-rYFzQpzQ.js');
var Thread_context = require('../Thread/context.js');

var SuggestedMentionList = function (props) {
    var currentChannel = Thread_context.useThreadContext().currentChannel;
    return (React.createElement(SuggestedMentionListView.SuggestedMentionListView, _tslib.__assign({}, props, { currentChannel: currentChannel })));
};

exports.SuggestedMentionList = SuggestedMentionList;
//# sourceMappingURL=bundle-vs1IDbbN.js.map
