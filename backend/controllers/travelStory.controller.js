import TravelStory from "../models/travelStory.model.js";
import errorHandler from "../utils/error.js";
export const addTravelStory = async (req, res, next) => {
    const { title, story, visitedLocation, isFavourite, imageUrl, visitedDate } = req.body;
    const userId = req.user.id;

    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return next(errorHandler(400, "All fields are required"));
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        });
        await travelStory.save();
        res.status(201).json({travelStory, message: "Travel story added successfully"});
    } catch (error) {
        next(error)
    }
}

export const getAllTravelStory = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const travelStories = await TravelStory.find({ userId }).sort({ isFavourite: -1,})
        res.status(200).json(travelStories);
    } catch (error) {
        next(error)
    }
} 