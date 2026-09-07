const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { tokenExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', tokenExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid.' })
  }

  const user = await User.findById(decodedToken.id)
  
  const { title, author, url, likes } = request.body
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()


  if (!savedBlog.title || !savedBlog.url) {
    response.status(400).end()
  }
  else {
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
  const blogToChange = await Blog.findById(request.params.id)

  const newLikes = request.body.likes
  if (!blogToChange) {
    response.status(404).end()
  }
  else {
    blogToChange.likes = newLikes

    const updatedBlog = await blogToChange.save()
    response.json(updatedBlog)
  }
})

module.exports = blogsRouter