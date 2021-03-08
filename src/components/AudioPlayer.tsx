import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { stopButton, startButton } from "../img";
import "./AudioPlayer.scss";

interface AudioPlayerProps {
  audioSrc?: string;
}

const AudioPlayer = ({ audioSrc }: AudioPlayerProps) => {
  const [play, setPlay] = useState<boolean>(false);
  const [onText, setOnText] = useState("00:00");

  const timeline = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const button = useRef<HTMLImageElement>(null);

  useEffect(() => {
    audio.current.addEventListener("timeupdate", () => {
      setOnText(formatTime(audio.current.currentTime.toFixed(0)));
      let ratio = audio.current.currentTime / audio.current.duration;
      let position = audio.current.offsetWidth * ratio;
      positionHandle(position);
    });
  }, []);

  const positionHandle = (position: number) => {
    let timelineWidth = timeline.current.offsetWidth - handle.current.offsetWidth;
    let handleLeft = position - timeline.current.offsetLeft;

    if (handleLeft >= 0 && handleLeft <= timelineWidth) {
      handle.current.style.marginLeft = handleLeft + "px";
    }
    if (handleLeft < 0) {
      handle.current.style.marginLeft = "0px";
    }
    if (handleLeft > timelineWidth) {
      handle.current.style.marginLeft = timelineWidth + "px";
      button.current.src = startButton;
    }
  };

  const onMouseMove = (e: any) => {
    positionHandle(e.offsetX);
    let sound = (e.offsetX / timeline.current.offsetWidth) * audio.current.duration;
    if (isNaN(sound)) {
      return;
    } else {
      audio.current.currentTime = sound;
    }
  };

  const onPlay = () => {
    if (play) {
      setPlay(false);
      audio.current.pause();
      button.current.src = startButton;
    } else {
      setPlay(true);
      audio.current.play();
      button.current.src = stopButton;
    }
  };

  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const onMouseDown = () => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const formatTime = (time: any) => {
    let min = "0" + Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return min + ":" + (sec < 10 ? "0" + sec : sec);
  };

  return (
    <>
      <div className="all-container">
        <div>
          <audio src={audioSrc} id="audio" ref={audio} />
          <div className="audio-timeline" onClick={onMouseMove} ref={timeline}>
            <div className="audio-handle" onMouseDown={onMouseDown} ref={handle}></div>
            <span>{onText}</span>
          </div>
          <div>
            <img ref={button} src={startButton} onClick={onPlay} alt="play-button" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
