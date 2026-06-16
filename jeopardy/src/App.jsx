import { useState, useCallback } from 'react'
import Board from './components/Board'
import ClueModal from './components/ClueModal'
import ScoreBoard from './components/ScoreBoard'
import { CATEGORIES } from './data/questions'
import './App.css'

const DEFAULT_TEAMS = [
  { name: 'Team 1', score: 0 },
  { name: 'Team 2', score: 0 },
  { name: 'Team 3', score: 0 },
]

export default function App() {
  const [teams, setTeams] = useState(DEFAULT_TEAMS)
  const [usedClues, setUsedClues] = useState(new Set())
  const [activeClue, setActiveClue] = useState(null)

  const openClue = useCallback((categoryIndex, clueIndex) => {
    const category = CATEGORIES[categoryIndex]
    const clue = category.clues[clueIndex]
    setActiveClue({ categoryIndex, clueIndex, category: category.name, ...clue })
  }, [])

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
        <button className="reset-btn" onClick={resetGame}>
          New Game
        </button>
      </header>

      <ScoreBoard
        teams={teams}
        onUpdateName={updateTeamName}
        onAddTeam={addTeam}
        onRemoveTeam={removeTeam}
        onAdjustScore={adjustScore}
      />

      <Board
        categories={CATEGORIES}
        usedClues={usedClues}
        onSelectClue={openClue}
      />

      {activeClue && (
        <ClueModal clue={activeClue} teams={teams} onClose={closeClue} />
      )}
    </div>
  )
}
