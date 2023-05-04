import { binarySearch, isUrl } from '../index';

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
