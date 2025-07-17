import React from 'react'
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance'
import TravelStoryCard from '../../components/TravelStoryCard'
import { ToastContainer, toast } from 'react-toastify'
import { IoMdAdd } from 'react-icons/io'
import Modal from 'react-modal'
import AddEditTravelStory from '../../components/AddEditTravelStory'
import ViewTravelStory from './viewTravelStory'


const Home = () => {
  const [allStories, setAllStories] = React.useState([])

  const [openAddEditModal, setOpenAddEditModal] = React.useState({
    isShown: false,
    data: null,
    type: 'add'
  })

  const [openViewModal, setOpenViewModal] = React.useState({
    isShown: false,
    data: null
  })

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get('/travel-story/get-all')

      if (response.data && response.data.stories) {
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log('Error fetching travel stories')
    }
  }

  const handleEdit = async (data) => {
    setOpenAddEditModal({ isShown: true, data, type: 'edit' })
    
  }

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data })
  }

  const updateIsFavorite = async (storyData) => {
    const storyId = storyData._id

    try {
      const response = await axiosInstance.put(
        `/travel-story/update-favorite/${storyId}`,
        {
          isFavorite: !storyData.isFavorite
        }
      )

      if (response.data && response.data.story) {
        toast.success("Story updated successfully!")
        getAllTravelStories()
      }

    } catch (error) {
      console.log('Error updating favorite status')
    }
  }

  const deleteTravelStory = async (data) => {
    const storyId = data._id

    try {
      const response = await axiosInstance.delete(`/travel-story/delete-story/${storyId}`)

      if (response.data && !response.data.error) {
        toast.success("Story deleted successfully!")

        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))

        getAllTravelStories()
      }
    } catch (error) {
      console.log('Error deleting travel story')
    }
  }

  React.useEffect(() => {
    getAllTravelStories()
    return () => {}
  }, [])
  return (
    <>
    <Navbar />

    <div className='container mx-auto py-10'>
      <div className='flex gap-7'>
        <div className='flex-1'>
          {allStories.length > 0 ? (
            <div className='grid grid-cols-2 gap-4'>
              {allStories.map((item) => {
                return (
                  <TravelStoryCard
                    key={item._id} 
                    imageUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitDate}
                    visitedLocation={item.visitedLocation}
                    isFavorite={item.isFavorite}
                    onEdit={() => handleEdit(item)}
                    onClick={() => handleViewStory(item)}
                    onFavoriteClick={() => updateIsFavorite(item)}
                  />
                )
              })}
            </div>
          ) : (
            <div>Empty Card Here</div>
          )}
        </div>
            
        <div className='w-[320px]'></div>
      </div>
    </div>

    <Modal
      isOpen={openAddEditModal.isShown}
      onRequestClose={() => {}}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 999,
        },
      }}
      appElement={document.getElementById('root')}
      className='w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50'
    >
      <AddEditTravelStory storyInfo={openAddEditModal.data} type={openAddEditModal.type} onClose={() => {
        setOpenAddEditModal({ isShown: false, data: null, type: 'add' })
      }} getAllTravelStories={getAllTravelStories}/>
    </Modal>

    <Modal 
      isOpen={openViewModal.isShown}
      onRequestClose={() => {}} 
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 999,
        },
      }}
      appElement={document.getElementById('root')}
      className='w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50;'
    >
      <ViewTravelStory storyInfo={openViewModal.data || null} 
      onClose={() => {
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
      }} 
      onEditClick={() => {
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
        handleEdit(openViewModal.data || null)
      }} 
      onDeleteClick={() => {
        deleteTravelStory(openViewModal.data || null)
      }} />
    </Modal>

    <button className='w-16 h-16 flex items-center justify-center rounded-full bg-[#05b6d3] hover:bg-cyan-400 fixed right-10 bottom-10' onClick={() => {
      setOpenAddEditModal({ isShown: true, data: null, type: 'add'})
    }}>

      <IoMdAdd className='text-[32px] text-white'/>
    </button>

    <ToastContainer />
    </>
  )
}

export default Home

