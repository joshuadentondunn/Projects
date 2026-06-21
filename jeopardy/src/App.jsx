import { useState, useCallback, useEffect } from 'react'
import Board from './components/Board'
import ClueModal from './components/ClueModal'
import ScoreBoard from './components/ScoreBoard'
import { CATEGORIES as LEAH_CATEGORIES } from './data/leah-game'
import { CATEGORIES as DAD_CATEGORIES } from './data/dad-game'
import './App.css'

const GAMES = [
  { id: 'leah', label: "Leah's Game", banner: "Leah's 26th Birthday", categories: LEAH_CATEGORIES },
  { id: 'dad',  label: "Dad's Game",  banner: "John's Big 58",        categories: DAD_CATEGORIES  },
]

const DEFAULT_TEAMS = [
  { name: 'Team 1', score: 0 },
  { name: 'Team 2', score: 0 },
]

export default function App() {
  const [activeGame, setActiveGame] = useState(GAMES[0])
  const [teams, setTeams] = useState(DEFAULT_TEAMS)
  const [usedClues, setUsedClues] = useState(new Set())
  const [activeClue, setActiveClue] = useState(null)

  useEffect(() => {
    document.body.setAttribute('data-theme', activeGame.id)
  }, [activeGame])

  useEffect(() => {
    document.body.setAttribute('data-theme', GAMES[0].id)
  }, [])

  const switchGame = useCallback((game) => {
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

  const closeClue = useCallback((outcome, teamIndex) => {
    if (!activeClue) return
    const key = `${activeClue.categoryIndex}-${activeClue.clueIndex}`
    setUsedClues(prev => new Set([...prev, key]))
    if (outcome === 'correct' && teamIndex !== null) {
      setTeams(prev => prev.map((t, i) =>
        i === teamIndex ? { ...t, score: t.score + activeClue.value } : t
      ))
    } else if (outcome === 'wrong' && teamIndex !== null) {
      setTeams(prev => prev.map((t, i) =>
        i === teamIndex ? { ...t, score: t.score - activeClue.value } : t
      ))
    }
    setActiveClue(null)
  }, [activeClue])

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
    setTeams(prev => prev.map((t, i) =>
      i === teamIndex ? { ...t, score: t.score + delta } : t
    ))
  }, [])

  return (
    <div className="app" data-theme={activeGame.id}>
      <div className="top-bar">
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
      </div>

      <ScoreBoard
        teams={teams}
        onUpdateName={updateTeamName}
        onAddTeam={addTeam}
        onRemoveTeam={removeTeam}
        onAdjustScore={adjustScore}
      />

      <h1 className="game-banner">{activeGame.banner}</h1>

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
