import { useCallback } from 'react';
import DOMPurify from 'dompurify';
import { a as NodeNames, N as NodeTypes } from './bundle-NK74hfcu.js';
import { U as USER_MENTION_TEMP_CHAR } from './bundle--NfXT-0k.js';
import { c as __spreadArray } from './bundle-UnAcr6wX.js';
import { M as MENTION_USER_LABEL_CLASSNAME } from './bundle-v7DbCTsH.js';
import { T as TEXT_MESSAGE_BODY_CLASSNAME } from './bundle-BInhYJCq.js';
import { O as OG_MESSAGE_BODY_CLASSNAME } from './bundle-D_x1OSEQ.js';

function renderToString(_a) {
    var userId = _a.userId, nickname = _a.nickname;
    // donot change this template, it wont work
    var el = "<span data-userid=\"".concat(userId, "\" data-sb-mention=\"true\" class=\"").concat(MENTION_USER_LABEL_CLASSNAME, "\">").concat(nickname, "</span>");
    var purifier = DOMPurify(window);
    var sanitized_ = purifier.sanitize(el);
    var token = sanitized_.split(' ');
    var spanTag = token[0], rest = token.slice(1);
    // we do this because DOMPurify removes the contenteditable attribute
    var sanitized = __spreadArray([spanTag, 'contenteditable="false"'], rest, true).join(' ');
    return sanitized;
}

var sanitizeString = function (str) {
    return str === null || str === void 0 ? void 0 : str.replace(/[\u00A0-\u9999<>]/gim, function (i) { return ''.concat('&#', String(i.charCodeAt(0)), ';'); });
};
/**
 * NodeList cannot be used with Array methods
 * @param {NodeListOf<ChildNode>} childNodes
 * @returns Array of child nodes
 */
var nodeListToArray = function (childNodes) {
    try {
        return Array.from(childNodes);
    }
    catch (error) {
        return [];
    }
};
function isChannelTypeSupportsMultipleFilesMessage(channel) {
    var _a;
    return channel && ((_a = channel.isGroupChannel) === null || _a === void 0 ? void 0 : _a.call(channel)) && !channel.isBroadcast && !channel.isSuper;
}
// Type guard: This function ensures that the node contains `innerText` and `dataset` properties
function isHTMLElement(node) {
    return node.nodeType === NodeTypes.ElementNode;
}
// eslint-disable-next-line no-undef
function extractTextAndMentions(childNodes) {
    var messageText = '';
    var mentionTemplate = '';
    childNodes.forEach(function (node) {
        if (isHTMLElement(node) && node.nodeName === NodeNames.Span) {
            var innerText = node.innerText, _a = node.dataset, dataset = _a === void 0 ? {} : _a;
            var _b = dataset.userid, userid = _b === void 0 ? '' : _b;
            messageText += innerText;
            mentionTemplate += "".concat(USER_MENTION_TEMP_CHAR, "{").concat(userid, "}");
        }
        else if (isHTMLElement(node) && node.nodeName === NodeNames.Br) {
            messageText += '\n';
            mentionTemplate += '\n';
        }
        else if (isHTMLElement(node) && node.nodeName === NodeNames.Div) {
            var _c = node.textContent, textContent = _c === void 0 ? '' : _c;
            messageText += "\n".concat(textContent);
            mentionTemplate += "\n".concat(textContent);
        }
        else {
            var _d = node.textContent, textContent = _d === void 0 ? '' : _d;
            messageText += textContent;
            mentionTemplate += textContent;
        }
    });
    return { messageText: messageText, mentionTemplate: mentionTemplate };
}

function inserTemplateToDOM(templateList) {
    var nodes = templateList.map(function (template) {
        var text = template.text, userId = template.userId;
        if (userId) {
            return renderToString({ userId: userId, nickname: text });
        }
        return sanitizeString(text);
    })
        .join(' ')
        // add a space at the end of the mention, else cursor/caret wont work
        .concat(' ');
    document.execCommand('insertHTML', false, nodes);
}

var PASTE_NODE = 'sendbird-uikit__paste-node';
var TEXT_MESSAGE_CLASS = 'sendbird-word';
var MENTION_CLASS = 'sendbird-word__mention';
var MENTION_CLASS_IN_INPUT = 'sendbird-mention-user-label';
var MENTION_CLASS_COMBINED_QUERY = ".".concat(MENTION_CLASS, ", .").concat(MENTION_CLASS_IN_INPUT);

function querySelectorIncludingSelf(master, selector) {
    var result = __spreadArray([
        master
    ], Array.from(master.querySelectorAll(selector)), true).find(function (el) { return el.matches(selector); });
    return result;
}
// Pasted dom node can be OG_MESSAGE or partial message or full message
// full messsage would have TEXT_MESSAGE_BODY_CLASSNAME and have childNodes
// partial message would not have TEXT_MESSAGE_BODY_CLASSNAME
function getLeafNodes(master) {
    // og message
    var ogMessage = querySelectorIncludingSelf(master, ".".concat(OG_MESSAGE_BODY_CLASSNAME));
    if (ogMessage) {
        return nodeListToArray(ogMessage.childNodes);
    }
    var textMessageBody = querySelectorIncludingSelf(master, ".".concat(TEXT_MESSAGE_BODY_CLASSNAME));
    if (textMessageBody) {
        return nodeListToArray(textMessageBody.childNodes);
    }
    return nodeListToArray(master.childNodes);
}
function createPasteNode() {
    var pasteNode = document.body.querySelector("#".concat(PASTE_NODE));
    // remove existing paste node
    if (pasteNode) {
        pasteNode === null || pasteNode === void 0 ? void 0 : pasteNode.remove();
    }
    // create new paste node and return
    var node = document.createElement('div');
    node.id = PASTE_NODE;
    node.style.display = 'none';
    return node;
}
function hasMention(parent) {
    return (parent === null || parent === void 0 ? void 0 : parent.querySelector(MENTION_CLASS_COMBINED_QUERY)) ? true : false;
}
var extractTextFromNodes = function (nodes) {
    var text = '';
    nodes.forEach(function (node) {
        // to preserve space between words
        var textNodes = node.querySelectorAll(".".concat(TEXT_MESSAGE_CLASS));
        if (textNodes.length > 0) {
            text += ((extractTextFromNodes(Array.from(textNodes))) + ' ');
        }
        text += (node.innerText + ' ');
    });
    return text;
};
function domToMessageTemplate(nodeArray) {
    var templates = nodeArray === null || nodeArray === void 0 ? void 0 : nodeArray.reduce(function (accumulator, currentValue) {
        var _a;
        // currentValue can be node(from messageBody or messageInput) or text
        var mentionNode;
        // this looks awkward, but it is a fallback to set default text
        var text = currentValue === null || currentValue === void 0 ? void 0 : currentValue.innerText;
        // if text node, set text
        if (currentValue instanceof Text) {
            mentionNode = false;
            text = currentValue.textContent;
        }
        if (currentValue instanceof HTMLElement) {
            mentionNode = (currentValue.classList.contains(MENTION_CLASS) || currentValue.classList.contains(MENTION_CLASS_IN_INPUT))
                ? currentValue
                : currentValue.querySelector(MENTION_CLASS_COMBINED_QUERY);
        }
        // if mentionNode is not null, it is a mention
        if (mentionNode) {
            var text_1 = currentValue === null || currentValue === void 0 ? void 0 : currentValue.innerText;
            var userId = (_a = mentionNode.dataset) === null || _a === void 0 ? void 0 : _a.userid;
            return __spreadArray(__spreadArray([], accumulator, true), [
                {
                    text: text_1,
                    userId: userId,
                },
            ], false);
        }
        return __spreadArray(__spreadArray([], accumulator, true), [
            {
                text: text,
            },
        ], false);
    }, []);
    return templates;
}
function getUsersFromWords(templates, channel) {
    var userMap = {};
    var users = channel.members;
    templates.forEach(function (template) {
        if (template.userId) {
            var mentionedMember = users.find(function (user) { return user.userId === template.userId; });
            // Object.values would return array-> [undefined] if the user is not in the channel
            if (mentionedMember) {
                userMap[template.userId] = mentionedMember;
            }
        }
    });
    return Object.values(userMap);
}

// exported, should be backward compatible
// conditions to test:
// 1. paste simple text
// 2. paste text with mention
// 3. paste text with mention and text
// 4. paste text with mention and text and paste again before and after
// 5. copy message with mention(only one mention, no other text) and paste
// 6. copy message with mention from input and paste(before and after)
function usePaste(_a) {
    var ref = _a.ref, setIsInput = _a.setIsInput, setHeight = _a.setHeight, channel = _a.channel, setMentionedUsers = _a.setMentionedUsers;
    return useCallback(function (e) {
        e.preventDefault();
        var html = e === null || e === void 0 ? void 0 : e.clipboardData.getData('text/html');
        // simple text, continue as normal
        if (!html) {
            var text = e === null || e === void 0 ? void 0 : e.clipboardData.getData('text');
            document.execCommand('insertHTML', false, sanitizeString(text));
            setIsInput(true);
            setHeight();
            return;
        }
        // has html, check if there are mentions, sanitize and insert
        var purifier = DOMPurify(window);
        var clean = purifier.sanitize(html);
        var pasteNode = createPasteNode();
        pasteNode.innerHTML = clean;
        // does not have mention, continue as normal
        if (!hasMention(pasteNode)) {
            // to preserve space between words
            var text = extractTextFromNodes(Array.from(pasteNode.children));
            document.execCommand('insertHTML', false, sanitizeString(text));
            pasteNode.remove();
            setIsInput(true);
            setHeight();
            return;
        }
        // has mention, collect leaf nodes and parse words
        var leafNodes = getLeafNodes(pasteNode);
        var words = domToMessageTemplate(leafNodes);
        var mentionedUsers = channel.isGroupChannel() ? getUsersFromWords(words, channel) : [];
        // side effects
        setMentionedUsers(mentionedUsers);
        inserTemplateToDOM(words);
        pasteNode.remove();
        setIsInput(true);
        setHeight();
    }, [ref, setIsInput, setHeight, channel, setMentionedUsers]);
}

export { extractTextAndMentions as e, isChannelTypeSupportsMultipleFilesMessage as i, nodeListToArray as n, renderToString as r, sanitizeString as s, usePaste as u };
//# sourceMappingURL=bundle-i3GNeBO2.js.map
