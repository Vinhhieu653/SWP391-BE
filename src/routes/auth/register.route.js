import express from 'express'
import * as userController from '../../controllers/auth/register.controller.js'
import { authorizeRoles, authenticateToken } from '../../middlewares/auth.middleware.js'
const router = express.Router()

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   fullname:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                   gender:
 *                     type: string
 *                     enum: [male, female, other]
 *                   roleId:
 *                     type: integer
 *       500:
 *         description: Server error
 */

router.get('/', authenticateToken, authorizeRoles('admin', 'guardian'), userController.getAllUsers)

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 fullname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 dateOfBirth:
 *                   type: string
 *                   format: date
 *                 gender:
 *                   type: string
 *                 role:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *       404:
 *         description: User not found
 */

router.get('/:id', authenticateToken, authorizeRoles('admin', 'guardian', 'nurse'), userController.getUserById)

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - username
 *               - email
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               username:
 *                 type: string
 *                 example: "nguyenvana"
 *               email:
 *                 type: string
 *                 example: "nguyenvana@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "0123456789"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "2000-01-01"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registered successfully
 *       400:
 *         description: Bad request - username or email already taken, or validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username taken / Email taken / Invalid input
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post('/register', authenticateToken, authorizeRoles('admin'), userController.register)

/**
 * @swagger
 * /api/v1/users/edit/{id}:
 *   put:
 *     summary: Update user info
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     gender:
 *                       type: string
 *       400:
 *         description: Bad request (validation or duplication errors)
 *       500:
 *         description: Server error
 */

router.put('/edit/:id', authenticateToken, authorizeRoles('admin', 'guardian'), userController.update)

/**
 * @swagger
 * /api/v1/users/delete/{id}:
 *   delete:
 *     summary: Delete approved user account by admin
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: User not found or bad request
 *       500:
 *         description: Internal server error
 */

router.delete('/delete/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUser)

export default router
