const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./blogtest_helper')

const api = supertest(app)

beforeEach(async () => {
	await Blog.deleteMany({})
	let blogObject = new Blog(helper.initialBlogs[0])
	await blogObject.save()
	blogObject = new Blog(helper.initialBlogs[1])
	await blogObject.save()
})

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
		title: 'A Valid Blog',
		author: 'Frederick Ederson',
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
		author: 'Frederick Ederson', 
		url: 'https://validblog.com/',
		likes: 999,
	}
	const newBlogWithoutUrl = {
		title: 'A Valid Blog',
		author: 'Frederick Ederson',
		likes: 999,
	}
	const newBlogWithoutBoth = {
		author: 'Frederick Ederson',
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

after(async () => {
	mongoose.connection.close()
})