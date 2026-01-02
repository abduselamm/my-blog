const dev = process.env.NODE_ENV !== 'production'

export const url = dev ? '/api' : 'https://abduselam-blogs.vercel.app/api'
