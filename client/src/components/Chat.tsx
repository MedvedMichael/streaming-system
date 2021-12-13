import { IMessageWithNickname } from "interfaces/Stream.interface";
import { observer } from "mobx-react";
import { useRef, useState } from "react";
import styled from "styled-components";
import { StyledButton } from "./styled/styled-button";

export default observer(function Chat({
  messages,
  onMessageAdd,
}: {
  messages: IMessageWithNickname[];
  onMessageAdd: (text: string) => void;
}) {
  const [newMessage, setNewMessage] = useState("");
  const inputRef =
    useRef<HTMLInputElement>() as React.LegacyRef<HTMLInputElement>;
  return (
    <ChatView>
      <NewMessageForm
        onSubmit={(e) => {
          e.preventDefault();
          onMessageAdd(newMessage);
          setNewMessage("");
        }}
      >
        <input
          id="chat-input"
          ref={inputRef}
          type="text"
          autoComplete="off"
          value={newMessage}
          onChange={({ target }) => setNewMessage(target.value)}
        />
        <StyledButton>Send</StyledButton>
      </NewMessageForm>
      <MessagesBlock>
        {messages.map((m) => (
          <MessageCard key={`${m.nickname}-${m.createdAt}`} message={m} />
        ))}
      </MessagesBlock>
    </ChatView>
  );
});

const MessageCard = observer(function ({
  message,
}: {
  message: IMessageWithNickname;
}) {
  return (
    <MessageView>
      <h5>{message.nickname}</h5>
      <span>{message.text}</span>
      <span>{message.createdAt.toLocaleString()}</span>
    </MessageView>
  );
});

const ChatView = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #fff;

  @media (max-width: 1000px) {
    flex-grow: 1;
  }
`;

const MessageView = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background: #183f88;
  border-radius: 0.25rem;
  margin: 0.25rem;

  & h5 {
    margin: 0;
  }

  & span {
    word-wrap: break-word;
  }
`;

const NewMessageForm = styled.form`
  display: flex;
  margin-bottom: 0.5rem;
  & input {
    flex-grow: 1;
    border-radius: 0.5rem 0 0 0.5rem;
    border: 0;
  }

  & button {
    border-radius: 0 0.5rem 0.5rem 0;
  }
`;

const MessagesBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  flex-grow: 1;
  overflow-y: auto;
`;
