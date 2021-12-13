import React, { useEffect, useMemo, useRef, useState } from "react";
import flvjs from "flv.js";
import styled from "styled-components";
import { ServerStream } from "interfaces/Stream.interface";
import { StyledButton } from "./styled/styled-button";

type Props = flvjs.MediaDataSource &
  flvjs.Config & {
    stream: ServerStream;
    streamKey: string;
  };

export default function ReactFlvPlayer({
  type,
  isLive,
  enableStashBuffer,
  stashInitialSize,
  hasAudio,
  hasVideo,
  stream,
  streamKey,
}: Props) {
  const myRef = useRef<HTMLVideoElement>();
  const [player, setPlayer] = useState<flvjs.Player>();
  const [quality, setQuality] = useState<number>();

  useEffect(() => {
    init();
    return () => {
      setPlayer((player) => {
        try {
          player?.pause();
          player?.unload();
          player?.detachMediaElement();
          player?.destroy();
          return undefined;
        } catch {}
      });
    };
  }, [quality]);

  const qualities = useMemo(
    () =>
      stream.streams
        .filter((s) => s.info.video.height !== 0)
        .map((s) => ({ value: s.info.video.height, name: s.name }))
        .sort((a, b) => b.value - a.value),
    [stream]
  );

  const init = () => {
    if (player) {
      player.destroy();
    }
    if (flvjs.isSupported()) {
      const url = `${process.env.REACT_APP_MEDIA_SERVER}/live/${
        qualities.find((q) => q.value === quality)?.name || streamKey
      }.flv`;
      const flvPlayer = flvjs.createPlayer(
        {
          type,
          isLive,
          url,
          hasAudio,
          hasVideo,
        },
        {
          enableStashBuffer,
          stashInitialSize,
        }
      );

      //   flvjs.LoggingControl.enableError = false;
      flvjs.LoggingControl.enableAll = false;
      //@ts-ignore
      flvPlayer.attachMediaElement(myRef.current);
      flvPlayer.load();
      flvPlayer.play();
      setPlayer(flvPlayer);
    }
  };

  return (
    <PlayerView>
      <PlayerWrapper>
        <video
          autoPlay={true}
          controls={true}
          muted={true}
          //@ts-ignore
          ref={myRef}
          // style={{ height, width }}
        />
      </PlayerWrapper>
      <ControlsBar>
        <select
          value={quality || `${qualities[0]}p`}
          onChange={(e) => setQuality(parseInt(e.target.value))}
          // name="720"
        >
          {qualities.map((q) => (
            <option key={q.value} value={q.value}>
              {q.value}p
            </option>
          ))}
        </select>
      </ControlsBar>
    </PlayerView>
  );
}

const PlayerView = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  justify-content: center;

  & * {
    margin: 0.5rem;
  }
`;

const PlayerWrapper = styled.div`
  max-width: 60rem;
  position: relative;
  /* width: 90%; */
  aspect-ratio: 16 / 9;

  & video {
    margin: 0;
    width: 100%;
    height: auto;
    left: 0;
    right: 0;
    position: absolute;
  }
`;

const ControlsBar = styled.div`
  display: flex;
`;
