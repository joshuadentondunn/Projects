import { useState } from 'react'

function TeamCard({ team, index, onUpdateName, onRemove, onAdjustScore }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(team.name)

  const commit = () => {
    onUpdateName(index, draft.trim() || team.name)
    setEditing(false)
  }

  const isNegative = team.score < 0
  const displayScore = isNegative
    ? `-$${Math.abs(team.score).toLocaleString()}`
    : `$${team.score.toLocaleString()}`

  return (
    <div className="team-card">
      <button
        className="remove-team-btn"
        onClick={() => onRemove(index)}
        title="Remove team"
      >
        ×
      </button>

      {editing ? (
        <input
          className="team-name-input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') { setDraft(team.name); setEditing(false) }
          }}
          autoFocus
        />
      ) : (
        <div
          className="team-name"
          onClick={() => { setDraft(team.name); setEditing(true) }}
          title="Click to rename"
        >
          {team.name}
        </div>
      )}

      <div className="score-row">
        <button
          className="adj-btn"
          onClick={() => onAdjustScore(index, -200)}
          title="−$200"
        >
          −
        </button>
        <span className={`score ${isNegative ? 'negative' : ''}`}>{displayScore}</span>
        <button
          className="adj-btn"
          onClick={() => onAdjustScore(index, 200)}
          title="+$200"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function ScoreBoard({ teams, onUpdateName, onAddTeam, onRemoveTeam, onAdjustScore }) {
  return (
    <div className="scoreboard">
      {teams.map((team, i) => (
        <TeamCard
          key={i}
          team={team}
          index={i}
          onUpdateName={onUpdateName}
          onRemove={onRemoveTeam}
          onAdjustScore={onAdjustScore}
        />
      ))}
      {teams.length < 8 && (
        <button className="add-team-btn" onClick={onAddTeam}>
          + Add Team
        </button>
      )}
    </div>
  )
}
