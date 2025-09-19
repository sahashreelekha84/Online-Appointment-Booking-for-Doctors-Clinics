const BlogModel = require("../../model/Blogmodel");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

class BlogController {
  // Create a new blog
  async createBlog(req, res) {
    try {
      const { title, description, is_deleted } = req.body;
      const doctorId = req.user.id;

      // Only doctors can post
      if (req.user.roleName !== "doctor") {
        return res.status(403).json({ message: "Only doctors can post a blog" });
      }

      // Validation
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }

      // Create blog object
      const blog = new BlogModel({
        title,
        description,
        doctorId,
        is_deleted: is_deleted || false,
      });

      if (req.file) {
        blog.image = req.file.filename; // just store filename
      }

      await blog.save();

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      res.status(201).json({
        message: "Blog created successfully",
        blog: {
          ...blog.toObject(),
          image: blog.image ? `${baseUrl}/uploads/blog/${blog.image}` : null,
        },
      });
    } catch (error) {
      console.error("Create blog error:", error);
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  // Get all blogs (non-deleted)
  async getAllBlogs(req, res) {
    try {
      const blogs = await BlogModel.find({ is_deleted: false, isApproved: true }).populate("doctorId", "name");
      res.status(200).json({ blogs });
    } catch (error) {
      console.error("Get blogs error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async commentcreate(req, res) {
    try {
      const { id } = req.params;
      const { comment } = req.body;

      if (!comment || comment.trim() === "") {
        return res.status(400).json({ message: "Comment is required" });
      }

      const updatedBlog = await BlogModel.findByIdAndUpdate(
        id,
        { $push: { comment } },
        { new: true }
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.status(200).json({
        message: "Comment added successfully",
        blog: updatedBlog,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
  async commentlist(req, res) {
    try {
      const { id } = req.params;

      const blog = await BlogModel.findById(id).select("comment"); // only fetch comments
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.status(200).json({
        comments: blog.comment,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
  // Get single blog by id
  async getBlogById(req, res) {
    try {
      const { id } = req.params;
      const blog = await BlogModel.findById(id);

      if (!blog || blog.is_deleted) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.status(200).json({ blog });
    } catch (error) {
      console.error("Get blog error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
  async updateBlog(req, res) {
    try {
      const { id } = req.params;
      const { title, description, is_deleted } = req.body;

      // Find blog by ID
      const blog = await BlogModel.findById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Update fields
      blog.title = title || blog.title;
      blog.description = description || blog.description;
      blog.is_deleted = is_deleted !== undefined ? is_deleted : blog.is_deleted;

      // Update image if new file uploaded
      if (req.file) {
        blog.image = req.file.path; // multer saves path
      }

      await blog.save();

      return res.status(200).json({
        message: "Blog updated successfully",
        blog,
      });
    } catch (error) {
      console.error("Update blog error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  // Delete blog (soft delete)
  async deleteBlog(req, res) {
    try {
      const { id } = req.params;
      const blog = await BlogModel.findByIdAndUpdate(id, { is_deleted: true }, { new: true });

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Optionally delete the file
      if (blog.image && fs.existsSync(blog.image)) {
        await fsPromises.unlink(blog.image);
      }

      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error("Delete blog error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

}
module.exports = new BlogController();
