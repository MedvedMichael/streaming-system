import { observer } from "mobx-react";
import { useEffect, Component, useRef, useState } from "react";
import styled from "styled-components";
import videojs, { VideoJsPlayerOptions, VideoJsPlayer } from "video.js";

export default observer(
  class StreamPage extends Component<
    {},
    { stream: boolean; videoJsOptions: VideoJsPlayerOptions | null }
  > {
    player!: VideoJsPlayer;
    videoNode!: HTMLVideoElement;
    constructor(props: any) {
      super(props);

      this.state = {
        stream: false,
        videoJsOptions: null,
      };
    }

    async componentDidMount() {
      this.setState(
        {
          stream: true,
          videoJsOptions: {
            autoplay: false,
            controls: true,
            sources: [
              {
                src:
                  "http://192.168.1.175:" +
                  "8888" +
                  "/live/" +
                  "FuUtjnCDF" +
                  "/index.m3u8",
                type: "application/x-mpegURL",
              },
            ],
            fluid: true,
          },
        },
        () => {
          this.player = videojs(
            this.videoNode,
            this.state.videoJsOptions as VideoJsPlayerOptions,
            function onPlayerReady() {
              console.log("onPlayerReady", this);
            }
          );
        }
      );
    }

    componentWillUnmount() {
      if (this.player) {
        this.player.dispose();
      }
    }

    render() {
      return (
        <StreamPageView>
          <Player>
            {this.state.stream ? (
              <div data-vjs-player>
                <video
                  ref={(node) => (this.videoNode = node as HTMLVideoElement)}
                  className="video-js vjs-big-play-centered"
                />
              </div>
            ) : (
              " Loading ... "
            )}
          </Player>
        </StreamPageView>
      );
    }
  }
);

const StreamPageView = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const Player = styled.div`
  display: flex;
  margin: auto 0;
`;
