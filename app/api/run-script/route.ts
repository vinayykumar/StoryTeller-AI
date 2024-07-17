import { NextRequest } from "next/server";
import { RunEventType, RunOpts } from "@gptscript-ai/gptscript";
import g from '@/lib/gptScriptInstance';

const script = "app/api/run-script/story-book.gpt";

export async function POST(request: NextRequest) {
  const { story, pages, path } = await request.json();
  
  const opts: RunOpts = {
    disableCache: true,
    input: `--story ${story} --pages ${pages} --path ${path}`,
  };
  
  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
    async start(controller) {
        try {
          const run = await g.run(script, opts);
          console.log('Run started:', run);

          run.on(RunEventType.Event, (data) => {
            console.log('Run event data:', data);
            controller.enqueue(encoder.encode(`event: ${JSON.stringify(data)}\n\n`));
          });

          await run.text();
          controller.close();
        } catch (error) {
          controller.error(error);
          console.error('Error during run:', error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response(JSON.stringify({ error: error || 'Internal server error' }), {
      status: 500,
    });
  }
}
