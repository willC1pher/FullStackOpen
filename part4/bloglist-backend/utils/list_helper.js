const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogLists) => {
  const blogLikes = blogLists.map(blog => blog.likes)
  // console.log('Blog likes', blogLikes)
  const calculateSum = (sumLike, blogLike) => {
    return sumLike + blogLike
  }

  return blogLikes.length === 0
    ? 0
    : blogLikes.reduce(calculateSum, 0)
}

const favoriteBlog = (blogLists) => {
  const blogLikes = blogLists.map(blog => blog.likes)
  const findMax = (largest, item) => {
    return item > largest ? item : largest
  }

  // Find maximum number of likes in the blog lists
  const maxLike = blogLikes.reduce(findMax, 0)
  // console.log('Max like', maxLike)

  // Find blogs that have the most likes
  const maxLikeBlogs = blogLists.filter(blog => blog.likes === maxLike)
  return blogLists.length === 0
    ? null
    : maxLikeBlogs[0] // Only return one blog in the favorite lists
}

const mostBlogs = (blogLists) => {
  const counts = _.countBy(blogLists, 'author')
  // Return: obj { "author's name": blogCounts }

  const arrayOfCounts = _.values(counts)
  // Return: arr [ count1, count2, ... ]

  const maxCount = _.max(arrayOfCounts)
  // Return: int maxCount

  let favAuthor = null
  for (const key in counts) {
    if (counts[key] === maxCount) {
      favAuthor = key
    }
  }

  const result = {
    author: favAuthor,
    blogs: maxCount
  }
  // console.log('Result of most blog', result)

  return _.isEmpty(blogLists)
    ? null
    : result
}

const mostLikes = (blogLists) => {
  const groupedAuthor = _.groupBy(blogLists, 'author')
  // Return: obj
  // { Author1: [ {blog1} {blog2} {...} ],
  //   Author2: [ {blog1} {blog2} {...} ],
  //   ...                                }
  // console.log("groupedAuthor", groupedAuthor)

  let max = 0
  let favAuthor = null

  for (const author in groupedAuthor) {
    const blogListsOfEachAuthor = groupedAuthor[author]
    // Return: arr [ {blog1} {blog2} {...} ]

    const totalLikes = _.sumBy(blogListsOfEachAuthor, 'likes')
    // Return: int totalLikes

    if (totalLikes > max) {
      favAuthor = author,
      max = totalLikes
    }
  }
  // console.log('max likes', max)
  // find total likes of each groupedAuthor[key], then find max for three of them

  const result = {
    author: favAuthor,
    likes: max
  }
  // console.log('Result of mostLikes', result)

  return _.isEmpty(groupedAuthor)
    ? null
    : result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
