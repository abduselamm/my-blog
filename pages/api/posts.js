import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { title, summary, tags, content } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' })
  }

  try {
    const slugger = new GithubSlugger()
    const slug = slugger.slug(title)
    const date = new Date().toISOString()

    const frontmatter = {
      title,
      date,
      tags: tags || [],
      draft: false,
      summary: summary || '',
    }

    // gray-matter stringify takes content as first arg, and options object (frontmatter) as second,
    // BUT the options object for stringify expects the data in the object itself if passed as one arg,
    // OR content first, then data.
    // Actually, looking at docs: matter.stringify(content, data, options)

    const fileContent = matter.stringify(content, frontmatter)

    // Ensure data/blog exists (it should, but good to be safe?)
    const blogDir = path.join(process.cwd(), 'data', 'blog')
    const filePath = path.join(blogDir, `${slug}.md`)

    if (fs.existsSync(filePath)) {
      return res.status(409).json({ message: 'Post with this title already exists' })
    }

    fs.writeFileSync(filePath, fileContent)

    return res.status(200).json({ message: 'Post created', slug })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
