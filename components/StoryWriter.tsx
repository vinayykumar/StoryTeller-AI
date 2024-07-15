'use-client'
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  
function StoryWriter() {
  return (
    <div className="flex flex-col container">
      <section className="flex-1 flex flex-col border border-purple-200 rounded-md p-10 space-y-2">
        <Textarea />
      </section>
    </div>
  )
}

export default StoryWriter
