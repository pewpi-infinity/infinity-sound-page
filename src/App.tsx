import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

function App() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(50)

  useEffect(() => {
    audioContextRef.current = new AudioContext()
    gainNodeRef.current = audioContextRef.current.createGain()
    gainNodeRef.current.connect(audioContextRef.current.destination)
    gainNodeRef.current.gain.value = volume / 100

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.value = volume / 100
    }
  }, [volume, isMuted])

  const togglePlayPause = async () => {
    if (!audioContextRef.current || !gainNodeRef.current) return

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }

    if (isPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
        oscillatorRef.current = null
      }
      setIsPlaying(false)
    } else {
      oscillatorRef.current = audioContextRef.current.createOscillator()
      oscillatorRef.current.type = 'sine'
      oscillatorRef.current.frequency.setValueAtTime(440, audioContextRef.current.currentTime)
      oscillatorRef.current.connect(gainNodeRef.current)
      oscillatorRef.current.start()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (gainNodeRef.current) {
      if (isMuted) {
        gainNodeRef.current.gain.value = volume / 100
      } else {
        gainNodeRef.current.gain.value = 0
      }
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-card to-secondary p-6">
      <div className="text-center space-y-8 max-w-2xl w-full">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
            Welcome to Infinity
          </h1>
          <p className="text-2xl text-muted-foreground">🎶</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 space-y-6 border border-border/50 shadow-2xl">
          <div className="space-y-2">
            <p className="text-xl font-semibold text-foreground">Now Playing</p>
            <p className="text-lg text-primary">Ambient Tone</p>
            <p className="text-sm text-muted-foreground">440 Hz Sine Wave</p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={togglePlayPause}
              className="w-16 h-16 rounded-full"
              variant="default"
            >
              {isPlaying ? <Pause size={28} weight="fill" /> : <Play size={28} weight="fill" />}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
              className="shrink-0"
            >
              {isMuted ? <SpeakerSlash size={24} /> : <SpeakerHigh size={24} />}
            </Button>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="flex-1"
              disabled={isMuted}
            />
            <span className="text-sm text-muted-foreground w-12 text-right">
              {isMuted ? '0' : volume}%
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground italic">
          Click play to start the continuous ambient sound
        </p>
      </div>
    </div>
  )
}

export default App