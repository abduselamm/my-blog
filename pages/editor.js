import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { useSession, signIn } from 'next-auth/react'

export default function Editor() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { slug } = router.query

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [originalSlug, setOriginalSlug] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      // optionally redirect or just show UI
    }

    if (status === 'authenticated' && slug) {
      setLoading(true)
      fetch(`/api/posts?slug=${slug}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load post')
          return res.json()
        })
        .then((data) => {
          setTitle(data.frontmatter.title)
          setSummary(data.frontmatter.summary)
          setTags(data.frontmatter.tags.join(', '))
          setContent(data.content)
          setOriginalSlug(slug)
        })
        .catch((err) => setStatusMsg(`Error loading post: ${err.message}`))
        .finally(() => setLoading(false))
    }
  }, [slug, status])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatusMsg('Submitting...')
    try {
      const method = originalSlug ? 'PUT' : 'POST'
      const body = {
        title,
        summary,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t),
        content,
        originalSlug,
      }

      const res = await fetch('/api/posts', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setStatusMsg(`Success! Post ${originalSlug ? 'updated' : 'created'}.`)
        if (!originalSlug) {
          setTitle('')
          setSummary('')
          setTags('')
          setContent('')
        } else {
          // Optional: Redirect back to admin or show success
          // router.push('/admin')
        }
      } else {
        const data = await res.json()
        setStatusMsg(`Error: ${data.message}`)
      }
    } catch (error) {
      setStatusMsg(`Error: ${error.message}`)
    }
  }

  if (status === 'loading' || loading) return <div className="p-10">Loading...</div>

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <h1 className="mb-4 text-2xl">Access Denied</h1>
        <p className="mb-4">You must be logged in to view this page.</p>
        <button
          onClick={() => signIn()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Log In
        </button>
      </div>
    )
  }

  return (
    <>
      <PageSEO title={`Editor - ${siteMetadata.title}`} description="Create or Edit blog post" />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {originalSlug ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {originalSlug ? `Editing: ${originalSlug}` : 'Create a new blog post'}
          </p>
        </div>
        <div className="items-center justify-center pt-8">
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="summary"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Summary
              </label>
              <input
                id="summary"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Content (Markdown)
              </label>
              <textarea
                id="content"
                rows={15}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {originalSlug ? 'Update Post' : 'Publish'}
            </button>
            {statusMsg && (
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                {statusMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  )
}
