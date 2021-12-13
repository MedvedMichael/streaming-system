import Chat from "components/Chat";
import { StyledButton } from "components/styled/styled-button";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import chatStore from "stores/store";
import styled from "styled-components";
//@ts-ignore
import ReactFlvPlayer from "../../components/Player";

export default observer(function StreamPage() {
  const { streamKey } = useParams<{ streamKey: string }>();
  const history = useHistory();
  const [showNewNameInput, setShowNewNameInput] = useState(false);
  const [newName, setNewName] = useState("");
  const isMyStream = chatStore?.user?.streamKey === streamKey;

  useEffect(() => {
    (async () => {
      if (chatStore.initialized) {
        await chatStore.fetchStreamsData();
        const currentStream = chatStore.streamsData.find(
          (s) => s.streamKey == streamKey
        );
        if (!currentStream) {
          return history.push("/streams");
        }
        await chatStore.initSocket();
        await chatStore.setStream(streamKey);
        await chatStore.getMessages();
        setNewName(currentStream.name);
      }
    })();
  }, [chatStore.initialized]);

  const stream = chatStore.streamsData.find((s) => s.streamKey === streamKey);
  if (!stream) return <div></div>;

  const onSaveNewName = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newName.trim() === "") return;
    await chatStore.changeStreamName(newName);
    setShowNewNameInput(false);
  };
  return (
    <StreamPageView>
      <PlayerWrapper>
        <TitleBlock>
          {!showNewNameInput ? (
            <>
              <h2>{stream.name}</h2>
              {isMyStream ? (
                <StyledButton
                  className="small"
                  onClick={() => setShowNewNameInput(true)}
                >
                  Edit name
                </StyledButton>
              ) : null}
            </>
          ) : (
            <form onSubmit={onSaveNewName}>
              <input
                type="text"
                value={newName}
                onChange={({ target }) => setNewName(target.value)}
              />
              <StyledButton>Save</StyledButton>
            </form>
          )}
        </TitleBlock>
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
  height: 91vh;
  margin-top: 5rem;

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

  & h2 {
    margin: 1.5rem 0;
    text-align: center;
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
const TitleBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  & * {
    margin: 0.5rem;
    flex-basis: auto;
  }
  & h2 {
    padding-bottom: 0.25rem;
  }

  & form {
    display: flex;
    flex-grow: 1;
    & input {
      flex-grow: 1;
      border-radius: 0.5rem 0 0 0.5rem;
      border: 0;
      margin-right: 0;
    }

    & button {
      border-radius: 0 0.5rem 0.5rem 0;
      margin-left: 0;
    }
  }
`;
