import StreamsList from "components/StreamsList";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import chatStore from "stores/store";
import styled from "styled-components";
//@ts-ignore
import ReactFlvPlayer from "../../components/Player";

export default observer(function AvailableStreamsPage() {
  useEffect(() => {
    if (chatStore.initialized) {
      chatStore.fetchStreamsData();
    }
  }, [chatStore.initialized]);

  return (
    <AvailableStreamsPageView>
      <StreamsList streams={chatStore.streamsData} />
    </AvailableStreamsPageView>
  );
});

const AvailableStreamsPageView = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const PlayerWrapper = styled.div`
  display: flex;
  margin: auto 0;
`;
