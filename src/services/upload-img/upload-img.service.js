import Image from '../../models/data/image.model.js'

export const createImage = async ({ url, public_id }) => {
  const image = await Image.create({ url, public_id })
  return image
}
