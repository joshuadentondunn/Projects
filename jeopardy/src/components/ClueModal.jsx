import { useState } from 'react'

export default function ClueModal({ clue, teams, onClose }) {
  const isDD = !!clue.dailyDouble
  const [phase, setPhase] = useState(isDD ? 'wager' : 'clue')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [wager, setWager] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)

  const effectiveValue = isDD && wager ? parseInt(wager, 10) : clue.value

  const toggleTeam = (i) => setSelectedTeam(prev => (prev === i ? null : i))

  const handleRevealClue = () => {
    if (selectedTeam === null || !wager || parseInt(wager, 10) <= 0) return
    setPhase('clue')
  }

  if (phase === 'wager') {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-value">DAILY DOUBLE!</div>
          <div className="modal-question" style={{ fontSize: '1.1rem', fontStyle: 'normal', opacity: 0.7 }}>
            {clue.category}
          </div>

          <div className="team-selector">
            <p className="team-selector-label">Who's wagering?</p>
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

          <div className="wager-row">
            <label className="team-selector-label">Wager amount:</label>
            <input
              className="wager-input"
              type="number"
              min="1"
              placeholder="$"
              value={wager}
              onChange={e => setWager(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRevealClue()}
              autoFocus
            />
          </div>

          <div className="modal-actions">
            <button
              className="action-btn correct-btn"
              onClick={handleRevealClue}
              disabled={selectedTeam === null || !wager || parseInt(wager, 10) <= 0}
            >
              Reveal Clue →
            </button>
            <button className="action-btn skip-btn" onClick={() => onClose('skip', null)}>
              Skip
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        {isDD && <div className="dd-label">DAILY DOUBLE</div>}
        <div className="modal-value">
          {isDD ? `Wager: $${parseInt(wager).toLocaleString()}` : `$${clue.value.toLocaleString()}`}
        </div>

        <div className="modal-question">{clue.question}</div>

        {showAnswer && (
          <div className="modal-answer">{clue.answer}</div>
        )}

        <button className="reveal-btn" onClick={() => setShowAnswer(v => !v)}>
          {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
        </button>

        <div className="team-selector">
          <p className="team-selector-label">
            {isDD ? `${teams[selectedTeam]?.name} is wagering $${parseInt(wager).toLocaleString()}` : 'Select team that answered:'}
          </p>
          {!isDD && (
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
          )}
        </div>

        <div className="modal-actions">
          <button
            className="action-btn correct-btn"
            onClick={() => onClose('correct', selectedTeam)}
            disabled={selectedTeam === null}
          >
            ✓ Correct (+${effectiveValue.toLocaleString()})
          </button>
          <button
            className="action-btn wrong-btn"
            onClick={() => onClose('wrong', selectedTeam)}
            disabled={selectedTeam === null}
          >
            ✗ Wrong (−${effectiveValue.toLocaleString()})
          </button>
          <button className="action-btn skip-btn" onClick={() => onClose('skip', null)}>
            Skip / Close
          </button>
        </div>
      </div>
    </div>
  )
}
