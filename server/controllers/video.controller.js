import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import { createError } from "../error.js";
import axios from "axios";
import SearchQueue from "../models/searchQueue.model.js";

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted.");
    } else {
      return next(createError(403, "You can delete only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};

export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  console.log("YouTube API Key:", process.env.YOUTUBE_API_KEY);
   console.log("🔍 Search controller triggered");
  try {
    // Step 1: Search your own DB
    const localVideos = await Video.find({
      title: { $regex: query, $options: "i" },
    });

    if (localVideos.length > 0) {
      return res.status(200).json({ source: "local", videos: localVideos });
    }

    await SearchQueue.findOneAndUpdate(
      { query },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    // Step 2: Fallback to YouTube search
    const ytRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          q: query,
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 20,
          type: "video",
          part: "snippet",
        },
      }
    );
    console.log("YouTube API response:", ytRes.data);

    const youtubeVideos = ytRes.data.items.map((item) => ({
      _id: item.id.videoId,
      title: item.snippet.title,
      desc: item.snippet.description,
      imgUrl: item.snippet.thumbnails.high.url,
      isYouTube: true,
    }));
    if (youtubeVideos.length === 0) {
      return res.status(404).json({ message: "No videos found." });
    }
    console.log("Transformed YouTube videos:", youtubeVideos);
    return res
      .status(200)
      .json({ source: "youtube", videos: youtubeVideos });
  } catch (err) {
    console.error("Search failed:", err.message);
    next(err);
  }
};
