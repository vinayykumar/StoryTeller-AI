'use client';

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { SelectItemText } from "@radix-ui/react-select"
import { Frame } from "@gptscript-ai/gptscript";
import renderEventMessage from "@/lib/renderEventMessage";
const storiesPath = "public/stories"
  
function StoryWriter() {

  const [story,setStory] = useState<string>("");
  const [pages,setPages] = useState<number>(1);
  const [progress,setProgress] = useState<string>("");
  const [runStarted,setRunStarted] = useState<boolean>(false);
  const [runFinished,setRunFinished] = useState<boolean | null>(null);
  const [currentTool,setCurrentTool] = useState<string>("");
  const [events,setEvents] = useState<Frame[]>([])

  async function runScript() {
      setRunStarted(true);
      setRunFinished(false);

      const res = await fetch('/api/run-script',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify({story,pages,path:storiesPath})
      });

      if(res.ok && res.body){
        console.log("Streaming Started")
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        handleStream(reader,decoder);
      }
      else{
        setRunFinished(true);
        setRunStarted(false);
        console.log("Failed to start streaming")
      }
  }

  async function handleStream(reader:ReadableStreamDefaultReader<Uint8Array>,decoder:TextDecoder) {
    while(true){
      const {done,value} = await reader.read();
      if(done) break;
      const chunk = decoder.decode(value,{stream:true});

      const eventData = chunk.split("\n\n").filter((line)=>line.startsWith("event: ")).map((line)=>line.replace(/^event: /,""));

      eventData.forEach(data => {
        try{
          const parsedData = JSON.parse(data);
          if(parsedData.type === "callProgress"){
            setProgress(
              parsedData.output[parsedData.output.length-1].content
            );
            setCurrentTool(parsedData.tool?.description || "");
          }
          else if(parsedData.type === "callStart"){
            setCurrentTool(parsedData.tool?.description || "");
          }
          else if(parsedData.type === "runFinish"){
            setRunFinished(true);
            setRunStarted(false);
          }
          else{
            setEvents((prevEvents) => [...prevEvents, parsedData]);
          }
        }
        catch(error){
          console.log("Failed to parse JSON",error)
        }
      })
    }
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

          <div className="space-y-5">
            {events.map((event,index)=>(
              <div key={index}>
                  <span className="mr-5">{">>"}</span>
                  {renderEventMessage(event)}
              </div>
            ))}
          </div>

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

export default StoryWriter;