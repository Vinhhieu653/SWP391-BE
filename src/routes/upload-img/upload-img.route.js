import express from 'express'
import upload from '../../middlewares/cloudinaryUpload.js'
import { uploadImage } from '../../controllers/upload-img/upload-img.controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Image upload endpoints
 */

/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     tags: [Upload]
 *     summary: Upload an image to Cloudinary
 *     operationId: uploadImage
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of uploaded image
 *                   example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *                 public_id:
 *                   type: string
 *                   description: Public ID of uploaded image in Cloudinary
 *                   example: "uploads/pf7urmpnliapkgmnqjoh"
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "No file uploaded"
 */

router.post('/', upload.single('image'), uploadImage, (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' })

  res.json({
    url: req.file.path,
    public_id: req.file.filename
  })
})

export default router
