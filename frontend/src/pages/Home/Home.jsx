import React from 'react'
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosinstance'
import TravelStoryCard from '../../components/TravelStoryCard'

const Home = () => {
  const [allStories, setAllStories] = React.useState([])

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

  const handleEdit = async (data) => {}

  const handleViewStory = async (data) => {}

  const updateIsFavorite = async (data) => {}

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
    </>
  )

}

export default Home

