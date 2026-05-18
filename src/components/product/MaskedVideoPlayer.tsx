'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface MaskRegion {
  x: number
  y: number
  width: number
  height: number
  type: 'blur' | 'black' | 'gradient'
}

interface MaskedVideoPlayerProps {
  src: string
  poster?: string
  cropTop?: number
  cropBottom?: number
  cropLeft?: number
  cropRight?: number
  maskRegions?: MaskRegion[]
  className?: string
  autoPlay?: boolean
}

export default function MaskedVideoPlayer({
  src,
  poster,
  cropTop = 0,
  cropBottom = 0,
  cropLeft = 0,
  cropRight = 0,
  maskRegions = [],
  className = '',
  autoPlay = false,
}: MaskedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const hasCrop = cropTop > 0 || cropBottom > 0 || cropLeft > 0 || cropRight > 0
  const hasMasks = maskRegions.length > 0
  const useCanvas = hasCrop || hasMasks

  const drawFrame = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.paused || video.ended) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const vw = video.videoWidth
    const vh = video.videoHeight
    if (vw === 0 || vh === 0) return

    const sx = Math.round(vw * (cropLeft / 100))
    const sy = Math.round(vh * (cropTop / 100))
    const sw = Math.round(vw * (1 - cropLeft / 100 - cropRight / 100))
    const sh = Math.round(vh * (1 - cropTop / 100 - cropBottom / 100))

    canvas.width = sw
    canvas.height = sh

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh)

    for (const region of maskRegions) {
      const rx = Math.round(sw * (region.x / 100))
      const ry = Math.round(sh * (region.y / 100))
      const rw = Math.round(sw * (region.width / 100))
      const rh = Math.round(sh * (region.height / 100))

      if (region.type === 'black') {
        ctx.fillStyle = '#000000'
        ctx.fillRect(rx, ry, rw, rh)
      } else if (region.type === 'gradient') {
        const grad = ctx.createLinearGradient(rx, ry, rx, ry + rh)
        grad.addColorStop(0, 'rgba(0,0,0,1)')
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.fillRect(rx, ry, rw, rh)
      } else if (region.type === 'blur') {
        const imageData = ctx.getImageData(rx, ry, rw, rh)
        const blurred = applyBoxBlur(imageData, 8)
        ctx.putImageData(blurred, rx, ry)
      }
    }

    animFrameRef.current = requestAnimationFrame(drawFrame)
  }, [cropTop, cropBottom, cropLeft, cropRight, maskRegions])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      if (useCanvas) {
        animFrameRef.current = requestAnimationFrame(drawFrame)
      }
    }
    const handlePause = () => {
      setIsPlaying(false)
      cancelAnimationFrame(animFrameRef.current)
    }
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      cancelAnimationFrame(animFrameRef.current)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [drawFrame, useCanvas])

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [autoPlay])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const time = parseFloat(e.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const vol = parseFloat(e.target.value)
    video.volume = vol
    setVolume(vol)
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      container.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  const formatTime = (t: number): string => {
    const min = Math.floor(t / 60)
    const sec = Math.floor(t % 60)
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      className={`relative group rounded-xl overflow-hidden bg-black ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Hidden video element (source for canvas) */}
      <video
        ref={videoRef}
        src={src}
        poster={!useCanvas ? poster : undefined}
        playsInline
        preload="metadata"
        className={useCanvas ? 'absolute opacity-0 pointer-events-none w-0 h-0' : 'w-full h-full object-contain'}
        style={!useCanvas ? {
          clipPath: `inset(${cropTop}% ${cropRight}% ${cropBottom}% ${cropLeft}%)`,
        } : undefined}
      />

      {/* Canvas for cropped/masked rendering */}
      {useCanvas && (
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
        />
      )}

      {/* Click overlay for non-canvas mode */}
      {!useCanvas && (
        <div className="absolute inset-0 cursor-pointer" onClick={togglePlay} />
      )}

      {/* Play button overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/20"
          >
            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-3 pt-10 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress bar */}
        <div className="mb-2">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 appearance-none bg-white/20 rounded-full cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(0,242,254,0.5)]"
            style={{
              background: `linear-gradient(to right, #00F2FE ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`,
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-neon transition-colors">
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5">
              <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                {isMuted || volume === 0 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 appearance-none bg-white/20 rounded-full cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Time */}
            <span className="text-white/60 text-xs tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors">
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function applyBoxBlur(imageData: ImageData, radius: number): ImageData {
  const { data, width, height } = imageData
  const output = new Uint8ClampedArray(data)
  const size = radius * 2 + 1

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const i = (ny * width + nx) * 4
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
            count++
          }
        }
      }
      const i = (y * width + x) * 4
      output[i] = r / count
      output[i + 1] = g / count
      output[i + 2] = b / count
    }
  }

  return new ImageData(output, width, height)
}
