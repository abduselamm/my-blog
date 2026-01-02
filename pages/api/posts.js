import { Octokit } from 'octokit'
import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })

  // Protect all mutations (POST, PUT, DELETE)
  if (req.method !== 'GET' && !session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Optional: Also protect GET if you want private blog
  // if (!session) return res.status(401).json({ message: 'Unauthorized' })

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER
  const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'master'

  if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
    return res.status(500).json({ message: 'GitHub configuration missing' })
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })

  // --- GET Request (List or Single) ---
  if (req.method === 'GET') {
    const { slug } = req.query

    try {
      if (slug) {
        // Fetch single file
        const filePath = `data/blog/${slug}.md`
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: GITHUB_REPO_OWNER,
          repo: GITHUB_REPO_NAME,
          path: filePath,
          ref: GITHUB_BRANCH,
        })

        const content = Buffer.from(data.content, 'base64').toString('utf-8')
        const { data: frontmatter, content: markdownBody } = matter(content)

        return res.status(200).json({
          slug,
          frontmatter,
          content: markdownBody,
          sha: data.sha,
        })
      } else {
        // List all files
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: GITHUB_REPO_OWNER,
          repo: GITHUB_REPO_NAME,
          path: 'data/blog',
          ref: GITHUB_BRANCH,
        })

        // Filter and map to simple objects (we can't get full frontmatter efficiently without N+1 requests,
        // so we'll settle for filename/slug and basic checks. For a real CMS we'd want a better way)
        const posts = data
          .filter((file) => file.name.endsWith('.md'))
          .map((file) => ({
            name: file.name,
            slug: file.name.replace('.md', ''),
            sha: file.sha,
            // We don't have date/title here implies listing might be ugly without fetching content.
            // OPTION: We could try to fetch content in parallel if list is small.
            // Let's assume list is small enough for now or just show slug.
            download_url: file.download_url,
          }))

        return res.status(200).json(posts)
      }
    } catch (error) {
      console.error(error)
      if (error.status === 404) return res.status(404).json({ message: 'Not found' })
      return res.status(500).json({ message: `GitHub API Error: ${error.message}` })
    }
  }

  // --- DELETE Request ---
  if (req.method === 'DELETE') {
    const { slug } = req.query
    if (!slug) return res.status(400).json({ message: 'Slug is required' })

    try {
      const filePath = `data/blog/${slug}.md`

      // Get SHA first
      const { data: currentFile } = await octokit.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          owner: GITHUB_REPO_OWNER,
          repo: GITHUB_REPO_NAME,
          path: filePath,
          ref: GITHUB_BRANCH,
        }
      )

      await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner: GITHUB_REPO_OWNER,
        repo: GITHUB_REPO_NAME,
        path: filePath,
        message: `Delete post: ${slug}`,
        sha: currentFile.sha,
        branch: GITHUB_BRANCH,
      })

      return res.status(200).json({ message: 'Post deleted' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: `GitHub API Error: ${error.message}` })
    }
  }

  // --- POST/PUT Request (Create or Update) ---
  if (req.method === 'POST' || req.method === 'PUT') {
    const { title, summary, tags, content, originalSlug } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    try {
      const slugger = new GithubSlugger()
      // If updating, and title changed, slug might change.
      // This is complex. Let's simplify:
      // If we have an originalSlug, we are updating that file (or moving it if title changed).
      // For now, let's assume slug is derived from title always.

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
      const encoding = 'base64'
      const contentEncoded = Buffer.from(fileContent).toString(encoding)

      let sha
      // Check if file exists
      try {
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: GITHUB_REPO_OWNER,
          repo: GITHUB_REPO_NAME,
          path: filePath,
          ref: GITHUB_BRANCH,
        })
        sha = data.sha
      } catch (error) {
        if (error.status !== 404) throw error
      }

      if (req.method === 'POST') {
        if (sha) {
          return res.status(409).json({ message: 'Post with this title already exists' })
        }
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner: GITHUB_REPO_OWNER,
          repo: GITHUB_REPO_NAME,
          path: filePath,
          message: `Create post: ${title}`,
          content: contentEncoded,
          branch: GITHUB_BRANCH,
        })
        return res.status(200).json({ message: 'Post created', slug })
      } else if (req.method === 'PUT') {
        // If we are renaming (slug changed), we need to delete old and create new.
        // req.body.originalSlug is needed to know the old file

        if (originalSlug && originalSlug !== slug) {
          // RENAME FILE FLOW
          // 1. Delete old
          const oldFilePath = `data/blog/${originalSlug}.md`
          const { data: oldFile } = await octokit.request(
            'GET /repos/{owner}/{repo}/contents/{path}',
            {
              owner: GITHUB_REPO_OWNER,
              repo: GITHUB_REPO_NAME,
              path: oldFilePath,
              ref: GITHUB_BRANCH,
            }
          )

          await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
            owner: GITHUB_REPO_OWNER,
            repo: GITHUB_REPO_NAME,
            path: oldFilePath,
            message: `Rename post: ${originalSlug} -> ${slug}`,
            sha: oldFile.sha,
            branch: GITHUB_BRANCH,
          })

          // 2. Create new (SHA is null because new path doesn't exist yet, presumably)
          // We use our pre-calculated sha variable, which should be null if new title is unique
          if (sha) {
            // Collision on rename! logic is tricky. Let's just fail for now?
            return res.status(409).json({ message: 'Target filename already exists' })
          }

          await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: GITHUB_REPO_OWNER,
            repo: GITHUB_REPO_NAME,
            path: filePath,
            message: `Create post: ${title} (renamed)`,
            content: contentEncoded,
            branch: GITHUB_BRANCH,
          })
        } else {
          // NORMAL UPDATE
          if (!sha) {
            return res.status(404).json({ message: 'File to update not found' })
          }

          await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: GITHUB_REPO_OWNER,
            repo: GITHUB_REPO_NAME,
            path: filePath,
            message: `Update post: ${title}`,
            content: contentEncoded,
            sha: sha,
            branch: GITHUB_BRANCH,
          })
        }
        return res.status(200).json({ message: 'Post updated', slug })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: `GitHub API Error: ${error.message}` })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
