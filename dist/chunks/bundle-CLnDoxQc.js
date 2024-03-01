import React__default, { useRef, useContext, useEffect, useMemo, useState } from 'react';
import { L as Label, a as LabelTypography, b as LabelColors } from './bundle-kMMCn6GE.js';
import Icon, { IconTypes, IconColors } from '../ui/Icon.js';
import { A as Avatar } from './bundle-OJq071GK.js';
import { L as LocalizationContext, u as useLocalization } from './bundle-msnuMA4R.js';
import { u as uuidv4 } from './bundle-4_6x-RiC.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { U as USER_MENTION_TEMP_CHAR, M as MAX_USER_MENTION_COUNT, a as MAX_USER_SUGGESTION_COUNT } from './bundle-hKmRj7Ck.js';
import { M as MessageInputKeys } from './bundle-NOh3ukH6.js';
import { a as __awaiter, b as __generator } from './bundle-KMsJXUN2.js';

function SuggestedUserMentionItem(props) {
    var member = props.member, _a = props.isFocused, isFocused = _a === void 0 ? false : _a, parentScrollRef = props.parentScrollRef, onClick = props.onClick, onMouseOver = props.onMouseOver, onMouseMove = props.onMouseMove, renderUserMentionItem = props.renderUserMentionItem;
    var scrollRef = useRef(null);
    var stringSet = useContext(LocalizationContext).stringSet;
    useEffect(function () {
        if (isFocused && (parentScrollRef === null || parentScrollRef === void 0 ? void 0 : parentScrollRef.current) != null && (scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) != null
            && (parentScrollRef.current.scrollTop >= scrollRef.current.offsetTop
                || parentScrollRef.current.scrollTop + parentScrollRef.current.clientHeight <= scrollRef.current.offsetTop)) {
            scrollRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }, [isFocused]);
    var customMentionItem = useMemo(function () {
        if (renderUserMentionItem) {
            return (React__default.createElement("div", { className: "sendbird-mention-suggest-list__user-item", onClick: function (event) { return onClick === null || onClick === void 0 ? void 0 : onClick({ event: event, member: member, itemRef: scrollRef }); }, onMouseOver: function (event) { return onMouseOver === null || onMouseOver === void 0 ? void 0 : onMouseOver({ event: event, member: member, itemRef: scrollRef }); }, onMouseMove: function (event) { return onMouseMove === null || onMouseMove === void 0 ? void 0 : onMouseMove({ event: event, member: member, itemRef: scrollRef }); }, key: (member === null || member === void 0 ? void 0 : member.userId) || uuidv4(), ref: scrollRef }, renderUserMentionItem({ user: member })));
        }
    }, [renderUserMentionItem]);
    if (customMentionItem) {
        return customMentionItem;
    }
    return (React__default.createElement("div", { className: "sendbird-mention-suggest-list__user-item ".concat(isFocused ? 'focused' : ''), onClick: function (event) { return onClick === null || onClick === void 0 ? void 0 : onClick({ event: event, member: member, itemRef: scrollRef }); }, onMouseOver: function (event) { return onMouseOver === null || onMouseOver === void 0 ? void 0 : onMouseOver({ event: event, member: member, itemRef: scrollRef }); }, onMouseMove: function (event) { return onMouseMove === null || onMouseMove === void 0 ? void 0 : onMouseMove({ event: event, member: member, itemRef: scrollRef }); }, key: (member === null || member === void 0 ? void 0 : member.userId) || uuidv4(), ref: scrollRef },
        React__default.createElement(Avatar, { className: "sendbird-mention-suggest-list__user-item__avatar", src: member === null || member === void 0 ? void 0 : member.profileUrl, alt: "user-profile", width: "24px", height: "24px" }),
        React__default.createElement(Label, { className: "sendbird-mention-suggest-list__user-item__nickname", type: LabelTypography.SUBTITLE_2, color: (member === null || member === void 0 ? void 0 : member.nickname) ? LabelColors.ONBACKGROUND_1 : LabelColors.ONBACKGROUND_3 }, (member === null || member === void 0 ? void 0 : member.nickname) || (stringSet === null || stringSet === void 0 ? void 0 : stringSet.MENTION_NAME__NO_NAME)),
        React__default.createElement(Label, { className: "sendbird-mention-suggest-list__user-item__user-id", type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_2 }, member === null || member === void 0 ? void 0 : member.userId)));
}

function fetchMembersFromChannel(currentUserId, channel, maxSuggestionCount, searchString) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
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
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
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
    onUserItemClick = props.onUserItemClick, onFocusItemChange = props.onFocusItemChange, onFetchUsers = props.onFetchUsers, renderUserMentionItem = props.renderUserMentionItem, inputEvent = props.inputEvent, _e = props.ableAddMention, ableAddMention = _e === void 0 ? true : _e, _f = props.maxMentionCount, maxMentionCount = _f === void 0 ? MAX_USER_MENTION_COUNT : _f, _g = props.maxSuggestionCount, maxSuggestionCount = _g === void 0 ? MAX_USER_SUGGESTION_COUNT : _g;
    var _h = useSendbirdStateContext(), config = _h.config, stores = _h.stores;
    var logger = config.logger;
    var currentUserId = ((_c = (_b = (_a = stores === null || stores === void 0 ? void 0 : stores.sdkStore) === null || _a === void 0 ? void 0 : _a.sdk) === null || _b === void 0 ? void 0 : _b.currentUser) === null || _c === void 0 ? void 0 : _c.userId) || '';
    var scrollRef = useRef(null);
    var stringSet = useLocalization().stringSet;
    var _j = useState(null), timer = _j[0], setTimer = _j[1];
    var _k = useState(''), searchString = _k[0], setSearchString = _k[1];
    var _l = useState(''), lastSearchString = _l[0], setLastSearchString = _l[1];
    var _m = useState(null), currentFocusedMember = _m[0], setCurrentFocusedMember = _m[1];
    var _o = useState([]), currentMemberList = _o[0], setCurrentMemberList = _o[1];
    useEffect(function () {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            setSearchString(targetNickname);
        }, DEBOUNCING_TIME));
    }, [targetNickname]);
    useEffect(function () {
        if ((inputEvent === null || inputEvent === void 0 ? void 0 : inputEvent.key) === MessageInputKeys.Enter) {
            if (currentMemberList.length > 0) {
                onUserItemClick(currentFocusedMember);
            }
        }
        if ((inputEvent === null || inputEvent === void 0 ? void 0 : inputEvent.key) === MessageInputKeys.ArrowUp) {
            var currentUserIndex = currentMemberList.findIndex(function (member) { return (member === null || member === void 0 ? void 0 : member.userId) === (currentFocusedMember === null || currentFocusedMember === void 0 ? void 0 : currentFocusedMember.userId); });
            if (0 < currentUserIndex) {
                setCurrentFocusedMember(currentMemberList[currentUserIndex - 1]);
                onFocusItemChange(currentMemberList[currentUserIndex - 1]);
            }
        }
        if ((inputEvent === null || inputEvent === void 0 ? void 0 : inputEvent.key) === MessageInputKeys.ArrowDown) {
            var currentUserIndex = currentMemberList.findIndex(function (member) { return (member === null || member === void 0 ? void 0 : member.userId) === (currentFocusedMember === null || currentFocusedMember === void 0 ? void 0 : currentFocusedMember.userId); });
            if (currentUserIndex < currentMemberList.length - 1) {
                setCurrentFocusedMember(currentMemberList[currentUserIndex + 1]);
                onFocusItemChange(currentMemberList[currentUserIndex + 1]);
            }
        }
    }, [inputEvent]);
    useEffect(function () {
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
        fetcher(currentUserId, currentChannel, maxSuggestionCount, searchString.slice(USER_MENTION_TEMP_CHAR.length))
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
    return (React__default.createElement("div", { className: "sendbird-mention-suggest-list ".concat(className), key: "sendbird-mention-suggest-list", ref: scrollRef },
        ableAddMention
            && (currentMemberList === null || currentMemberList === void 0 ? void 0 : currentMemberList.map(function (member) { return (React__default.createElement(SuggestedUserMentionItem, { key: (member === null || member === void 0 ? void 0 : member.userId) || uuidv4(), member: member, isFocused: (member === null || member === void 0 ? void 0 : member.userId) === (currentFocusedMember === null || currentFocusedMember === void 0 ? void 0 : currentFocusedMember.userId), parentScrollRef: scrollRef, onClick: function (_a) {
                    var member = _a.member;
                    onUserItemClick(member);
                }, onMouseOver: function (_a) {
                    var member = _a.member;
                    setCurrentFocusedMember(member);
                }, renderUserMentionItem: renderUserMentionItem })); })),
        !ableAddMention && (React__default.createElement("div", { className: "sendbird-mention-suggest-list__notice-item" },
            React__default.createElement(Icon, { className: "sendbird-mention-suggest-list__notice-item__icon", type: IconTypes.INFO, fillColor: IconColors.ON_BACKGROUND_2, width: "20px", height: "20px" }),
            React__default.createElement(Label, { className: "sendbird-mention-suggest-list__notice-item__text", type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_2 }, stringSet.MENTION_COUNT__OVER_LIMIT.replace('%d', String(maxMentionCount)))))));
};

export { SuggestedMentionListView as S };
//# sourceMappingURL=bundle-CLnDoxQc.js.map
