const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 3000;

// {
//     id: '8fca0a77-a5ed-4118-b6e0-e953c99a166f',
//     image_url: 'https://cdn.subspace.money/grow90_tracks/images/yvfNJXn6soZnibwGQI9c.jpeg',
//     title: 'Top 5 movies releasing on 1st week of October.'
//   }

app.get('/api/blog-stats', async (req, res) => {
    try {
      const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
      const response = await axios.get(apiUrl, {
        headers: {
          'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
        },
      });
        
        const blogs=response.data.blogs;
        allBlogs=blogs;
        // console.log(allBlogs)
        const totalBlogs = blogs.length;
        
        const longestBlog = _.maxBy(blogs, (blog) => blog.title.length);
        const blogsWithPrivacy = _.filter(blogs, (blog) => _.includes(blog.title.toLowerCase(), 'privacy'));
        const uniqueBlogTitles = _.uniqBy(blogs, 'title');

        // Respond with JSON containing statistics
        res.json({
            totalBlogs,
            longestBlog: longestBlog.title,
            blogsWithPrivacy: blogsWithPrivacy.length,
            uniqueBlogTitles,
        });

    } catch (error) {
        // Handle API request error
        console.error('Error fetching blog data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/blog-search', async(req, res) => {
    const query = req.query.query.toLowerCase();
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
      const response = await axios.get(apiUrl, {
        headers: {
          'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
        },
      });
        
        const blogs=response.data.blogs;
    // Filter blogs based on the query
    const filteredBlogs = _.filter(blogs, (blog) => blog.title.toLowerCase().includes(query));
  
    res.json(filteredBlogs);
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});
  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});