import * as imageService from '../../services/upload-img/upload-img.service.js'

export const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' })

  const { path: url, filename: public_id } = req.file

  try {
    const image = await imageService.createImage({ url, public_id })
    res.json({
      msg: 'Upload success and saved to DB',
      url: image.url,
      public_id: image.public_id
    })
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message })
  }
}
