import React from 'react'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import DateSelector from './DateSelector';
import ImageSelector from './ImageSelector';
import TagInput from './TagInput';
import axiosInstance from '../utils/axiosInstance';
import moment from 'moment';
import { toast } from 'react-toastify';
import uploadImage from '../utils/uploadImage';

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {
  const [visitedDate, setVisitedDate] = React.useState(storyInfo?.visitedDate || null);
  const [title, setTitle] = React.useState(storyInfo?.title || '');
  const [storyImg, setStoryImg] = React.useState(storyInfo?.imageUrl || null);
  const [story, setStory] = React.useState(storyInfo?.story ||'');
  const [visitedLocation, setVisitedLocation] = React.useState(storyInfo?.visitedLocation || []);
  const [error, setError] = React.useState('');

  const addNewTravelStory = async () => {
    try {
      let imageUrl = '';

      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);

        imageUrl = imgUploadRes.imageUrl || '';
      }

      const response = await axiosInstance.post('/travel-story/add', {
        title,
        story,
        imageUrl: imageUrl || '',
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf()
      })
      

      if (response.data && response.data.story) {
        
        toast.success('Travel story added successfully');

        getAllTravelStories();

        onClose();
      }
    } catch (error) {
      console.log('Error uploading travel story');      
    }
  }

  const updateTravelStory = async () => {
    const storyId = storyInfo._id;

    try {
      let imageUrl = '';

      let postData = {
        title,
        story,
        imageUrl: storyInfo.imageUrl || '',
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf()
      }

      if (typeof storyImg === 'object') {
        const imageUploadRes = await uploadImage(storyImg);
        imageUrl = imageUploadRes.imageUrl || '';
        postData = { ...postData, imageUrl: imageUrl }
      }

      const response = await axiosInstance.post(`/travel-story/edit-story/${storyId}`, postData)

      if (response.data && response.data.story) {
        toast.success('Travel story updated successfully');

        getAllTravelStories();

        onClose();
      }
    
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Error updating travel story');
      }
    }
  }

  const handleAddOrUpdateClick = () => {
    if (!title) {
      setError('Title is required');
      return;
    }
    if (!story) {
      setError('Story is required');
      return;
    }
    setError('');

    if (type === 'edit') {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  }

  const handleDeleteStoryImage = async () => {
    const deleteImageResponse = await axiosInstance.delete('/travel-story/image-delete', {
      params: {
        imageUrl: storyInfo.imageUrl
      }
    })

    if (deleteImageResponse.data) {
      const storyId = storyInfo._id;

      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: ''
      }

      const response = await axiosInstance.post(`/travel-story/edit-story/${storyId}`, postData)

      if (response.data) {
        toast.success('Story image deleted successfully');
        
        setStoryImg(null);

        getAllTravelStories();
      }
      
    }
  }
  
  return (
    <div className='relative'>
      <div className='flex items-center justify-between'>
        <h5 className='text-xl font-medium text-slate-700'>
          {type === 'add' ? 'Add Travel Story' : 'Edit Travel Story'}
        </h5>

        <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
        

        {type === 'add' ? (
          <button className='btn-small' onClick={handleAddOrUpdateClick}>
          <IoMdAdd className='text-lg' /> ADD STORY
        </button>
        ) : (
          <>
          <button className='btn-small' onClick={handleAddOrUpdateClick}>
            <MdOutlineModeEditOutline className='text-lg' /> UPDATE STORY
          </button>

          <button className='btn-small btn-delete'>
            <MdOutlineDelete className='text-lg' /> DELETE STORY
          </button>
          </>
        )}

        <button className='' onClick={onClose}>
          <IoMdClose className='text-xl text-slate-500 hover:bg-rose-500 hover:text-white' />
        </button>
        </div>

        {error && (
          <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
        )}
      </div>
      <div>
        <div className='flex flex-1 flex-col gap-2 pt-4'>
          <label className="input-label">title</label>
          <input type="text" className='text-2xl text-slate-900 outline-none' placeholder='Once Upon A Time....' value={title} onChange={(e) => setTitle(e.target.value)}/>
        
          <div className='my-3'>
          <DateSelector date={visitedDate} setDate={setVisitedDate} />

          <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImage={handleDeleteStoryImage} />

          <div className='flex flex-col gap-2 mt-4'>
            <label className="input-label">STORY</label>
            <textarea type='text' className='text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded-sm' placeholder='Your Story' rows={10} value={story} onChange={(e) => setStory(e.target.value)} />
          </div>

          <div className="pt-3">
            <label className="input-label">VISITED LOCATIONS</label>

            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEditTravelStory
