import { Search } from "lucide-react";

const SearchBox = ({className})=>{
    return(
        <div className={`${className} w-full bg-white border-b border-gray-200 p-4 flex flex-row items-center gap-3 shadow-sm`}>
            <Search className="text-gray-600 flex-shrink-0" size={20}/>
            <input 
                type="text" 
                className="flex-1 bg-white text-black placeholder-gray-500 outline-none px-3 py-2 border border-gray-200 focus:border-red-400 focus:ring-1 focus:ring-red-300 transition-all" 
                placeholder="Search songs, artists, albums" 
            />
        </div>
    )
}

export default SearchBox;