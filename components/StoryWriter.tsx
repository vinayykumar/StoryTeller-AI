'use client';

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { SelectItemText } from "@radix-ui/react-select"

  
function StoryWriter() {

  const [story,setStory] = useState<string>("");
  const [pages,setPages] = useState<number>(1);
  const [progress,setProgress] = useState<string>("");
  const [runStarted,setRunStarted] = useState<boolean>(false);
  const [runFinished,setRunFinished] = useState<boolean | null>(null);
  const [currentTool,setCurrentTool] = useState<string>("");

  async function runScript() {
      setRunStarted(true);
      setRunFinished(false);

      const res = await fetch('/api/run-script',{
        method : 'POST',
        headers : {
          'Content Type' : 'application/json',
        },
        body : JSON.stringify({story,pages})
      })
  }

  return (
    <div className="flex flex-col container p-0">

      <section className="flex-1 flex flex-col border border-purple-200 rounded-md p-10 space-y-2">
        <Textarea 
          value={story}
          onChange={(e)=>setStory(e.target.value)}
          placeholder="Write a story about a developer who saved the world..." 
          className="text-black"
        />
        <Select onValueChange={value=>setPages(parseInt(value))}>
          <SelectTrigger>
                <SelectValue placeholder="How many pages should the story be?"/>
          </SelectTrigger>
          <SelectContent>
            {Array.from({length:10},(_,i)=>(
              <SelectItem key={i} value={String(i+1)}>{i+1}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          disabled={!story || !pages || runStarted} 
          className="w-full" 
          size='lg'
          onClick={runScript}
          >Generate Story</Button>
      </section>

      <section className="flex-1 mt-5">
        <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-scroll">
          <div>
            {runFinished === null && (
              <>
                <p className="animate-pulse mr-5">I am waiting for you to Generate a story above...</p>
              </>
            )}
            <span className="mr-5">{">>"}</span>
            {progress}
          </div>

          {/* Current Tool */}
          {currentTool && (
            <div className="py-10">
              <span className="mr-5">
                {"(---- Current Tool ----)"}
              </span>
            </div>
          )}

          {/* Rendering the Events */}
          {runStarted && (
            <div>
              <span className="mr-5 animate-in">
                {"--- (StoryTeller AI Has Started) ---"}
              </span>
            </div>
          )}

        </div>
      </section>

    </div>  
  )
}

export default StoryWriter
