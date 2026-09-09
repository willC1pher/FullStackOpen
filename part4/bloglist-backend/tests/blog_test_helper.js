const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')


const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const getTokenAndUser = async () => {
  const passwordHash = await bcrypt.hash('Ckrit', 10)
  const newUser = new User({ username: 'goat', passwordHash })
  const savedUser = await newUser.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  return { token, savedUser }
}

module.exports = {
  initialBlogs,
  blogsInDb,
  getTokenAndUser,
}