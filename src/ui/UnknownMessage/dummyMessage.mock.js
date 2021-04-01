export default function generateUnknownMessage(pretreatment) {
  const message = {
    messageId: 358312775,
    messageType: "unkown",
    channelUrl: "sendbird_group_channel_13883929_89ea0faddf24ba6328e95ff56b0b37960f400c83",
    data: "",
    customType: "",
    createdAt: 1579767478896,
    updatedAt: 0,
    channelType: "group",
    metaArrays: [],
    reactions: [],
    mentionType: "",
    mentionedUsers: [],
    message: "UNKNOWN TEXT",
    sender: {
      nickname: "Sravan",
      profileUrl: "https://static.sendbird.com/sample/profiles/profile_33_512px.png",
      connectionStatus: "nonavailable",
      userId: "userIds[getRandomInt(2)]",
      lastSeenAt: 0,
      metaData: {},
      isActive: true,
      friendDiscoveryKey: null,
      friendName: null,
      preferredLanguages: null
    },
    reqId: "1579767478746",
    translations: {},
    requestState: "succeeded",
    requestedMentionUserIds: [],
    errorCode: 0,
  }
  if (pretreatment) {
    return pretreatment(message);
  } else {
    return message;
  }
};
