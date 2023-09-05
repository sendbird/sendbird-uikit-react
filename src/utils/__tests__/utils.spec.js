import {
  binarySearch,
  isAdminMessage,
  isFileMessage,
  isUrl,
  isUserMessage,
  isMultipleFilesMessage
} from '../index';

describe('Global-utils', () => {
  it('should find right index with binarySearch', () => {
    const criterionArray = [99, 88, 77, 66, 55, 44, 33, 22, 11, 0];

    const targetIndex1 = binarySearch(criterionArray, 100);
    expect(targetIndex1).toEqual(0);
    const targetIndex2 = binarySearch(criterionArray, 1);
    expect(targetIndex2).toEqual(criterionArray.length - 1);

    criterionArray.forEach((value, index) => {
      const targetIndex = binarySearch(criterionArray, value);
      expect(targetIndex).toEqual(index);
      const targetIndexPlusOne = binarySearch(criterionArray, value + 1);
      expect(targetIndexPlusOne).toEqual(index);
    });
  });
});

describe('Global-utils: verify message type util functions', () => {
  it('should return true for each message', () => {
    const mockUserMessage = {
      messageId: 0,
      isUserMessage: () => true,
      isFileMessage: () => false,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => false,
      messageType: 'user',
    };
    expect(isUserMessage(mockUserMessage)).toBe(true);
    expect(isFileMessage(mockUserMessage)).toBe(false);
    expect(isAdminMessage(mockUserMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockUserMessage)).toBe(false);
    const mockFileMessage = {
      messageId: 1,
      isUserMessage: () => false,
      isFileMessage: () => true,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => false,
      messageType: 'file',
    };
    expect(isUserMessage(mockFileMessage)).toBe(false);
    expect(isFileMessage(mockFileMessage)).toBe(true);
    expect(isAdminMessage(mockFileMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockUserMessage)).toBe(false);
    const mockAdminMessage = {
      messageId: 2,
      isUserMessage: () => false,
      isFileMessage: () => false,
      isAdminMessage: () => true,
      isMultipleFilesMessage: () => false,
      messageType: 'admin',
    };
    expect(isUserMessage(mockAdminMessage)).toBe(false);
    expect(isFileMessage(mockAdminMessage)).toBe(false);
    expect(isAdminMessage(mockAdminMessage)).toBe(true);
    expect(isMultipleFilesMessage(mockUserMessage)).toBe(false);
    const mockMulipleFilesMessage = {
      messageId: 3,
      isUserMessage: () => false,
      isFileMessage: () => false,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => true,
      messageType: 'file',
    };
    expect(isUserMessage(mockMulipleFilesMessage)).toBe(false);
    expect(isFileMessage(mockMulipleFilesMessage)).toBe(false);
    expect(isAdminMessage(mockMulipleFilesMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockMulipleFilesMessage)).toBe(true);
  });

  it('should return true with incomplete properties', () => {
    expect(isUserMessage({ isUserMessage: () => true })).toBe(true);
    expect(isUserMessage({ messageType: 'user' })).toBe(true);
    expect(isFileMessage({ isFileMessage: () => true })).toBe(true);
    expect(isFileMessage({ messageType: 'file' })).toBe(true);
    expect(isAdminMessage({ isAdminMessage: () => true })).toBe(true);
    expect(isAdminMessage({ messageType: 'admin' })).toBe(true);
    expect(isMultipleFilesMessage({ isMultipleFilesMessage: () => true })).toBe(true);
    expect(isMultipleFilesMessage({ messageType: 'file', fileInfoList: [] })).toBe(true);
  });

  it('should refer to the method first rather than messageType', () => {
    const mockUserMessage = {
      messageId: 0,
      isUserMessage: () => true,
      isFileMessage: () => false,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => false,
      messageType: 'file',
    };
    expect(isUserMessage(mockUserMessage)).toBe(true);
    expect(isFileMessage(mockUserMessage)).toBe(false);
    expect(isAdminMessage(mockUserMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockUserMessage)).toBe(false);
    expect(isUserMessage({ isUserMessage: () => false, messageType: 'user' })).toBe(false);
    const mockFileMessage = {
      messageId: 1,
      isUserMessage: () => false,
      isFileMessage: () => true,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => false,
      messageType: 'admin',
    };
    expect(isUserMessage(mockFileMessage)).toBe(false);
    expect(isFileMessage(mockFileMessage)).toBe(true);
    expect(isAdminMessage(mockFileMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockFileMessage)).toBe(false);
    expect(isFileMessage({ isFileMessage: () => false, messsageType: 'file' })).toBe(false);
    const mockAdminMessage = {
      messageId: 2,
      isUserMessage: () => false,
      isFileMessage: () => false,
      isAdminMessage: () => true,
      isMultipleFilesMessage: () => false,
      messageType: 'user',
    };
    expect(isUserMessage(mockAdminMessage)).toBe(false);
    expect(isFileMessage(mockAdminMessage)).toBe(false);
    expect(isAdminMessage(mockAdminMessage)).toBe(true);
    expect(isMultipleFilesMessage(mockAdminMessage)).toBe(false);
    expect(isAdminMessage({ isAdminMessage: () => false, messageType: 'admin' })).toBe(false);
    const mockMultipleFilesMessage = {
      messageId: 2,
      isUserMessage: () => false,
      isFileMessage: () => false,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => true,
      messageType: 'file',
    };
    expect(isUserMessage(mockMultipleFilesMessage)).toBe(false);
    expect(isFileMessage(mockMultipleFilesMessage)).toBe(false);
    expect(isAdminMessage(mockMultipleFilesMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockMultipleFilesMessage)).toBe(true);
    expect(isMultipleFilesMessage({ isMultipleFilesMessage: () => false, messageType: 'file' })).toBe(false);
  });
});

describe('isURL', () => {
  it('should return true for valid URLs', () => {
    const validURLs = [
      // with protocol
      'http://www.example.com',
      'https://www.example.com',
      'http://example.com',
      'https://example.com',
      // without protocol
      'www.example.com',
      'example.com',
      // with sub paths
      'http://www.example.com/path/to/page.html',
      'https://www.example.com/path/to/page.html',
      'http://example.com/path/to/page.html',
      'https://example.com/path/to/page.html',
      'www.example.com/path/to/page.html',
      'example.com/path/to/page.html',
      // with query strings
      'http://www.example.com/path/to/page.html?query=string',
      'https://www.example.com/path/to/page.html?query=string',
      'http://example.com/path/to/page.html?query=string',
      'https://example.com/path/to/page.html?query=string',
      'www.example.com/path/to/page.html?query=string',
      'example.com/path/to/page.html?query=string',
      'https://www.amazon.com/Hacker-Playbook-Practical-Penetration-Testing/dp/1494932636/ref=sr_1_5?crid=1IKVPDXYF5NQG&keywords=hacker+guide&qid=1681333238&sprefix=hacker+guid%2Caps%2C148&sr=8-5'
    ]
    validURLs.forEach((url) => {
      expect(isUrl(url)).toBe(true);
    });
  });
  it('should return false for invalid URLs', () => {
    const invalidURLs = [
      'aaa',
      '$123.123',
      'aaa@sendbird.com',
    ]
    invalidURLs.forEach((url) => {
      expect(isUrl(url)).toBe(false);
    });
  });
});
