import { ServerStream } from "interfaces/Stream.interface";
import { observer } from "mobx-react";
import { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { StyledButton } from "./styled/styled-button";

interface Props {
  streams: ServerStream[];
}

export default observer(function StreamsList({ streams }: Props): JSX.Element {
  const [search, setSearch] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const streamsPreviews = streams.reduce<React.ReactChild[]>(
    (acc, stream) =>
      stream.name.toLowerCase().includes(search.toLowerCase())
        ? [...acc, <StreamCard key={stream.streamKey} stream={stream} />]
        : acc,
    []
  );
  return (
    <StreamsListView>
      <SearchForm
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(newSearch);
        }}
      >
        <input
          value={newSearch}
          onChange={({ target }) => setNewSearch(target.value)}
        />
        <StyledButton>Search</StyledButton>
      </SearchForm>
      <StreamsListBlock>
        {streamsPreviews}
        {streamsPreviews.length !== 0 || <span>No Streams</span>}
      </StreamsListBlock>
    </StreamsListView>
  );
});

function StreamCard({ stream }: { stream: ServerStream }) {
  const history = useHistory();
  return (
    <StreamCardView
      onClick={() => {
        history.push(`/stream/${stream.streamKey}`);
      }}
    >
      <div>
        <img
          src={`${process.env.REACT_APP_SERVER_URL}/thumbnails/${stream.streamKey}.png`}
        />
      </div>
      <span>{stream.name}</span>
    </StreamCardView>
  );
}

const StreamsListBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  & * {
    margin: 0.5rem;
  }

  & span {
    margin: auto;
    font-size: calc(3rem + 5vw);
  }
`;

const StreamCardView = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border: 1px solid #ffffff;
  border-radius: 0.25rem;
  max-width: 30rem;
  transition: background 0.2s ease;
  &:hover {
    background: #0d33b1;
  }
  & span {
    text-align: center;
    font-size: x-large;
  }

  & div {
    & img {
      width: 95%;
    }
  }
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  & input {
    flex-grow: 1;
    border-radius: 0.5rem 0 0 0.5rem;
    border: 0;
    max-width: 40rem;
  }

  & button {
    border-radius: 0 0.5rem 0.5rem 0;
  }
`;

const StreamsListView = styled.div`
  display: flex;
  flex-direction: column;
`;
