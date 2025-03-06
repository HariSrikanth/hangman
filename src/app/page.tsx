'use client'

import * as React from "react"

import { Card, CardContent } from "~/components/ui/card"
import { TypewriterEffect } from "~/components/ui/typewriter-effect";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import { Boxes } from "~/components/ui/background-boxes";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"

import { useRouter } from "next/navigation";

export default function Home() {
  const [selectedTheme, setSelectedTheme] = React.useState<string>("General");
  const [showTypewriter, setShowTypewriter] = React.useState(false);
  const [fadeOut, setFadeOut] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);

  React.useEffect(() => {
    // Check if the animation has been shown before
    const hasShownAnimation = localStorage.getItem('hasShownTypewriter');
    
    if (!hasShownAnimation) {
      setShowTypewriter(true);
      const typewriterDuration = 2500; 
      const fadeDuration = 1000; 

      setTimeout(() => {
        setFadeOut(true); 
        setTimeout(() => {
          setShowTypewriter(false); 
          setShowContent(true);
          localStorage.setItem('hasShownTypewriter', 'true');
        }, fadeDuration);
      }, typewriterDuration);
    } else {
      setShowContent(true);
    }
  }, []);

  const words = [
    { text: "Let's", className: "text-white" },
    { text: "play", className: "text-white" },
    { text: "a", className: "text-white" },
    { text: "game.", className: "text-green-300 dark:text-green-500" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#000000]">
      {showTypewriter && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          transition={{ duration: 1 }}
          key="typewriter"
        >
          <TypewriterEffect words={words} />
        </motion.div>
      )}

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="flex flex-col items-center text-center justify-center"
        >
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl text-green-300">Hangman</h1>
          <h4 className="text-green-300 text-2xl">Pick a theme:</h4>

          <CarouselAPIFunc setSelectedTheme={setSelectedTheme}/>
          <StartGameAlert selectedTheme={selectedTheme}/>
        </motion.div>
      )}
    </main>
  );
}

function CarouselAPIFunc({ setSelectedTheme }: { setSelectedTheme: (theme: string) => void }) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [currentThemeIndex, setCurrentThemeIndex] = React.useState(0);
  const themes: string[] = ["General", "Crypto", "B@Bies", "Art", "Sports"];

  React.useEffect(() => {
    if (!api) return;

    setCurrentThemeIndex(api.selectedScrollSnap());
    setSelectedTheme(themes[api.selectedScrollSnap()] ?? "General"); 

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      setCurrentThemeIndex(newIndex);
      setSelectedTheme(themes[newIndex] ?? "General"); 
    });
  }, [api, setSelectedTheme]);

  return (
    <div className="mx-auto max-w-xs p-6">
      <Carousel setApi={setApi} className="w-48 max-w-xs">
        <CarouselContent>
          {themes.map((theme, index) => (
            <CarouselItem key={index}>
              <Card className="rounded-lg overflow-hidden border-black w-48 ">
                <CardContent className="flex aspect-3/2 items-center justify-center p-6 bg-green-300 border-black transition transform delay-50 duration-300 ease-in ease-out hover:scale-110 hover:bg-white">
                  <span className="text-2xl font-semibold">{themes[index]}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-green-300 border-black transition transform delay-50 duration-300 ease-in ease-out hover:scale-110 hover:bg-white"/>
        <CarouselNext className="bg-green-300 border-black transition transform delay-50 duration-300 ease-in ease-out hover:scale-110 hover:bg-white"/>
      </Carousel>
      <div className="py-2 text-center text-sm text-green-300">
        Theme {currentThemeIndex + 1} of {themes.length}
      </div>
    </div>
  )
}

function StartGameAlert({ selectedTheme }: { selectedTheme: string }) {
  const router = useRouter();

  const handleContinue = () => {
    router.push(`/gameplay?theme=${selectedTheme}`)
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="bg-green-300 border-black transition transform delay-50 duration-300 ease-in ease-out hover:-translate-y-1 hover:scale-110 hover:bg-white">Start Game</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black border border-green-300/20 backdrop-blur-xl text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Ready to start?</AlertDialogTitle>
          <AlertDialogDescription>
            Each correct letter reveals part of the word, but every wrong guess brings the hangman closer to being hung. 
            You will have 6 wrong guesses before the stick figure is fully drawn and the game is over. 
            Try to guess the hidden word within your chosen theme: {selectedTheme}. 
            Can you solve it before it is too late? 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-4">
          <AlertDialogCancel className="transition transform delay-50 duration-300 bg-white text-black border-black ease-in ease-out hover:scale-110">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue} className="bg-green-300 text-black border-black transition transform delay-50 duration-300 ease-in ease-out hover:scale-110 hover:text-white">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}