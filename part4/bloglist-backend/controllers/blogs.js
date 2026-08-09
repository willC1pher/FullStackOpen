const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const { requestLogger } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()

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