import { AI } from '../package'

const ai = AI({

  // List Blog Topics - Generate potential blog topics
  listBlogTopics: {
    niche: 'target niche or industry',
    audience: 'target audience description',
    keywords: ['relevant keywords'],
    topics: ['list of potential blog topics']
  },
  
  // List Blog Titles - Generate engaging titles for a specific topic
  listBlogTitles: {
    topic: 'main topic of the blog post',
    audience: 'target audience description',
    titles: ['list of potential blog titles']
  },
  
  // Write Blog Post - Create a complete blog post
  writeBlogPost: {
    title: 'title of the blog post',
    audience: 'target audience description',
    content: 'complete blog post content'
  },
  
  // Edit Blog Post - Make improvements to a blog post
  editBlogPost: {
    title: 'title of the blog post',
    content: 'updated blog post content',
    changes: ['list of changes made']
  }
})

// Example blog to work with
const blogExample = {
  niche: 'Artificial Intelligence',
  audience: 'Technology professionals'
}

// Function to run the entire blog creation process
const createBlogPost = async () => {
  console.log('Starting blog post creation process...')
  
  // Step 1: Generate blog topics
  console.log('\n1. Generating blog topics...')
  const topics = await ai.listBlogTopics({
    niche: blogExample.niche,
    audience: blogExample.audience,
    keywords: ['AI', 'machine learning']
  })
  console.log('Blog topics generated:', topics)
  
  // Step 2: Generate blog titles for the first topic
  console.log('\n2. Generating blog titles...')
  const selectedTopic = topics.topics[0]
  const titles = await ai.listBlogTitles({
    topic: selectedTopic,
    audience: blogExample.audience
  })
  console.log('Blog titles generated:', titles)
  
  // Step 3: Write the blog post using the first title
  console.log('\n3. Writing blog post...')
  const selectedTitle = titles.titles[0]
  const blogPost = await ai.writeBlogPost({
    title: selectedTitle,
    audience: blogExample.audience
  })
  console.log('Blog post written:', blogPost)
  
  // Step 4: Edit the blog post
  console.log('\n4. Editing blog post...')
  const editedPost = await ai.editBlogPost({
    title: selectedTitle,
    content: blogPost.content
  })
  console.log('Blog post edited:', editedPost)
  
  return {
    topics,
    titles,
    originalPost: blogPost,
    editedPost
  }
}

// Function to just list blog topics
const listTopicsExample = async () => {
  console.log('Generating blog topics...')
  const topics = await ai.listBlogTopics({
    niche: 'Technology',
    audience: 'Software developers',
    keywords: ['JavaScript', 'TypeScript']
  })
  console.log('Blog topics generated:', topics)
  return topics
}

// Function to just list blog titles
const listTitlesExample = async () => {
  console.log('Generating blog titles...')
  const titles = await ai.listBlogTitles({
    topic: 'TypeScript Best Practices',
    audience: 'Software developers'
  })
  console.log('Blog titles generated:', titles)
  return titles
}

// Function to just write a blog post
const writeBlogPostExample = async () => {
  console.log('Writing blog post...')
  const blogPost = await ai.writeBlogPost({
    title: '5 TypeScript Tips Every Developer Should Know',
    audience: 'Software developers'
  })
  console.log('Blog post written:', blogPost)
  return blogPost
}

// Function to just edit a blog post
const editBlogPostExample = async () => {
  console.log('Editing blog post...')
  const blogContent = 'TypeScript is a programming language that extends JavaScript by adding types. It is developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript and adds optional static typing to the language. TypeScript is designed for the development of large applications and transcompiles to JavaScript.'
  const editedPost = await ai.editBlogPost({
    title: '5 TypeScript Tips Every Developer Should Know',
    content: blogContent
  })
  console.log('Blog post edited:', editedPost)
  return editedPost
}

// Run the complete blog post creation process
createBlogPost().then(result => {
  console.log('Blog post creation completed successfully!')
}).catch(error => {
  console.error('Error creating blog post:', error)
})

// Uncomment to run individual examples
// listTopicsExample()
// listTitlesExample()
// writeBlogPostExample()
// editBlogPostExample()
