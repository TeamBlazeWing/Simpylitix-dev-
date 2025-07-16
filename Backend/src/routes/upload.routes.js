const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../middlewares/upload.middleware');
const auth = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload an image for an event
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized
 */
router.post('/image', auth, upload.single('image'), (req, res) => {
  cloudinary.uploader.upload(req.file.path, function(error, result) {
    if (error) {
      return res.status(400).json({ error: 'Image upload failed', details: error });
    }
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: result
      
    });
  }
);
});

module.exports = router;
