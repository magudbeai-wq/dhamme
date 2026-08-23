import React, { useState, useRef, useEffect } from 'react';

interface PropertyVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
}

export const PropertyVideoPlayer: React.FC<PropertyVideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  title = 'Property Video Tour',
  className = '',
  autoPlay = false
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const controlsTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => {
      setDuration(video.duration || 0);
      setIsLoading(false);
    };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onError);
    };
  }, [videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = Number(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 group select-none ${className}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        playsInline
        muted={isMuted}
        autoPlay={autoPlay}
        onClick={togglePlay}
        className="w-full h-full max-h-[500px] object-contain cursor-pointer bg-slate-950"
      />

      {/* Top Banner overlay */}
      <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none flex items-center justify-between z-20 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
          <span className="text-xs font-poppins font-black text-white uppercase tracking-wider drop-shadow-md">
            🎥 Video Tour • {title}
          </span>
        </div>
        <span className="text-[10px] font-bold text-amber-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-amber-400/40">
          Jigjiga Live Tour
        </span>
      </div>

      {/* Center Big Play/Pause Button overlay */}
      {(!isPlaying || isLoading) && !hasError && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer z-10"
        >
          {isLoading ? (
            <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-white/30 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[32px] animate-spin">progress_activity</span>
            </div>
          ) : (
            <button
              type="button"
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl border-2 border-amber-300 transform hover:scale-110 active:scale-95 transition-all"
              title="Play Video"
            >
              <span className="material-symbols-outlined text-[36px] ml-1">play_arrow</span>
            </button>
          )}
        </div>
      )}

      {/* Error Fallback Card */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-white p-6 text-center z-30 space-y-3">
          <span className="material-symbols-outlined text-[48px] text-amber-400">videocam_off</span>
          <h4 className="font-poppins font-bold text-sm">Muuqaalka Lama Soo Bandhigi Karo</h4>
          <p className="text-xs text-slate-300 max-w-xs">
            Fadlan hubi internet-kaaga ama dib u celi bogga si aad u daawato muuqaalka guriga.
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              if (videoRef.current) {
                videoRef.current.load();
                videoRef.current.play().catch(() => {});
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
          >
            Isku Day Mar Kale (Retry)
          </button>
        </div>
      )}

      {/* Bottom Custom Playback Bar Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 z-20 space-y-2 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Slider */}
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-rose-600 focus:outline-none"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center space-x-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            {/* Mute/Unmute */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition active:scale-95 flex items-center space-x-1"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <span className="material-symbols-outlined text-[22px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
              <span className="text-[10px] hidden sm:inline text-slate-300">
                {isMuted ? 'Muted' : 'Sound On'}
              </span>
            </button>

            {/* Time Stamp */}
            <span className="font-mono text-[11px] text-slate-300 font-semibold">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition active:scale-95"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <span className="material-symbols-outlined text-[22px]">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
