import { ServerStream } from "interfaces/Stream.interface";
import { observer } from "mobx-react";
import { useHistory } from "react-router";
import styled from "styled-components";

interface Props {
  streams: ServerStream[];
}

export default observer(function StreamsList({ streams }: Props): JSX.Element {
  const streamsPreviews = streams.map((stream) => (
    <StreamCard stream={stream} />
  ));
  return (
    <StreamsListBlock>
      {streamsPreviews}
    </StreamsListBlock>
  );
});

function StreamCard({ stream }: { stream: ServerStream }) {
  const history = useHistory();
  return (
    <StreamCardView
      key={stream.streamKey}
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
