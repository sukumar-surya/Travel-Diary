import { fileURLToPath } from "url";
import TravelStory from "../models/travelStory.model.js";
import errorHandler from "../utils/error.js";
import path from "path";
import fs from "fs";


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
        res.status(201).json({ story: travelStory, message: "Travel story added successfully"});
    } catch (error) {
        next(error)
    }
}

export const getAllTravelStory = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const travelStories = await TravelStory.find({ userId }).sort({ isFavourite: -1,})
        res.status(200).json({ stories: travelStories });
    } catch (error) {
        next(error);
    }
} 

export const imageUpload = async (req, res, next) => {
    try {
       if (!req.file) {
            return next(errorHandler(400, "Please upload an image"));
        }

        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        res.status(201).json({ imageUrl });
    } catch (error) {
        next(error)
    }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, "..");

export const deleteImage = async (req, res, next) => {
    const { imageUrl } = req.query;

    if (!imageUrl) {
        return next(errorHandler(400, "Image URL is required"));
    }

    try {
        const filename = path.basename(imageUrl);

        const filePath = path.join(rootDir, "uploads", filename);

        if (!fs.existsSync(filePath)) {
            return next(errorHandler(404, "Image not found"));
        }

        await fs.promises.unlink(filePath);

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        next(error)
    }
}

export const editTravelStory = async (req, res, next) => {
    const { id } = req.params;
    const { title, story, visitedLocation,imageUrl, visitedDate } = req.body; 
    const userId = req.user.id;

    if (!title || !story || !visitedLocation || !visitedDate) {
        return next(errorHandler(400, "All fields are required"));
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            next(errorHandler(404, "Travel story not found"));
        }

        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        const placeholderImageUrl = `${baseUrl}/assets/PlaceholderImg.svg`;

        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderImageUrl;
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        res.status(200).json({ story: travelStory, message: "Travel story updated successfully" });
        
    } catch (error) {
        next(error)
    }
}  

export const deleteTravelStory = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId });

        if (!travelStory) {
            return next(errorHandler(404, "Travel story not found"))
        } 

        await travelStory.deleteOne({ _id: id, userId })

        const imageUrl = travelStory.imageUrl;

        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        const placeholderImageUrl = `${baseUrl}/assets/PlaceholderImg.svg`;

        if (imageUrl && imageUrl !== placeholderImageUrl) {
            const filename = path.basename(imageUrl);
            const filePath = path.join(rootDir, "uploads", filename);

            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath)
            }
        }      

        res.status(200).json({ success: true, message: "Travel story deleted successfully" })

    } catch (error) {
        next(error)     
    }
}

export const updateFavourite = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { isFavourite } = req.body;

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return next(errorHandler(404, "Travel story not found"));
        }

        travelStory.isFavourite = isFavourite;
        await travelStory.save();

        res.status(200).json({ story: travelStory, message: "Travel story updated successfully" });
    } catch (error) {
        next(error)   
    }
}

export const searchTravelStory = async (req, res, next) => {
    const {query} = req.query;
    const userId = req.user.id;

    if (!query) {
        return next(errorHandler(400, "Query is required"));
    }

    try {
        const searchResults = await TravelStory.find({
            userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } },
            ],
        }).sort({ isFavourite: -1 });

        res.status(200).json({ stories: searchResults });
    } catch (error) {
        next(error)
    }
}

    
