const express = require('express');
const router = express.Router();
const BlogController = require('../../controller/api/BlogController');
const Blogimageupload = require('../../helper/Blogimageupload');
const { Authcheck} = require('../../middleware/AuthCheck'); // middleware for authentication & role check

/**
 * @swagger
 * /api/create/blog:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blog]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My First Blog"
 *               content:
 *                 type: string
 *                 example: "This is the body of my blog..."
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/create/blog',
  Authcheck, // ensure user is logged in
  Blogimageupload.single("image"), // handle image upload
  BlogController.createBlog
);

/**
 * @swagger
 * /api/blog/list:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blog]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     responses:
 *       200:
 *         description: List of all blogs
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/blog/list',
  Authcheck,
   // only admin can access
  BlogController.getAllBlogs
);
/**
 * @swagger
 * /api/blog/{id}/comment:
 *   post:
 *     summary: Add a comment to a blog
 *     tags: [Comment]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Great post!"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       404:
 *         description: Blog not found
 */
router.post(
  '/blog/:id/comment',
  Authcheck,
   // only admin can access
  BlogController.commentcreate
);
/**
 * @swagger
 * /api/blog/{id}/comments:
 *   get:
 *     summary: Get comments for a blog
 *     tags: [Comment]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Blog not found
 */
router.get(
  '/blog/:id/comments',
  Authcheck,
   // only admin can access
  BlogController.commentlist
);
/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog details
 *       404:
 *         description: Blog not found
 */
router.get(
  '/blog/:id',
  Authcheck,
  BlogController.getBlogById
);



/**
 * @swagger
 * /api/updateblog/{id}:
 *   post:
 *     summary: Update a blog by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Blog Title"
 *               content:
 *                 type: string
 *                 example: "Updated blog content..."
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       404:
 *         description: Blog not found
 */
router.post(
  '/updateblog/:id',
  Authcheck,
  Blogimageupload.single("image"),
  BlogController.updateBlog
);

/**
 * @swagger
 * /api/deleteblog/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 */
router.delete(
  '/deleteblog/:id',
  Authcheck,
  BlogController.deleteBlog
);

module.exports = router;
