import {
  createPasteNode,
  domToMessageTemplate,
  extractTextFromNodes,
  getLeafNodes,
  getUsersFromWords,
  hasMention,
  querySelectorIncludingSelf,
} from '../utils';
import {
  MENTION_CLASS,
  MENTION_CLASS_IN_INPUT,
  PASTE_NODE,
  TEXT_MESSAGE_CLASS,
} from '../consts';
import { TEXT_MESSAGE_BODY_CLASSNAME } from '../../../../TextMessageItemBody/consts';
import { OG_MESSAGE_BODY_CLASSNAME } from '../../../../OGMessageItemBody/consts';

const setInnerText = <T extends HTMLElement>(node: T, text: string): T => {
  Object.defineProperty(node, 'innerText', {
    configurable: true,
    value: text,
  });
  return node;
};

describe('MessageInput usePaste utils', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('queries the master element itself before its descendants', () => {
    const master = document.createElement('div');
    master.className = 'target';
    const child = document.createElement('span');
    child.className = 'target';
    master.appendChild(child);

    expect(querySelectorIncludingSelf(master, '.target')).toBe(master);
    expect(querySelectorIncludingSelf(master, '.missing')).toBeUndefined();
  });

  it('extracts leaf nodes from OG, text body, and plain pasted nodes', () => {
    const pasted = document.createElement('div');
    const ogBody = document.createElement('div');
    ogBody.className = OG_MESSAGE_BODY_CLASSNAME;
    ogBody.append('og text');
    pasted.appendChild(ogBody);

    expect(getLeafNodes(pasted)).toEqual(Array.from(ogBody.childNodes));

    pasted.innerHTML = '';
    const textBody = document.createElement('div');
    textBody.className = TEXT_MESSAGE_BODY_CLASSNAME;
    textBody.append('text body');
    pasted.appendChild(textBody);
    expect(getLeafNodes(pasted)).toEqual(Array.from(textBody.childNodes));

    pasted.innerHTML = '';
    pasted.append('plain text');
    expect(getLeafNodes(pasted)).toEqual(Array.from(pasted.childNodes));
  });

  it('replaces any existing hidden paste node', () => {
    const existing = document.createElement('div');
    existing.id = PASTE_NODE;
    document.body.appendChild(existing);

    const node = createPasteNode();

    expect(existing.isConnected).toBe(false);
    expect(node?.id).toBe(PASTE_NODE);
    expect(node?.style.display).toBe('none');
  });

  it('detects mention nodes', () => {
    const parent = document.createElement('div');
    expect(hasMention(parent)).toBe(false);

    const mention = document.createElement('span');
    mention.className = MENTION_CLASS;
    parent.appendChild(mention);

    expect(hasMention(parent)).toBe(true);
  });

  it('extracts text from nested word nodes while preserving spaces', () => {
    const parent = setInnerText(document.createElement('span'), 'outer');
    const child = setInnerText(document.createElement('span'), 'inner');
    child.className = TEXT_MESSAGE_CLASS;
    parent.appendChild(child);

    expect(extractTextFromNodes([parent])).toBe('inner  outer ');
  });

  it('converts pasted DOM nodes into message template words', () => {
    const text = document.createTextNode('hello');
    const mention = setInnerText(document.createElement('span'), '@Ada');
    mention.className = MENTION_CLASS;
    mention.dataset.userid = 'ada';
    const wrapper = setInnerText(document.createElement('span'), '@Grace');
    const inputMention = document.createElement('span');
    inputMention.className = MENTION_CLASS_IN_INPUT;
    inputMention.dataset.userid = 'grace';
    wrapper.appendChild(inputMention);

    expect(domToMessageTemplate([text, mention, wrapper])).toEqual([
      { text: 'hello' },
      { text: '@Ada', userId: 'ada' },
      { text: '@Grace', userId: 'grace' },
    ]);
  });

  it('returns unique mentioned channel members from template words', () => {
    const channel = {
      members: [
        { userId: 'ada', nickname: 'Ada' },
        { userId: 'grace', nickname: 'Grace' },
      ],
    };

    expect(getUsersFromWords([
      { text: '@Ada', userId: 'ada' },
      { text: '@Ada again', userId: 'ada' },
      { text: '@Missing', userId: 'missing' },
      { text: 'plain' },
    ], channel as any)).toEqual([{ userId: 'ada', nickname: 'Ada' }]);
  });
});
