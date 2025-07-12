import React from 'react'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { ImLocation } from 'react-icons/im'

const TagInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = React.useState([]);

    const addNewTag = () => {
        if (inputValue.trim() !== '') {
            setTags([...tags, inputValue.trim()]);
            setInputValue('');
        }
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            addNewTag();
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    }
  return (
    <div>
        {}
        {tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                    <span key={index} className='flex items-center gap-2 text-sm text-cyan-600 bg-cyan-200/40 px-3 py-1 rounded-sm'>
                        <ImLocation className='text-sm'/> {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        <button onClick={() => handleRemoveTag(tag)}>
                            <IoMdClose className='cursor-pointer'/>
                        </button>
                    </span>
                ))}
            </div>
        )}
      <div className="flex items-center gap-4 mt-3">
        <input type="text" value={inputValue} className='text-sm bg-transparent border border-slate-200 px-3 py-2 rounded-sm outline-none' placeholder='Add Locations' onChange={handleInputChange} onKeyDown={handleKeyDown}/>

        <button className='w-8 h-8 flex items-center justify-center rounded-sm border border-cyan-500 hover:bg-cyan-500' onClick={addNewTag}>
            <IoMdAdd className='text-2xl text-cyan-500 hover:text-white' />
        </button>
      </div>
    </div>
  )
}

export default TagInput
