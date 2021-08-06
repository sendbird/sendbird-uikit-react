export const URL_REG = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
export const generateMockMessage = (process) => {
  const message = {
    message: 'go to this link sendbird.com it will be usefull to you!!',
    ogMetaData: {
      title: 'This is the TITLE',
      description: 'I\'m description I\'m description I\'m description I\'m description ',
      url: 'https://sendbird.com/',
      defaultImage: {
        url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
        alt: 'test',
      },
    },
    sender: {
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
      nickname: 'Hoonying',
    },
    createdAt: 2000000,
  };
  if (process && typeof process === 'function') {
    return process(message);
  }
  return message;
};

export default {
  URL_REG,
  generateMockMessage,
};
