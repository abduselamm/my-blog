import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { useSession, signIn } from 'next-auth/react'

export default function Admin() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPosts()
    }
  }, [status])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      if (!res.ok) throw new Error('Failed to fetch posts')
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/posts?slug=${slug}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setPosts(posts.filter((post) => post.slug !== slug))
      } else {
        const data = await res.json()
        alert(`Error: ${data.message}`)
      }
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
  }

  if (status === 'loading') return <div className="p-10">Loading...</div>

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
      <PageSEO title={`Admin - ${siteMetadata.title}`} description="Manage blog posts" />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Admin Dashboard
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Manage your blog posts (GitHub backed)
          </p>
        </div>
        <div className="py-12">
          <div className="mb-4 flex justify-end">
            <Link href="/editor">
              <a className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                Create New Post
              </a>
            </Link>
          </div>

          {loading && <p>Loading posts from GitHub...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      Slug
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                  {posts.map((post) => (
                    <tr key={post.slug}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {post.slug}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Link href={`/editor?slug=${post.slug}`}>
                          <a className="mr-4 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Edit
                          </a>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
