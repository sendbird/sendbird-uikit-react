import "./App.css";
import "@sendbird/uikit-react/dist/index.css";
import React, { useEffect, useMemo, useState } from "react";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import { Channel, ChannelList } from "@sendbird/uikit-react";
import SessionHandler from "@sendbird/uikit-react/handlers/SessionHandler";

// Add client app info.
const appInfo = {
  appId: "EBFA7043-07D8-4F87-AB0D-A0C62A62A70B",
  apiToken: "f2d3d2a5123fc32149bb38933a5d37af7ccc53bc",
  userId: "hoon752",
};
const configureSession = () => {
  const sessionHandler = new SessionHandler();
  sessionHandler.onSessionTokenRequired = (resolve, reject) => {
    console.log("🚨 SessionHandler.onSessionTokenRequired()");
    issueSessionToken()
      .then((token) => {
        // When using access token, set `currentUserInfo.accessToken` to `token`.
        resolve(token);
      })
      .catch((err) => {
        console.log("🚨 SessionHandler.onSessionTokenRequired() error", err);
      });
  };
  sessionHandler.onSessionRefreshed = () => {
    console.log("🚨 SessionHandler.onSessionRefreshed()");
  };
  sessionHandler.onSessionError = (err) => {
    console.log("🚨 SessionHandler.onSessionError()", err);
  };
  sessionHandler.onSessionClosed = () => {
    console.log("🚨 SessionHandler.onSessionClosed()");
  };
  return sessionHandler;
};
const issueSessionToken = async () => {
  const endpoint = `https://api-${appInfo.appId}.sendbird.com/v3/users/${appInfo.userId}/token`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Api-Token": appInfo.apiToken,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      expires_at: Date.now() + 60000, // 1 minute from now
    }),
  });
  const result = await response.json();
  console.log("✅", result);
  return result.token;
};
function App() {
  const [tkn, setTkn] = useState();
  useEffect(() => {
    if (!tkn) {
      console.warn("inside");
      const initiateSession = async () => {
        try {
          const token = await issueSessionToken();
          setTkn(token);
        } catch (error) {
          console.error(error);
        }
      };
      initiateSession();
    }
  }, [tkn]);
  const [currentChannelUrl, setCurrentChannelUrl] = React.useState("");
  const thing = useMemo(() => configureSession, []);
  if (!tkn) {
    return null;
  }
  console.log(tkn);
  return (
    <div className="App">
      <SendbirdProvider
        appId={appInfo.appId}
        userId={appInfo.userId}
        accessToken={tkn}
        config={{ logLevel: "all" }}
        configureSession={thing}
      >
        {
          (
            <>
              <div className="sendbird-app__channellist-wrap">
                <ChannelList
                  onChannelSelect={(channel) => {
                    if (channel?.url) {
                      setCurrentChannelUrl(channel.url);
                    }
                  }}
                />
              </div>
              <div className="sendbird-app__conversation-wrap">
                <Channel channelUrl={currentChannelUrl} />
              </div>
            </>
          )
        }
      </SendbirdProvider>
    </div>
  );
}
export default App;
