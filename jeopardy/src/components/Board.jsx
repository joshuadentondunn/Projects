export default function Board({ categories, usedClues, onSelectClue }) {
  const values = [200, 400, 600, 800, 1000]

  return (
    <div className="board">
      <div className="board-row board-header-row">
        {categories.map((cat, i) => (
          <div key={i} className="board-cell category-cell">
            {cat.name}
          </div>
        ))}
      </div>

      {values.map((value, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {categories.map((_, colIndex) => {
            const clueKey = `${colIndex}-${rowIndex}`
            const isUsed = usedClues.has(clueKey)

            return (
              <div
                key={colIndex}
                className={`board-cell clue-cell ${isUsed ? 'used' : 'available'}`}
                onClick={isUsed ? undefined : () => onSelectClue(colIndex, rowIndex)}
              >
                {!isUsed && (
                  <>
                    <span className="clue-value">${value.toLocaleString()}</span>
                    {categories[colIndex].clues[rowIndex].dailyDouble && (
                      <span className="dd-badge">DD</span>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
