import Chat from "components/Chat";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import chatStore from "stores/store";
import styled from "styled-components";
//@ts-ignore
import ReactFlvPlayer from "../../components/Player";

export default observer(function StreamPage() {
  const { streamKey } = useParams<{ streamKey: string }>();

  useEffect(() => {
    (async () => {
      if (chatStore.initialized) {
        await chatStore.initSocket();
        await chatStore.fetchStreamsData();
        await chatStore.setStream(streamKey);
        await chatStore.getMessages();
      }
    })();
  }, [chatStore.initialized]);

  const stream = chatStore.streamsData.find((s) => s.streamKey === streamKey);
  if (!stream) return <div></div>;


  return (
    <StreamPageView>
      <PlayerWrapper>
        <ReactFlvPlayer type="flv" stream={stream} streamKey={streamKey} />
      </PlayerWrapper>
      <ChatWrapper>
        <Chat
          messages={chatStore.currentChat}
          onMessageAdd={(m) => chatStore.addMessage(m)}
        />
      </ChatWrapper>
    </StreamPageView>
  );
});

const StreamPageView = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 0.5rem;
  height: 98vh;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const PlayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;

  border: 1px solid #fff;
  @media (max-width: 1000px) {
    flex-grow: 0;
  }
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  /* flex-direction: column; */

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;
