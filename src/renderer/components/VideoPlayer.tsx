import React from 'react';

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  return (
    <div>
      <video src="" id={videoId}>
        <track kind="captions" />
      </video>
    </div>
  );
};

export default VideoPlayer;
