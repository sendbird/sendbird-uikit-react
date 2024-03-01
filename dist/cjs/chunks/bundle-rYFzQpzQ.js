'use strict';

var React = require('react');
var ui_Label = require('./bundle-KkCwxjVN.js');
var ui_Icon = require('../ui/Icon.js');
var ui_Avatar = require('./bundle--jUKLwRX.js');
var LocalizationContext = require('./bundle-WKa05h0_.js');
var uuid = require('./bundle-SOIkTCep.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
var _const$1 = require('./bundle-pi-jk3re.js');
var _const = require('./bundle-ZK5PhDxY.js');
var _tslib = require('./bundle-xbdnJE9-.js');

function SuggestedUserMentionItem(props) {
    var member = props.member, _a = props.isFocused, isFocused = _a === void 0 ? false : _a, parentScrollRef = props.parentScrollRef, onClick = props.onClick, onMouseOver = props.onMouseOver, onMouseMove = props.onMouseMove, renderUserMentionItem = props.renderUserMentionItem;
    var scrollRef = React.useRef(null);
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    React.useEffect(function () {
        if (isFocused && (parentScrollRef === null || parentScrollRef === void 0 ? void 0 : parentScrollRef.current) != null && (scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) != null
            && (parentScrollRef.current.scrollTop >= scrollRef.current.offsetTop
                || parentScrollRef.current.scrollTop + parentScrollRef.current.clientHeight <= scrollRef.current.offsetTop)) {
            scrollRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }, [isFocused]);
    var customMentionItem = React.useMemo(function () {
        if (renderUserMentionItem) {
            return (React.createElement("div", { className: "sendbird-mention-suggest-list__user-item", onClick: function (event) { return onClick === null || onClick === void 0 ? void 0 : onClick({ event: event, member: member, itemRef: scrollRef }); }, onMouseOver: function (event) { return onMouseOver === null || onMouseOver === void 0 ? void 0 : onMouseOver({ event: event, member: member, itemRef: scrollRef }); }, onMouseMove: function (event) { return onMouseMove === null || onMouseMove === void 0 ? void 0 : onMouseMove({ event: event, member: member, itemRef: scrollRef }); }, key: (member === null || member === void 0 ? void 0 : member.userId) || uuid.uuidv4(), ref: scrollRef }, renderUserMentionItem({ user: member })));
        }
    }, [renderUserMentionItem]);
    if (customMentionItem) {
        return customMentionItem;
    }
    return (React.createElement("div", { className: "sendbird-mention-suggest-list__user-item ".concat(isFocused ? 'focused' : ''), onClick: function (event) { return onClick === null || onClick === void 0 ? void 0 : onClick({ event: event, member: member, itemRef: scrollRef }); }, onMouseOver: function (event) { return onMouseOver === null || onMouseOver === void 0 ? void 0 : onMouseOver({ event: event, member: member, itemRef: scrollRef }); }, onMouseMove: function (event) { return onMouseMove === null || onMouseMove === void 0 ? void 0 : onMouseMove({ event: event, member: member, itemRef: scrollRef }); }, key: (member === null || member === void 0 ? void 0 : member.userId) || uuid.uuidv4(), ref: scrollRef },
        React.createElement(ui_Avatar.Avatar, { className: "sendbird-mention-suggest-list__user-item__avatar", src: member === null || member === void 0 ? void 0 : member.profileUrl, alt: "user-profile", width: "24px", height: "24px" }),
        React.createElement(ui_Label.Label, { className: "sendbird-mention-suggest-list__user-item__nickname", type: ui_Label.LabelTypography.SUBTITLE_2, color: (member === null || member === void 0 ? void 0 : member.nickname) ? ui_Label.LabelColors.ONBACKGROUND_1 : ui_Label.LabelColors.ONBACKGROUND_3 }, (member === null || member === void 0 ? void 0 : member.nickname) || (stringSet === null || stringSet === void 0 ? void 0 : stringSet.MENTION_NAME__NO_NAME)),
        React.createElement(ui_Label.Label, { className: "sendbird-mention-suggest-list__user-item__user-id", type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, member === null || member === void 0 ? void 0 : member.userId)));
}

function fetchMembersFromChannel(currentUserId, channel, maxSuggestionCount, searchString) {
    return _tslib.__awaiter(this, void 0, void 0, function () {
        return _tslib.__generator(this, function (_a) {
            return [2 /*return*/, channel.members
                    .sort(function (a, b) { var _a; return (_a = a.nickname) === null || _a === void 0 ? void 0 : _a.localeCompare(b.nickname); })
                    .filter(function (member) {
                    var _a;
                    return ((_a = member.nickname) === null || _a === void 0 ? void 0 : _a.toLowerCase().startsWith(searchString.toLowerCase()))
                        && member.userId !== currentUserId
                        && member.isActive;
                }).slice(0, maxSuggestionCount)];
        });
    });
}
function fetchMembersFromQuery(currentUserId, channel, maxSuggestionCount, searchString) {
    return _tslib.__awaiter(this, void 0, void 0, function () {
        var query;
        return _tslib.__generator(this, function (_a) {
            query = channel.createMemberListQuery({
                limit: maxSuggestionCount + 1,
                nicknameStartsWithFilter: searchString,
            });
            return [2 /*return*/, query.next()
                    .then(function (memberList) {
                    return memberList
                        .filter(function (member) { return currentUserId !== (member === null || member === void 0 ? void 0 : member.userId); })
                        .slice(0, maxSuggestionCount);
                })];
        });
    });
}

var DEBOUNCING_TIME = 300;
var SuggestedMentionListView = function (props) {
    var _a, _b, _c;
    var className = props.className, currentChannel = props.currentChannel, _d = props.targetNickname, targetNickname = _d === void 0 ? '' : _d, 
    // memberListQuery,
    onUserItemClick = props.onUserItemClick, onFocusItemChange = props.onFocusItemChange, onFetchUsers = props.onFetchUsers, renderUserMentionItem = props.renderUserMentionItem, inputEvent = props.inputEvent, _e = props.ableAddMention, ableAddMention = _e === void 0 ? true : _e, _f = props.maxMentionCount, maxMentionCount = _f === void 0 ? _const$1.MAX_USER_MENTION_COUNT : _f, _g = props.maxSuggestionCount, maxSuggestionCount = _g === void 0 ? _const$1.MAX_USER_SUGGESTION_COUNT : _g;
    var _h = useSendbirdStateContext.useSendbirdStateContext(), config = _h.config, stores = _h.stores;
    var logger = config.logger;
    var currentUserId = ((_c = (_b = (_a = stores === null || stores === void 0 ? void 0 : stores.sdkStore) === null || _a === void 0 ? void 0 : _a.sdk) === null || _b === void 0 ? void 0 : _b.currentUser) === null || _c === void 0 ? void 0 : _c.userId) || '';
    var scrollRef = React.useRef(null);
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var _j = React.useState(null), timer = _j[0], setTimer = _j[1];
    var _k = React.useState(''), searchString = _k[0], setSearchString = _k[1];
    var _l = React.useState(''), lastSearchString = _l[0], setLastSearchString = _l[1];
    var _m = React.useState(null), currentFocusedMember = _m[0], setCurrentFocusedMember = _m[1];
    var _o = React.useState([]), currentMemberList = _o[0], setCurrentMemberList = _o[1];
    React.useEffect(function () {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            setSearchString(targetNickname);
        }, DEBOUNCING_TIME));
    }, [targetNickname]);
    React.useEffect(function () {
        if ((inputEvent === null || inputEvent === void 0 ? void 0 : inputEvent.key) === _const.MessageInputKeys.Enter) {
            if (currentMemberList.length > 0) {
                onUserItemClick(currentFocusedMember);
            }
        }
        if ((inputEvent === null || inputEvent === void 0 ? void 0 : inputEvent.key) === _const.MessageInputKeys.ArrowUp) {
            var currentUserIndex = currentMemberList.findIndex(function (member) { return (member === null || member === void 0 ? void 0 : member.userId) === (currentFocusedMember === null || currentFocusedMember === void 0 ? void 0 : currentFocusedMember.userId); });
            if (0 < currentUserIndex) {
                setCurrentFocusedMember(currentMemberList[currentUserIndex - 1]);
                onFocusItemChange(currentMemberList[currentUserIndex - 1]);
            }
        }
        if ((inputEvent === null || inputEvent === void 0 ? void 0 : inputEvent.key) === _const.MessageInputKeys.ArrowDown) {
            var currentUserIndex = currentMemberList.findIndex(function (member) { return (member === null || member === void 0 ? void 0 : member.userId) === (currentFocusedMember === null || currentFocusedMember === void 0 ? void 0 : currentFocusedMember.userId); });
            if (currentUserIndex < currentMemberList.length - 1) {
                setCurrentFocusedMember(currentMemberList[currentUserIndex + 1]);
                onFocusItemChange(currentMemberList[currentUserIndex + 1]);
            }
        }
    }, [inputEvent]);
    React.useEffect(function () {
        if (lastSearchString && searchString.indexOf(lastSearchString) === 0 && currentMemberList.length === 0) {
            // Don't need to request query again
            return;
        }
        if (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isSuper) {
            if (!(currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.createMemberListQuery)) {
                logger.warning('SuggestedMentionList: Creating member list query failed');
                return;
            }
        }
        var fetcher = (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isSuper) ? fetchMembersFromQuery : fetchMembersFromChannel;
        fetcher(currentUserId, currentChannel, maxSuggestionCount, searchString.slice(_const$1.USER_MENTION_TEMP_CHAR.length))
            .then(function (suggestingMembers) {
            if (suggestingMembers.length < 1) {
                logger.info('SuggestedMentionList: Fetched member list is empty');
            }
            else {
                logger.info('SuggestedMentionList: Fetching member list succeeded', { memberList: suggestingMembers });
                setCurrentFocusedMember(suggestingMembers[0]);
            }
            setLastSearchString(searchString);
            onFetchUsers(suggestingMembers);
            setCurrentMemberList(suggestingMembers);
        })
            .catch(function (error) {
            if (error) {
                logger.error('SuggestedMentionList: Fetching member list failed', error);
            }
        });
    }, [
        currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url,
        // We have to be specific like this or React would not recognize the changes in instances.
        currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members.map(function (member) { return member.nickname; }).join(),
        currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members.map(function (member) { return member.isActive; }).join(),
        searchString,
        maxSuggestionCount,
        currentUserId,
        currentMemberList.length,
        lastSearchString,
    ]);
    if (!ableAddMention && currentMemberList.length === 0) {
        return null;
    }
    return (React.createElement("div", { className: "sendbird-mention-suggest-list ".concat(className), key: "sendbird-mention-suggest-list", ref: scrollRef },
        ableAddMention
            && (currentMemberList === null || currentMemberList === void 0 ? void 0 : currentMemberList.map(function (member) { return (React.createElement(SuggestedUserMentionItem, { key: (member === null || member === void 0 ? void 0 : member.userId) || uuid.uuidv4(), member: member, isFocused: (member === null || member === void 0 ? void 0 : member.userId) === (currentFocusedMember === null || currentFocusedMember === void 0 ? void 0 : currentFocusedMember.userId), parentScrollRef: scrollRef, onClick: function (_a) {
                    var member = _a.member;
                    onUserItemClick(member);
                }, onMouseOver: function (_a) {
                    var member = _a.member;
                    setCurrentFocusedMember(member);
                }, renderUserMentionItem: renderUserMentionItem })); })),
        !ableAddMention && (React.createElement("div", { className: "sendbird-mention-suggest-list__notice-item" },
            React.createElement(ui_Icon.default, { className: "sendbird-mention-suggest-list__notice-item__icon", type: ui_Icon.IconTypes.INFO, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "20px", height: "20px" }),
            React.createElement(ui_Label.Label, { className: "sendbird-mention-suggest-list__notice-item__text", type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, stringSet.MENTION_COUNT__OVER_LIMIT.replace('%d', String(maxMentionCount)))))));
};

exports.SuggestedMentionListView = SuggestedMentionListView;
//# sourceMappingURL=bundle-rYFzQpzQ.js.map
