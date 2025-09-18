const express = require('express');
const BlogController = require('../../controller/admin/BlogejsController');
const Blogimageupload = require('../../helper/Blogimageupload');
const AuthCheck = require('../../middleware/auth');
const {Authcheck, checkRole } = require('../../middleware/AuthCheck');

const router = express.Router();
// Create blog - both user and admin
router.post('/create/blog', AuthCheck,Blogimageupload.single("image"), BlogController.createblog);

// List all blogs - usually admin only
router.get('/blog/list',  BlogController.allblog);
router.get(
    "/approveblog/:id",
    AuthCheck,
  
    BlogController.approveBlog
);
// List single author's blogs - both user and admin can see
router.get('/blog/author/:authorId', AuthCheck,  BlogController.authorBlogs);

// Single blog for edit - both
router.get('/singleblog/:id', AuthCheck, BlogController.singleblog);

// Add blog page - both
router.get('/blog/add', AuthCheck,BlogController.addblog);

// Update blog - both
router.post('/updateblog/:id', AuthCheck, Blogimageupload.single("image"), BlogController.updateblog);

// Delete blog - both
router.get('/deleteblog/:id', AuthCheck,BlogController.deleteblog);


module.exports = router;
