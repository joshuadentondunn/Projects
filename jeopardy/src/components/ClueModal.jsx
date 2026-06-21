import { useState } from 'react'

export default function ClueModal({ clue, teams, onClose }) {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const toggleTeam = (i) => setSelectedTeam(prev => (prev === i ? null : i))

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-value">${clue.value.toLocaleString()}</div>

        <div className="modal-question">{clue.question}</div>

        {showAnswer && (
          <div className="modal-answer">{clue.answer}</div>
        )}

        <button className="reveal-btn" onClick={() => setShowAnswer(v => !v)}>
          {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
        </button>

        <div className="team-selector">
          <p className="team-selector-label">Select team that answered:</p>
          <div className="team-buttons">
            {teams.map((team, i) => (
              <button
                key={i}
                className={`team-btn ${selectedTeam === i ? 'selected' : ''}`}
                onClick={() => toggleTeam(i)}
              >
                {team.name}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="action-btn correct-btn"
            onClick={() => selectedTeam !== null && onClose('correct', selectedTeam)}
            disabled={selectedTeam === null}
          >
            ✓ Correct (+${clue.value.toLocaleString()})
          </button>
          <button
            className="action-btn wrong-btn"
            onClick={() => selectedTeam !== null && onClose('wrong', selectedTeam)}
            disabled={selectedTeam === null}
          >
            ✗ Wrong (−${clue.value.toLocaleString()})
          </button>
          <button className="action-btn skip-btn" onClick={() => onClose('skip', null)}>
            Skip / Close
          </button>
        </div>
      </div>
    </div>
  )
}
