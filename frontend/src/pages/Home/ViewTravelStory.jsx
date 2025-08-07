import React from 'react'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineDelete, MdOutlineModeEditOutline } from 'react-icons/md'
import moment from 'moment'
import { FaLocationDot } from 'react-icons/fa6'

const ViewTravelStory = ({ storyInfo, onClose, onEditClick, onDeleteClick}) => {
  return (
    <div className='relative'>
      <div className="flex items-center justify-end">
        <div>
            <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                <button className='btn-small' onClick={onEditClick}>
                    <MdOutlineModeEditOutline className='text-lg'/> UPDATE STORY
                </button>

                <button className='btn-small btn-delete' onClick={onDeleteClick}>
                    <MdOutlineDelete className='text-lg'/> DELETE STORY
                </button>

                <button className='cursor-pointer' onClick={onClose}>
                    <IoMdClose className='text-lg text-slate-800  hover:bg-rose-500 hover:text-white'/>
                </button>
            </div>
        </div>
      </div>

      <div>
        <div className="flex flex-1 flex-col gap-2 py-4">
            <h1 className='text-2xl text-slate-950'>
                {storyInfo && storyInfo.title ? storyInfo.title.charAt(0).toUpperCase() + storyInfo.title.slice(1) : ''}
            </h1>

            <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                    {storyInfo && moment(storyInfo.visitedDate).format('Do MMM YYYY')}       
                </span>

                <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded-sm px-2 py-">
                    <FaLocationDot className='text-sm'/>

                    {storyInfo && storyInfo.visitedLocation.map((item, index) => {
                        const capitalized = item.charAt(0).toUpperCase() + item.slice(1);
                        return storyInfo.visitedLocation.length === index + 1
                        ? `${capitalized}`
                        : `${capitalized},`;
                    })
                    }
                </div>
            </div>
        </div>

        <img src={storyInfo && storyInfo.imageUrl} alt="story image" className='w-full h-[300px] object-cover rounded-lg' />

        <div className="mt-4">
            <p className="text-sm text-slate-900 leading-6 text-justify whitespace-pre-line">
                {storyInfo.story}
            </p>
        </div>
      </div>
    </div>
  )
}

export default ViewTravelStory;
