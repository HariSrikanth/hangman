'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "~/components/ui/alert-dialog";

function GameplayContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const theme = searchParams.get("theme") ?? "General";

    const wordLists: Record<string, string[]> = {
        General: [
            "elephant", "umbrella", "butterfly", "chocolate", "rainbow", 
            "mountain", "whisper", "octopus", "galaxy", "lighthouse", 
            "adventure", "pineapple", "tornado", "compass", "volcano", 
            "penguin", "waterfall", "dinosaur", "telescope", "carnival"
        ],
        Crypto: [
            "bitcoin", "ethereum", "blockchain", "mining", "wallet",
            "ledger", "defi", "nft", "token", "altcoin",
            "staking", "solana", "polygon", "metamask", "consensus",
            "cardano", "ripple", "avalanche", "chainlink", "smart contract",
            "decentralized", "cryptocurrency", "hash rate", "node", "protocol",
            "validator", "yield farming", "liquidity", "governance", "airdrop"
        ],
        "B@Bies": [
            "neel", "pratyay", "shivam", "kushagra", "roger",
            "hari", "shaan", "akshat", "tvisha", "aaron",
            "satwik", "subham", "he", "anushka", "alexis",
            "karaan"
        ],
        Art: [
            "watercolor", "sculpture", "charcoal", "pottery", "printmaking",
            "photography", "illustration", "calligraphy", "collage", "mosaic",
            "lithography", "etching", "weaving", "metalwork", "glassblowing",
            "woodcarving", "origami", "sketching", "engraving", "ceramics"
        ],
        Sports: [
            "messi", "ronaldo", "federer", "lebron", "barcelona",
            "lakers", "manchester", "wimbledon", "volleyball", "cricket",
            "basketball", "touchdown", "homerun", "penalty", "olympics",
            "marathon", "gymnastics", "surfing", "arsenal", "juventus"
        ]
    };
    
    // Initialize word once when component mounts
    const [selectedWord] = useState(() => {
        const lists = wordLists as Record<string, readonly string[]>;
        const currentTheme = (theme in lists) ? theme : "General";
        const wordList = lists[currentTheme] as string[];
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex]?.toLowerCase() ?? "default";
    });

    const [correctLetters, setCorrectLetters] = useState<string[]>([]);
    const [wrongLetters, setWrongLetters] = useState<string[]>([]);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [inputValue, setInputValue] = useState("");

    const checkGameStatus = useCallback(() => {
        if (wrongLetters.length >= 6) {
            setGameStatus('lost');
        } else if (selectedWord.split('').every(letter => correctLetters.includes(letter))) {
            setGameStatus('won');
        }
    }, [wrongLetters.length, correctLetters, selectedWord]);

    useEffect(() => {
        checkGameStatus();
    }, [correctLetters, wrongLetters, checkGameStatus]);

    const handleGuess = () => {
        const guess = inputValue.trim().toLowerCase();
        if (guess.length !== 1 || !/^[a-z]$/.test(guess)) {
            alert("Please enter a single valid letter.");
            return;
        }
        if (correctLetters.includes(guess) || wrongLetters.includes(guess)) {
            alert("You've already guessed that letter!");
            return;
        }
        if (selectedWord.includes(guess)) {
            setCorrectLetters([...correctLetters, guess]);
        } else {
            setWrongLetters([...wrongLetters, guess]);
        }
        setInputValue("");
    };

    const restartGame = () => {
        router.push("/");
    };

    return(
        <main className="flex min-h-screen flex-col items-center justify-center bg-black text-green-300">
            <div className="p-6">
                <h1 className="text-4xl font-bold">Gameplay Screen</h1>
                <p className="text-xl mt-4 text-center">Theme: {theme}</p>
            </div>
            
            <Word 
                selectedWord={selectedWord} 
                correctLetters={correctLetters} 
                gameStatus={gameStatus} 
            />
            <Figure wrongLetters={wrongLetters}/>
            {wrongLetters.length > 0 && (
                <div className="mt-4 text-xl">
                    Wrong letters: {wrongLetters.join(", ")}
                </div>
            )}
            {gameStatus === 'playing' && (
                <div className="flex w-full max-w-sm items-center justify-center space-x-2 mt-4">
                    <Input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        placeholder="Enter a Letter Here" 
                        className='w-48' 
                    />
                    <Button 
                        type="button" 
                        onClick={handleGuess}
                        className="bg-green-300 border-black text-black transition transform delay-50 duration-300 ease-in ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-white" 
                    >Guess</Button>
                </div>
            )}
            
            {(gameStatus === 'won' || gameStatus === 'lost') && (
                <AlertDialog open={true}>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <AlertDialogContent className={`bg-black border ${gameStatus === 'won' ? 'border-green-300' : 'border-red-500'} text-white w-96 p-6 rounded-lg`}>
                            <AlertDialogHeader className="flex flex-col items-center text-center">
                                <AlertDialogTitle className="text-2xl">{gameStatus === 'won' ? 'Congratulations!' : 'Game Over!'}</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogDescription className="text-center text-lg">
                                {gameStatus === 'won' 
                                    ? `You correctly guessed the word: ${selectedWord}` 
                                    : `The correct word was: ${selectedWord}`}
                            </AlertDialogDescription>
                            <div className="w-full flex justify-center items-center">
                                <Button 
                                    onClick={restartGame} 
                                    className={`w-full border-black justify-center text-black transition transform delay-50 duration-300 ease-in ease-out hover:-translate-y-1 hover:scale-110 ${gameStatus === 'won' ? 'bg-green-300 hover:bg-white' : 'bg-red-500 hover:bg-white'}`}
                                >
                                    Restart
                                </Button>
                            </div>
                        </AlertDialogContent>
                    </div>
                </AlertDialog>
            )}
        </main>
    );
}

const Figure = ({ wrongLetters }: { wrongLetters: string[] }) => {
    const errors = wrongLetters.length;
    return (
        <Card className="rounded-lg overflow-hidden border-black">
            <CardContent className="p-6 bg-green-300">
                <svg height="250" width="200" className="figure-container">
                    <line x1="60" y1="20" x2="140" y2="20" stroke="black" strokeWidth="3"/>
                    <line x1="140" y1="20" x2="140" y2="50" stroke="black" strokeWidth="3"/>
                    <line x1="60" y1="20" x2="60" y2="230" stroke="black" strokeWidth="3"/>
                    <line x1="20" y1="230" x2="100" y2="230" stroke="black" strokeWidth="3"/>
                    
                    {errors > 0 && <circle cx="140" cy="70" r="20" stroke="black" strokeWidth="3" fill="none"/>}
                    
                    {errors > 1 && <line x1="140" y1="90" x2="140" y2="150" stroke="black" strokeWidth="3"/>}
                    
                    {errors > 2 && <line x1="140" y1="120" x2="120" y2="100" stroke="black" strokeWidth="3"/>}
                    {errors > 3 && <line x1="140" y1="120" x2="160" y2="100" stroke="black" strokeWidth="3"/>}
                    
                    {errors > 4 && <line x1="140" y1="150" x2="120" y2="180" stroke="black" strokeWidth="3"/>}
                    {errors > 5 && <line x1="140" y1="150" x2="160" y2="180" stroke="black" strokeWidth="3"/>}
                </svg>
            </CardContent>
        </Card>
    );
}

const Word = ({ selectedWord, correctLetters, gameStatus }: { selectedWord: string; correctLetters: string[]; gameStatus: string }) => {
    return (
        <div className="word flex gap-2 text-3xl p-6 ">
            {selectedWord.split('').map((letter, i) => (
                <span 
                    className={`letter border-b-2 px-2 ${gameStatus === 'lost' ? 'text-red-500' : 'border-green-300'}`}
                    key={i}
                >
                    {gameStatus === 'lost' || correctLetters.includes(letter) ? letter : " "}
                </span>
            ))}
        </div>
    );
};

export default function Gameplay() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black text-green-300">Loading...</div>}>
            <GameplayContent />
        </Suspense>
    );
}