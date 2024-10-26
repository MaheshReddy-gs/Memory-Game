import { useEffect, useState } from "react";

const MemoryGame = () => {
    // Game Boeard
    // Result
    // Play again game / Reset game

    //states to manege the game
    const [ gridSize, setGridSize ] = useState(4);
    const [ cards, setCards ] = useState([]);
    const [ flipped, setFlipped ] = useState([]);
    const [ solved, setSolved ] = useState([]);
    const [ disable, setDisable ] = useState(false);
    const [ won, setWon ] = useState(false);

    //handle grid size logic
    const handleGridSizeChange = (e) => {
        const size = e.target.value;
        if (size >= 2 && size <= 10) setGridSize(size);
    };

    // function for display the cards
    const initilizeCards = () => {
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
    };

    useEffect(() => {
        initilizeCards();
    }, [ gridSize ]);

    const checkMatch = (secondId) => {
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
    };
    // card match logic
    const handleCardClick = (id) => {
        if (disable || won) return;
        if (flipped.length === 0) {
            setFlipped([ id ]);
            return;
        }
        if (flipped.length === 1) {
            setDisable(true);
            if (id !== flipped[ 0 ]) {
                setFlipped([ ...flipped, id ]);
                // check match logic
                checkMatch(id);
            } else {
                setFlipped([]);
                setDisable(false);
            }
        }
    };

    // check if the card is flipped
    const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
    const isSolved = (id) => solved.includes(id);

    // show won logic
    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWon(true);
        }
    }, [ solved, cards ]);

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen p-4">
            <h1 className="font-bold text-3xl mb-6">Memory Game</h1>
            {/* {input} */}
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
                    className="border-2 border-gray-300 rounded py-1 px-2"
                />
            </div>
            {/* {cardBoard} */}
            <div
                className={`grid mb-4 gap-2`}
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
                    width: `min(100%, ${gridSize * 5.5}rem)`,
                }}
            >
                {cards.map((card) => {
                    return (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${isFlipped(card.id)
                                ? isSolved(card.id)
                                    ? "bg-green-400 text-white"
                                    : "bg-blue-400 text-white"
                                : "bg-gray-300 text-gray-400"
                                }`}
                        >
                            {isFlipped(card.id) ? card.number : "?"}
                        </div>
                    );
                })}
            </div>
            {/* Result */}
            {won && (
                <div className="text-4xl mt-4 font-bold text-green-600 animate-bounce">
                    You Won!
                </div>
            )}

            {/* Reset / Play Again Button */}
            <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                onClick={initilizeCards}
            >
                {won ? "Play Again" : "Reset"}
            </button>
        </div>
    );
};

export default MemoryGame;