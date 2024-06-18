import express from 'express'
const router = express.Router()

import token from '../libs/keys.js'
import ControladorVideo from '../controllers/controller_video.js'

router.route('/api/videosAll')
    .get(ControladorVideo.getVideosAll)

router.route('/api/videos/:id_user')
    .get(ControladorVideo.getVideos)
    .post(token.decodeToken, ControladorVideo.postVideo);


router.route('/api/video/:id_video')
    .get(ControladorVideo.getVideo)
    .put(token.decodeToken, ControladorVideo.putVideo)
    .delete(token.decodeToken, ControladorVideo.deleteVideo)

export default router