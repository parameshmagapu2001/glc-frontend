import React from 'react';

interface VideoProps {
  src: string | undefined;
  style: React.CSSProperties;
}

const Video: React.FC<VideoProps> = ({ src, style }) => (
  <video key={src} controls autoPlay={false} style={style}>
    <source src={src} type="video/mp4" />
    <track kind="captions" src="" label="English" />
  </video>
);

export default Video;
