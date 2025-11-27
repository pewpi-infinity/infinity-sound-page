import { useEffect, useRef } from 'react'

function App() {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const attemptPlay = async () => {
      try {
        await audio.play()
      } catch (error) {
        console.log('Autoplay prevented, waiting for user interaction')
        const handleInteraction = async () => {
          try {
            await audio.play()
            document.removeEventListener('click', handleInteraction)
            document.removeEventListener('keydown', handleInteraction)
          } catch (err) {
            console.error('Failed to play audio:', err)
          }
        }
        document.addEventListener('click', handleInteraction)
        document.addEventListener('keydown', handleInteraction)
      }
    }

    attemptPlay()
  }, [])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-card to-secondary">
      <audio
        ref={audioRef}
        src="https://archive.org/download/bob-seger-night-moves-1976-remastered-1999/02%20-%20Night%20Moves.mp3"
        loop
        autoPlay
        playsInline
        preload="auto"
      />
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
          🎶
        </h1>
        <p className="text-sm text-muted-foreground italic">
          Music playing in the background
        </p>
      </div>
    </div>
  )
}

export default App