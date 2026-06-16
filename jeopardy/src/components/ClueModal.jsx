import { useState } from 'react'

export default function ClueModal({ clue, teams, onClose }) {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const handleCorrect = () => {
    if (selectedTeam === null) return
    onClose('correct', selectedTeam)
  }

  const handleWrong = () => {
    if (selectedTeam === null) return
    onClose('wrong', selectedTeam)
  }

  const handleSkip = () => {
    onClose('skip', null)
  }

  const toggleTeam = (i) => {
    setSelectedTeam(prev => (prev === i ? null : i))
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-meta">
          <span className="modal-category">{clue.category}</span>
          <span className="modal-value">${clue.value.toLocaleString()}</span>
        </div>

        <div className="modal-question">{clue.question}</div>

        {showAnswer && (
          <div className="modal-answer">
            <span className="answer-label">Answer:</span> {clue.answer}
          </div>
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
            onClick={handleCorrect}
            disabled={selectedTeam === null}
            title={selectedTeam === null ? 'Select a team first' : ''}
          >
            ✓ Correct (+${clue.value.toLocaleString()})
          </button>
          <button
            className="action-btn wrong-btn"
            onClick={handleWrong}
            disabled={selectedTeam === null}
            title={selectedTeam === null ? 'Select a team to deduct from' : ''}
          >
            ✗ Wrong (−${clue.value.toLocaleString()})
          </button>
          <button className="action-btn skip-btn" onClick={handleSkip}>
            Skip / Close
          </button>
        </div>
      </div>
    </div>
  )
}
