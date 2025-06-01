import express from 'express'
const router = express.Router()

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Trả về chuỗi hello
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: hello
 */
router.get('/test', (req, res) => {
  res.send('hello')
})

export default router

// import express from 'express'
// import { apiResponse } from '../middlewares/responseUtils.js'

// const router = express.Router()

// /**
//  * @swagger
//  * /test3:
//  *   get:
//  *     summary: Test API response kiểu chuẩn
//  *     tags:
//  *       - Test
//  *     responses:
//  *       200:
//  *         description: Trả về response thành công mẫu
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: integer
//  *                   example: 200
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: Test api response success
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     test:
//  *                       type: string
//  *                       example: ok
//  */

// // ex test router
// router.get('/test3', (req, res) => {
//   apiResponse(res, {
//     status: 200,
//     success: true,
//     message: 'Test api response success',
//     data: { test: 'ok' }
//   })
// })

// //ex test error router
// // router.get('/test33333', (req, res) => {
// //     apiResponse(res, {
// //         status: 200,
// //         success: true,
// //         message: 'Test api response success',
// //         data: { test: 'ok' }
// //     });
// // });

// // ex test not found router
// // router.get('/test3', (req, res) => {
// //     throw new Error('Fake server error')
// // })
// export default router
