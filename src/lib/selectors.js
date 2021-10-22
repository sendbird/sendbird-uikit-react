import * as topics from './pubSub/topics';

export const getSdk = (store) => {
  const { stores = {} } = store;
  const { sdkStore = {} } = stores;
  const { sdk } = sdkStore;
  return sdk;
};

export const getPubSub = (store) => {
  const { config = {} } = store;
  const { pubSub } = config;
  return pubSub;
};

// SendBird disconnect. Invalidates currentUser
// eslint-disable-next-line max-len
export const getConnect = (store) => (userId, accessToken) => new Promise((resolve, reject) => {
  const sdk = getSdk(store);
  if (!sdk) {
    reject(new Error('Sdk not found'));
  }
  if (!accessToken) {
    sdk.connect(userId)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  } else {
    sdk.connect(userId, accessToken)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  }
});

// SendBird disconnect. Invalidates currentUser
export const getDisconnect = (store) => () => new Promise((resolve, reject) => {
  const sdk = getSdk(store);
  if (!sdk) {
    reject(new Error('Sdk not found'));
  }
  sdk.disconnect()
    .then((res) => resolve(res))
    .catch((err) => reject(err));
});

// Using the updateCurrentUserInfo() method
// you can update a user's nickname and profile image with a URL
// eslint-disable-next-line max-len
export const getUpdateUserInfo = (store) => (nickName, profileUrl) => new Promise((resolve, reject) => {
  const sdk = getSdk(store);
  if (!sdk) {
    reject(new Error('Sdk not found'));
  }
  sdk.updateCurrentUserInfo(nickName, profileUrl)
    .then((res) => resolve(res))
    .catch((err) => reject(err));
});

export const getSendUserMessage = (store) => (channelUrl, userMessageParams) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.GroupChannel.getChannel(channelUrl)
      .then((channel) => {
        const promisify = () => {
          let pendingMsg = null;
          const pendingPromise = new Promise((resolve_, reject_) => {
            pendingMsg = channel.sendUserMessage(userMessageParams, (res, err) => {
              const swapParams = sdk.getErrorFirstCallback();
              let message = res;
              let error = err;
              if (swapParams) {
                message = err;
                error = res;
              }
              if (error) {
                reject_(error);
                return;
              }
              resolve_(message);
              pubsub.publish(
                topics.SEND_USER_MESSAGE,
                {
                  message,
                  channel,
                },
              );
            });
            pubsub.publish(
              topics.SEND_MESSAGE_START,
              {
                message: pendingMsg,
                channel,
              },
            );
          });
          pendingPromise.get = () => pendingMsg;
          return pendingPromise;
        };
        resolve(promisify());
      })
      .catch(reject);
  });
};
export const getSendFileMessage = (store) => (channelUrl, fileMessageParams) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.GroupChannel.getChannel(channelUrl)
      .then((channel) => {
        const promisify = () => {
          let pendingMsg = null;
          const pendingPromise = new Promise((resolve_, reject_) => {
            pendingMsg = channel.sendFileMessage(fileMessageParams, (res, err) => {
              const swapParams = sdk.getErrorFirstCallback();
              let message = res;
              let error = err;
              if (swapParams) {
                message = err;
                error = res;
              }

              if (error) {
                reject_(error);
                return;
              }
              resolve_(message);
              pubsub.publish(
                topics.SEND_FILE_MESSAGE,
                {
                  message,
                  channel,
                },
              );
            });
          });
          if (fileMessageParams.file) {
            // keep the file's local version in pendingMsg.localUrl
            // because promise doesnt allow overriding of pendingMsg.url
            // eslint-disable-next-line no-param-reassign
            pendingMsg.localUrl = URL.createObjectURL(fileMessageParams.file);
          }
          if (fileMessageParams.fileUrl) {
            // eslint-disable-next-line no-param-reassign
            pendingMsg.localUrl = fileMessageParams.fileUrl;
          }
          // eslint-disable-next-line no-param-reassign
          pendingMsg.requestState = 'pending';
          pubsub.publish(
            topics.SEND_MESSAGE_START,
            {
              message: pendingMsg,
              channel,
            },
          );
          pendingPromise.get = () => pendingMsg;
          return pendingPromise;
        };
        resolve(promisify());
      })
      .catch(reject);
  });
};
export const getUpdateUserMessage = (store) => (channelUrl, messageId, params) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.GroupChannel.getChannel(channelUrl)
      .then((channel) => {
        channel.updateUserMessage(messageId, params, (res, err) => {
          const swapParams = sdk.getErrorFirstCallback();
          let message = res;
          let error = err;
          if (swapParams) {
            message = err;
            error = res;
          }

          if (error) {
            reject(error);
            return;
          }
          resolve(message);
          pubsub.publish(
            topics.UPDATE_USER_MESSAGE,
            {
              message,
              channel,
              // workaround for updating channelPreview on message-edit
              // https://sendbird.atlassian.net/browse/UIKIT-268
              fromSelector: true,
            },
          );
        });
      })
      .catch(reject);
  });
};
export const getDeleteMessage = (store) => (channelUrl, message) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.GroupChannel.getChannel(channelUrl)
      .then((channel) => {
        const { messageId } = message;
        channel.deleteMessage(message, (res, err) => {
          const swapParams = sdk.getErrorFirstCallback();
          let error = err;
          if (swapParams) {
            error = res;
          }

          if (error) {
            reject(error);
            return;
          }
          resolve(message);
          pubsub.publish(
            topics.DELETE_MESSAGE,
            {
              messageId,
              channel,
            },
          );
        });
      })
      .catch(reject);
  });
};

export const getResendUserMessage = (store) => (channelUrl, failedMessage) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.GroupChannel.getChannel(channelUrl)
      .then((channel) => {
        channel.resendUserMessage(failedMessage)
          .then((message) => {
            resolve(message);
            pubsub.publish(
              topics.SEND_USER_MESSAGE,
              {
                message,
                channel,
              },
            );
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

export const getResendFileMessage = (store) => (channelUrl, failedMessage) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.GroupChannel.getChannel(channelUrl)
      .then((channel) => {
        channel.resendFileMessage(failedMessage)
          .then((message) => {
            resolve(message);
            pubsub.publish(
              topics.SEND_FILE_MESSAGE,
              {
                message,
                channel,
              },
            );
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

export const getCreateChannel = (store) => (params) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.GroupChannel.createChannel(params)
      .then((channel) => {
        resolve(channel);
        pubsub.publish(
          topics.CREATE_CHANNEL,
          {
            channel,
          },
        );
      })
      .catch(reject);
  });
};

export const getLeaveChannel = (store) => (channelUrl) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.GroupChannel.getChannel(channelUrl)
      .then((channel) => {
        channel.leave()
          .then(() => {
            resolve(channel);
            pubsub.publish(
              topics.LEAVE_CHANNEL,
              {
                channel,
              },
            );
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

export const getFreezeChannel = (store) => (channelUrl) => {
  const sdk = getSdk(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.GroupChannel.getChannel(channelUrl)
      .then((channel) => {
        channel.freeze()
          .then(() => {
            // do not need pubsub here - event listener works
            resolve(channel);
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

export const getUnFreezeChannel = (store) => (channelUrl) => {
  const sdk = getSdk(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.GroupChannel.getChannel(channelUrl)
      .then((channel) => {
        channel.unfreeze()
          .then(() => {
            // do not need pubsub here - event listener works
            resolve(channel);
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

export const getCreateOpenChannel = (store) => (params) => {
  const sdk = getSdk(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.OpenChannel.createChannel(params)
      .then((channel) => {
        resolve(channel);
      })
      .catch(reject);
  });
};
export const enterOpenChannel = (store) => (channelUrl) => {
  const sdk = getSdk(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.OpenChannel.getChannel(channelUrl, (openChannel, error) => {
      if (error) {
        reject(new Error(error));
        return;
      }

      openChannel.enter((response, enterError) => {
        if (error) {
          reject(new Error(enterError));
          return;
        }
        resolve(response);
      });
    });
  });
};

export const exitOpenChannel = (store) => (channelUrl) => {
  const sdk = getSdk(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.OpenChannel.getChannel(channelUrl, (openChannel, error) => {
      if (error) {
        reject(new Error(error));
        return;
      }

      openChannel.exit((response, exitError) => {
        if (error) {
          reject(new Error(exitError));
          return;
        }
        resolve(response);
      });
    });
  });
};

export const getOpenChannelSendUserMessage = (store) => (channelUrl, userMessageParams) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.OpenChannel.getChannel(channelUrl)
      .then((channel) => {
        const promisify = () => {
          let pendingMsg = null;
          const pendingPromise = new Promise((resolve_, reject_) => {
            pendingMsg = channel.sendUserMessage(userMessageParams, (res, err) => {
              const swapParams = sdk.getErrorFirstCallback();
              let message = res;
              let error = err;
              if (swapParams) {
                message = err;
                error = res;
              }
              if (error) {
                reject_(error);
                return;
              }
              resolve_(message);
              pubsub.publish(
                topics.SEND_USER_MESSAGE,
                {
                  message,
                  channel,
                },
              );
            });
            pubsub.publish(
              topics.SEND_MESSAGE_START,
              {
                message: pendingMsg,
                channel,
              },
            );
          });
          pendingPromise.get = () => pendingMsg;
          return pendingPromise;
        };
        resolve(promisify());
      })
      .catch(reject);
  });
};

export const getOpenChannelSendFileMessage = (store) => (channelUrl, fileMessageParams) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.OpenChannel.getChannel(channelUrl)
      .then((channel) => {
        const promisify = () => {
          let pendingMsg = null;
          const pendingPromise = new Promise((resolve_, reject_) => {
            pendingMsg = channel.sendFileMessage(fileMessageParams, (res, err) => {
              const swapParams = sdk.getErrorFirstCallback();
              let message = res;
              let error = err;
              if (swapParams) {
                message = err;
                error = res;
              }

              if (error) {
                reject_(error);
                return;
              }
              resolve_(message);
              pubsub.publish(
                topics.SEND_FILE_MESSAGE,
                {
                  message,
                  channel,
                },
              );
            });
          });
          if (fileMessageParams.file) {
            // keep the file's local version in pendingMsg.localUrl
            // because promise doesnt allow overriding of pendingMsg.url
            // eslint-disable-next-line no-param-reassign
            pendingMsg.localUrl = URL.createObjectURL(fileMessageParams.file);
          }
          if (fileMessageParams.fileUrl) {
            // eslint-disable-next-line no-param-reassign
            pendingMsg.localUrl = fileMessageParams.fileUrl;
          }
          // eslint-disable-next-line no-param-reassign
          pendingMsg.requestState = 'pending';
          pubsub.publish(
            topics.SEND_MESSAGE_START,
            {
              message: pendingMsg,
              channel,
            },
          );
          pendingPromise.get = () => pendingMsg;
          return pendingPromise;
        };
        resolve(promisify());
      })
      .catch(reject);
  });
};

export const getOpenChannelUpdateUserMessage = (store) => (channelUrl, messageId, params) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.OpenChannel.getChannel(channelUrl)
      .then((channel) => {
        channel.updateUserMessage(messageId, params, (res, err) => {
          const swapParams = sdk.getErrorFirstCallback();
          let message = res;
          let error = err;
          if (swapParams) {
            message = err;
            error = res;
          }

          if (error) {
            reject(error);
            return;
          }
          resolve(message);
          pubsub.publish(
            topics.UPDATE_USER_MESSAGE,
            {
              message,
              channel,
              // workaround for updating channelPreview on message-edit
              // https://sendbird.atlassian.net/browse/UIKIT-268
              fromSelector: true,
            },
          );
        });
      })
      .catch(reject);
  });
};

export const getOpenChannelDeleteMessage = (store) => (channelUrl, message) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.OpenChannel.getChannel(channelUrl)
      .then((channel) => {
        const { messageId } = message;
        channel.deleteMessage(message, (res, err) => {
          const swapParams = sdk.getErrorFirstCallback();
          let error = err;
          if (swapParams) {
            error = res;
          }

          if (error) {
            reject(error);
            return;
          }
          resolve(message);
          pubsub.publish(
            topics.DELETE_MESSAGE,
            {
              messageId,
              channel,
            },
          );
        });
      })
      .catch(reject);
  });
};

export const getOpenChannelResendUserMessage = (store) => (channelUrl, failedMessage) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.OpenChannel.getChannel(channelUrl)
      .then((channel) => {
        channel.resendUserMessage(failedMessage)
          .then((message) => {
            resolve(message);
            pubsub.publish(
              topics.SEND_USER_MESSAGE,
              {
                message,
                channel,
              },
            );
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

export const getOpenChannelResendFileMessage = (store) => (channelUrl, failedMessage) => {
  const sdk = getSdk(store);
  const pubsub = getPubSub(store);
  return new Promise((resolve, reject) => {
    if (!sdk) {
      reject(new Error('Sdk not found'));
    }
    sdk.OpenChannel.getChannel(channelUrl)
      .then((channel) => {
        channel.resendFileMessage(failedMessage)
          .then((message) => {
            resolve(message);
            pubsub.publish(
              topics.SEND_FILE_MESSAGE,
              {
                message,
                channel,
              },
            );
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

export default {
  getSdk,
  getConnect,
  getDisconnect,
  getUpdateUserInfo,
  getSendUserMessage,
  getSendFileMessage,
  getUpdateUserMessage,
  getDeleteMessage,
  getResendUserMessage,
  getResendFileMessage,
  getFreezeChannel,
  getUnFreezeChannel,
  getCreateChannel,
  getLeaveChannel,
  getCreateOpenChannel,
  getEnterOpenChannel: enterOpenChannel,
  getExitOpenChannel: exitOpenChannel,
  getOpenChannelSendUserMessage,
  getOpenChannelSendFileMessage,
  getOpenChannelUpdateUserMessage,
  getOpenChannelDeleteMessage,
  getOpenChannelResendUserMessage,
  getOpenChannelResendFileMessage,
};
