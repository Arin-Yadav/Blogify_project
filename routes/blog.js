const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
  destination: function (req, blog, cb) {
    cb(null, path.resolve("./public/uploads"));
  },

  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const uploads = multer({ storage: storage });

const router = Router();

router.get("/add-new", (req, res) => {
  res.render("addBlog", {
    user: req.user, // this is done because nav bar will be on blogs page
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
  res.render("blog", {
    user: req.user,
    blog: blog,
    comments: comments,
  });
  // console.log(req.user);
});

router.post("/", uploads.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
