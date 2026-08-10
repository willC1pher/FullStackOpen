const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./blogtest_helper')
const logger = require('../utils/logger')

const api = supertest(app)

beforeEach(async () => {
	await Blog.deleteMany({})
	let blogObject = new Blog(helper.initialBlogs[0])
	await blogObject.save()
	blogObject = new Blog(helper.initialBlogs[1])
	await blogObject.save()
})

describe('when there is initially some blogs saved', () => {
	test('blogs are returned as json', async () => {
		await api
				.get('/api/blogs')
				.expect(200)
				.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs')

		assert.strictEqual(response.body.length, helper.initialBlogs.length)
	})

	test('the unique identifier property of the blog posts is named id', async () => {
		const response = await api.get('/api/blogs')

		assert('id' in response.body[0])
	})
})

describe('addition of a new blog post', () => {
	test('a valid blog posts can be added', async () => {
		const newBlog = {
			title: 'A Valid Blog',
			author: 'Frederick Ederson',
			url: 'https://validblog.com/',
			likes: 999,
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const listAfterPost = await helper.blogsInDb()
		assert.strictEqual(listAfterPost.length, helper.initialBlogs.length + 1)
	})

	test('the content of the uploaded blog post is saved correctly to the database', async () => {
		const newBlog = {
			title: 'A Valid Blog',
			author: 'Frederick Ederson',
			url: 'https://validblog.com/',
			likes: 999,
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		
		const response = await api.get('/api/blogs')
		const savedBlog = response.body.find(blog => blog.title === newBlog.title)

		assert.strictEqual(savedBlog.title, newBlog.title)
		assert.strictEqual(savedBlog.author, newBlog.author)
		assert.strictEqual(savedBlog.url, newBlog.url)
	})

	test('the likes property is missing from the request, it will default to zero', async () => {
		const newBlog = {
			title: 'Blog Without Likes',
			author: 'Fred Anderson',
			url: 'https://validblog.com/',
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api.get('/api/blogs')
		const savedBlog = response.body.find(blog => blog.title === newBlog.title)

		assert.strictEqual(savedBlog.likes, 0)
	})

	test('a blog post without title or url cannot be added to the database', async () => {
		const newBlogWithoutTitle = {
			author: 'Frederer Ederson', 
			url: 'https://validblog.com/',
			likes: 999,
		}
		const newBlogWithoutUrl = {
			title: 'A Valid Blog',
			author: 'Freder Anderson',
			likes: 999,
		}
		const newBlogWithoutBoth = {
			author: 'Fred Ederson',
			likes: 999,
		}

		const response1 = await api
			.post('/api/blogs')
			.send(newBlogWithoutBoth)
			.expect(400)
		const response2 = await api
			.post('/api/blogs')
			.send(newBlogWithoutTitle)
			.expect(400)
		const response3 = await api
			.post('/api/blogs')
			.send(newBlogWithoutUrl)
			.expect(400)
		// assert.strictEqual(response1.statusCode, 400)
		// assert.strictEqual(response2.statusCode, 400)
		// assert.strictEqual(response3.statusCode, 400)
	})
})

describe('deletion of a blog post', () => {
	test('a blog post can be deleted', async () => {
		const blogsAtStart = await helper.blogsInDb()
		// logger.info('length of blogsAtStart', blogsAtStart.length)
		const blogsToDelete = blogsAtStart[blogsAtStart.length - 1]
		// logger.info('blogsToDelete', blogsToDelete)

		await api
			.delete(`/api/blogs/${blogsToDelete.id}`)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()
		const idList = blogsAtEnd.map(blog => blog.id)

		// Check whether the blog with targeted id still exists
		assert(!idList.includes(blogsToDelete.id))
		//Check whether the blog is actually removed from the blog list
		assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
	})
})

describe('updating of a blog post', () => {
	test('a blog post can be updated', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[blogsAtStart.length - 1]

		const newLikes = blogToUpdate.likes + 1

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send({
				...blogToUpdate,
				likes: newLikes
			})
			.expect(200)

		const blogsAtEnd = await helper.blogsInDb()

		// Find by id as MongoDB does not guarantee that find({}) documents in order-stable order
		const blogAfterUpdate = blogsAtEnd.find(
			blog => blog.id === blogToUpdate.id
		)

		assert.strictEqual(blogAfterUpdate.likes, newLikes)
	})
})

after(async () => {
	mongoose.connection.close()
})