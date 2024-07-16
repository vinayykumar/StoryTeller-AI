import Link from "next/link";
import {FilePen,BookOpen,SunMoon} from 'lucide-react'
import {LampDemo,LampContainer} from './ui/lamp'

function Header() {
  return (
    <header className="relative p-12 text-center">
        <Link href='/' >
            <h1 className="text-6xl font-black text-center ml-8">StoryTeller AI</h1>
            <div className="flex space-x-5 text-1xl lg:text-4xl justify-center whitespace-nowrap mr-14">
                <h2>Bringing your stories</h2>
                <div className="relative">
                    <div className="absolute bg-purple-500 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1 w-16 lg:w-36 md:w-20 ">
                      <p className="relative text-white">To life!</p>
                    </div>
                </div>
            </div>
        </Link>
        <div className="absolute -top-5 right-5 flex space-x-2">
          <Link href='/'>
           <FilePen className="w-8 h-8 lg:w-10 lg:h-10 mx-auto text-purple-500 mt-10 border border-purple-500 p-2 rounded-md hover:opacity-50 cursor-pointer" />
          </Link>
          <Link href='/stories'>
           <BookOpen className="w-8 h-8 lg:w-10 lg:h-10 mx-auto text-purple-500 mt-10 border border-purple-500 p-2 rounded-md hover:opacity-50 cursor-pointer" />
          </Link>
          <Link href='/stories'>
           <SunMoon className="w-8 h-8 lg:w-10 lg:h-10 mx-auto text-purple-500 mt-10 border border-purple-500 p-2 rounded-md hover:opacity-50 cursor-pointer" />
          </Link>
        </div>
    </header>
  )
}

export default Header;
