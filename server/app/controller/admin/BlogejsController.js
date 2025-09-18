const BlogModel = require("../../model/Blogmodel");
const UserModel = require("../../model/doctormodel");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

class BlogController {

    // Create blog
    async createblog(req, res) {
        try {
            const { title, description, is_deleted } = req.body;
            const doctorId = req.user.id;

            const blog = new BlogModel({
                title,
                description,
                doctorId,
                is_deleted: is_deleted || false
            });

            // Save image if uploaded
            if (req.file) {
                blog.image = req.file.path;
            }

            await blog.save();
            res.redirect("/blog/list");
        } catch (error) {
            console.error("Create blog error:", error);
            res.redirect("/blog/add");
        }
    }

    // List all blogs (only not deleted)
    async allblog(req, res) {
        try {
            const blogs = await BlogModel.find({is_deleted: false })
                .populate({ path: "authorId", select: "name email" })
                .sort({ createdAt: -1 });

            res.render("blog/list", { blogs, data: req.user });
        } catch (error) {
            console.error("Fetch all blogs error:", error);
            res.redirect("/blog/list");
        }
    }
    async approveBlog(req, res) {
        try {
            const { id } = req.params;

            const blog = await BlogModel.findByIdAndUpdate(
                id,
                { isApproved: true },
                { new: true }
            );

            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }

            res.redirect("/blog/list"); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
    // Render add blog page
    async addblog(req, res) {
        try {
            res.render("blog/add", { data: req.user });
        } catch (error) {
            console.error("Add blog page error:", error);
            res.redirect("/blog/list");
        }
    }

    // Fetch single blog for editing
    async singleblog(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect("/blog/list");

            const blog = await BlogModel.findById(id)
                .populate({ path: "authorId", select: "name email" });

            if (!blog) return res.redirect("/blog/list");

            res.render("blog/edit", { blog, data: req.user });
        } catch (error) {
            console.error("Fetch single blog error:", error);
            res.redirect("/blog/list");
        }
    }

    // Update blog
    async updateblog(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect("/blog/list");

            const existingBlog = await BlogModel.findById(id);
            if (!existingBlog) return res.redirect("/blog/list");

            const { title, description, is_deleted } = req.body || {};

            const updateData = {
                title: title || existingBlog.title,
                description: description || existingBlog.description,
                is_deleted: is_deleted !== undefined ? is_deleted : existingBlog.is_deleted
            };

            // Handle new image
            if (req.file) {
                if (existingBlog.image) {
                    const oldImagePath = path.join(`F:/shreelekha/Nodejs/blog/server/uploads/blog`, path.basename(existingBlog.image));
                    if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
                }
                updateData.image = req.file.path;
            }

            await BlogModel.findByIdAndUpdate(id, updateData, { new: true });
            res.redirect("/blog/list");
        } catch (error) {
            console.error("Update blog error:", error);
            res.redirect("/blog/list");
        }
    }

    // Delete blog (soft for normal user, hard for admin)
    async deleteblog(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect("/blog/list");

            const blog = await BlogModel.findById(id);
            if (!blog) return res.redirect("/blog/list");

            // Get user role
            const user = await UserModel.findById(req.user._id).populate('role');
            const roleName = user?.role?.name || "user";

            if (roleName === "admin") {
                // Hard delete
                if (blog.image) {
                    const oldImagePath = path.join(`F:/shreelekha/Nodejs/blog/server/uploads/blog`, path.basename(blog.image));
                    if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
                }
                await BlogModel.findByIdAndDelete(id);
            } else {
                // Soft delete
                blog.is_deleted = true;
                await blog.save();
            }

            res.redirect("/blog/list");
        } catch (error) {
            console.error("Delete blog error:", error);
            res.redirect("/blog/list");
        }
    }

    // Fetch blogs for a single author
    async authorBlogs(req, res) {
        try {
            const authorId = req.params.authorId;
            if (!mongoose.Types.ObjectId.isValid(authorId)) return res.redirect("/blog/list");

            const blogs = await BlogModel.find({ authorId, is_deleted: false })
                .populate({ path: "authorId", select: "name email" })
                .sort({ createdAt: -1 });

            res.render("blog/list", { blogs, data: req.user });
        } catch (error) {
            console.error("Fetch author's blogs error:", error);
            res.redirect("/blog/list");
        }
    }
}

module.exports = new BlogController();
