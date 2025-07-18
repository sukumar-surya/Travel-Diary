import React from 'react'
import { BsSearch } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'

const SearchBar = ({value,onChange,handleSearch,onClearSearch}) => {
  return (
    <div className='flex items-center w-80 px-4 bg-slate-100 rounded-md'>
      <input id="searchStories" type="text" placeholder='Search Stories...' className='w-full text-xs bg-transparent py-[11px] outline-none' value={value} onChange={onChange} />

      {value && (
        <IoMdClose className='text-slate-500 cursor-pointer hover:text-black text-xl mr-3' onClick={onClearSearch} />
      )}

      <BsSearch className='text-slate-600 cursor-pointer hover:text-black' onClick={handleSearch}/>
    </div>
  )
}

export default SearchBar
