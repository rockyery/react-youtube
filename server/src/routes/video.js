import express from "express";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

function getVideoRoutes() {
  const router = express.Router();

  router.get('/', getRecommendedVideos)

  return router;
}

async function getVideoViews(videos) {
  for(const video of videos) {
    const views = await prisma.view.count({
      where: {
        videoId: {
          equals: video.id
        }
      }
    })
    video.views = views
  }
  return videos
}

async function getRecommendedVideos(req, res) {
  let videos = await prisma.video.findMany({
    include: {
      user: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  if(!videos.length) {
    return res.status(200).json({ videos })
  }

  videos = await getVideoViews(videos)

  res.status(200).json({ videos })
}

async function getTrendingVideos(req, res) {}

async function searchVideos(req, res, next) {}

async function addVideo(req, res) {}

async function addComment(req, res, next) {}

async function deleteComment(req, res) {}

async function addVideoView(req, res, next) {}

async function likeVideo(req, res, next) {}

async function dislikeVideo(req, res, next) {}

async function getVideo(req, res, next) {}

async function deleteVideo(req, res) {}

export { getVideoRoutes };