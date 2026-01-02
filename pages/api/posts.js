import { Octokit } from 'octokit'
import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { title, summary, tags, content } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' })
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER
  const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'master'

  if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
    return res.status(500).json({ message: 'GitHub configuration missing' })
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

    const fileContent = matter.stringify(content, frontmatter)
    const filePath = `data/blog/${slug}.md`
    const message = `Create post: ${title}`
    const encoding = 'base64'
    const contentEncoded = Buffer.from(fileContent).toString(encoding)

    const octokit = new Octokit({ auth: GITHUB_TOKEN })

    // Check if file exists to get sha (for update) or just create
    let sha
    try {
      const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: GITHUB_REPO_OWNER,
        repo: GITHUB_REPO_NAME,
        path: filePath,
        ref: GITHUB_BRANCH,
      })
      sha = data.sha
      // If we want to prevent overwrites, we could throw here.
      // But for now, let's treat it as an update if it exists.
      // Actually, my previous local impl returned 409. Let's stick to that for safety?
      // Or maybe upsert is better for a CMS-like experience.
      // Let's stick to "safe creation" -> fail if exists, to match previous behavior partially
      // BUT, checking sha implies we found it.
      return res.status(409).json({ message: 'Post with this title already exists on GitHub' })
    } catch (error) {
      if (error.status !== 404) {
        throw error
      }
      // 404 means it doesn't exist, which is good.
    }

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path: filePath,
      message: message,
      content: contentEncoded,
      branch: GITHUB_BRANCH,
    })

    return res.status(200).json({ message: 'Post created on GitHub', slug })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: `GitHub API Error: ${error.message}` })
  }
}
