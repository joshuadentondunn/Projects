import { useState, useCallback, useEffect } from 'react'
import Board from './components/Board'
import ClueModal from './components/ClueModal'
import ScoreBoard from './components/ScoreBoard'
import { CATEGORIES as LEAH_CATEGORIES } from './data/leah-game'
import { CATEGORIES as DAD_CATEGORIES } from './data/dad-game'
import './App.css'

const GAMES = [
  {
    id: 'leah',
    label: "Leah's Game",
    categories: LEAH_CATEGORIES,
    theme: {
      '--bg-body':        '#3d0025',
      '--bg-surface':     '#6b0040',
      '--bg-surface-hover': '#8a0052',
      '--bg-surface-used':  '#2a0018',
      '--bg-modal':       '#6b0040',
      '--color-border':   '#2a0018',
      '--color-accent':   '#ffb7d5',
      '--color-accent-dim': '#d4728a',
    },
  },
  {
    id: 'dad',
    label: "Dad's Game",
    categories: DAD_CATEGORIES,
    theme: {
      '--bg-body':        '#3d0000',
      '--bg-surface':     '#6b0000',
      '--bg-surface-hover': '#8a0000',
      '--bg-surface-used':  '#2a0000',
      '--bg-modal':       '#6b0000',
      '--color-border':   '#2a0000',
      '--color-accent':   '#ffd700',
      '--color-accent-dim': '#b8960c',
    },
  },
]

const DEFAULT_TEAMS = [
  { name: 'Team 1', score: 0 },
  { name: 'Team 2', score: 0 },
]

function applyTheme(theme) {
  const root = document.documentElement
  Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v))
}

export default function App() {
  const [activeGame, setActiveGame] = useState(GAMES[0])
  const [teams, setTeams] = useState(DEFAULT_TEAMS)
  const [usedClues, setUsedClues] = useState(new Set())
  const [activeClue, setActiveClue] = useState(null)

  useEffect(() => {
    applyTheme(activeGame.theme)
  }, [activeGame])

  // Apply initial theme on mount
  useEffect(() => {
    applyTheme(GAMES[0].theme)
  }, [])

  const switchGame = useCallback((game) => {
    if (!window.confirm(`Switch to "${game.label}"? This will reset the board and all scores.`)) return
    setActiveGame(game)
    setTeams(DEFAULT_TEAMS.map(t => ({ ...t })))
    setUsedClues(new Set())
    setActiveClue(null)
  }, [])

  const openClue = useCallback((categoryIndex, clueIndex) => {
    const category = activeGame.categories[categoryIndex]
    const clue = category.clues[clueIndex]
    setActiveClue({ categoryIndex, clueIndex, category: category.name, ...clue })
  }, [activeGame])

  const closeClue = useCallback(
    (outcome, teamIndex) => {
      if (!activeClue) return
      const key = `${activeClue.categoryIndex}-${activeClue.clueIndex}`
      setUsedClues(prev => new Set([...prev, key]))

      if (outcome === 'correct' && teamIndex !== null) {
        setTeams(prev =>
          prev.map((t, i) =>
            i === teamIndex ? { ...t, score: t.score + activeClue.value } : t
          )
        )
      } else if (outcome === 'wrong' && teamIndex !== null) {
        setTeams(prev =>
          prev.map((t, i) =>
            i === teamIndex ? { ...t, score: t.score - activeClue.value } : t
          )
        )
      }

      setActiveClue(null)
    },
    [activeClue]
  )

  const updateTeamName = useCallback((index, name) => {
    setTeams(prev => prev.map((t, i) => (i === index ? { ...t, name } : t)))
  }, [])

  const addTeam = useCallback(() => {
    setTeams(prev => [...prev, { name: `Team ${prev.length + 1}`, score: 0 }])
  }, [])

  const removeTeam = useCallback((index) => {
    setTeams(prev => prev.filter((_, i) => i !== index))
  }, [])

  const adjustScore = useCallback((teamIndex, delta) => {
    setTeams(prev =>
      prev.map((t, i) => (i === teamIndex ? { ...t, score: t.score + delta } : t))
    )
  }, [])

  const resetGame = useCallback(() => {
    if (!window.confirm('Start a new game? This will reset all scores and the board.')) return
    setTeams(DEFAULT_TEAMS.map(t => ({ ...t })))
    setUsedClues(new Set())
    setActiveClue(null)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">JEOPARDY!</h1>
        <div className="header-controls">
          <div className="game-picker">
            {GAMES.map(game => (
              <button
                key={game.id}
                className={`game-btn ${activeGame.id === game.id ? 'active' : ''}`}
                onClick={() => activeGame.id !== game.id && switchGame(game)}
              >
                {game.label}
              </button>
            ))}
          </div>
          <button className="reset-btn" onClick={resetGame}>
            New Game
          </button>
        </div>
      </header>

      <ScoreBoard
        teams={teams}
        onUpdateName={updateTeamName}
        onAddTeam={addTeam}
        onRemoveTeam={removeTeam}
        onAdjustScore={adjustScore}
      />

      <Board
        categories={activeGame.categories}
        usedClues={usedClues}
        onSelectClue={openClue}
      />

      {activeClue && (
        <ClueModal clue={activeClue} teams={teams} onClose={closeClue} />
      )}
    </div>
  )
}
