import { useEffect, useState, useCallback } from "react";

const MemoryGame = () => {
    const [ gridSize, setGridSize ] = useState(4);
    const [ cards, setCards ] = useState([]);
    const [ flipped, setFlipped ] = useState([]);
    const [ solved, setSolved ] = useState([]);
    const [ disable, setDisable ] = useState(false);
    const [ won, setWon ] = useState(false);
    const [ clickCount, setClickCount ] = useState(0); // Add click count state

    const handleGridSizeChange = (e) => {
        const size = e.target.value;
        if (size >= 2 && size <= 10) setGridSize(size);
    };

    const initializeCards = useCallback(() => {
        const totalCards = gridSize * gridSize;
        const pairCounts = Math.floor(totalCards / 2);
        const numbers = [ ...Array(pairCounts).keys() ].map((n) => n + 1);
        const shuffledCards = [ ...numbers, ...numbers ]
            .sort(() => Math.random() - 0.5)
            .slice(0, totalCards)
            .map((number, index) => ({ id: index, number }));
        setCards(shuffledCards);
        setFlipped([]);
        setSolved([]);
        setWon(false);
        setClickCount(0); // Reset click count when starting a new game
    }, [ gridSize ]);

    useEffect(() => {
        initializeCards();
    }, [ gridSize, initializeCards ]);

    const checkMatch = useCallback(
        (secondId) => {
            const [ firstId ] = flipped;
            if (cards[ firstId ].number === cards[ secondId ].number) {
                setSolved([ ...solved, firstId, secondId ]);
                setFlipped([]);
                setDisable(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisable(false);
                }, 1000);
            }
        },
        [ cards, flipped, solved ]
    );

    const handleCardClick = useCallback(
        (id) => {
            if (disable || won) return;
            setClickCount(clickCount + 1); // Increment click count on each card click
            if (flipped.length === 0) {
                setFlipped([ id ]);
                return;
            }
            if (flipped.length === 1) {
                setDisable(true);
                if (id !== flipped[ 0 ]) {
                    setFlipped([ ...flipped, id ]);
                    checkMatch(id);
                } else {
                    setFlipped([]);
                    setDisable(false);
                }
            }
        },
        [ disable, won, flipped, checkMatch, clickCount ]
    );

    const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
    const isSolved = (id) => solved.includes(id);

    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWon(true);
        }
    }, [ solved, cards ]);

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen p-4">
            <h1 className="font-bold text-3xl mb-6">Memory Game</h1>
            <div className="mb-4">
                <label htmlFor="gridSize" className="mr-2">
                    Grid Size (max:10)
                </label>
                <input
                    type="number"
                    id="gridSize"
                    min="2"
                    max="10"
                    value={gridSize}
                    onChange={handleGridSizeChange}
                    disabled={won}
                    className="border-2 border-gray-300 rounded py-1 px-2"
                />
            </div>
            <div
                className={`grid mb-4 gap-2`}
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
                    width: `min(100%, ${gridSize * 5.5}rem)`,
                }}
            >
                {cards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        aria-label={`Card ${card.id}`}
                        className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-500 ease-in-out ${isFlipped(card.id)
                            ? isSolved(card.id)
                                ? "bg-green-400 text-white"
                                : "bg-blue-400 text-white"
                            : "bg-gray-300 text-gray-400"
                            }`}
                    >
                        {isFlipped(card.id) ? card.number : "?"}
                    </div>
                ))}
            </div>
            <div className="text-lg font-semibold">Clicks: {clickCount}</div>
            {won && (
                <div className="text-4xl mt-4 font-bold text-green-600 animate-bounce">
                    You Won in {clickCount} clicks!
                </div>
            )}
            <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                onClick={initializeCards}
            >
                {won ? "Play Again" : "Reset"}
            </button>
        </div>
    );
};

export default MemoryGame;
