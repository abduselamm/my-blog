import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const allowedOwner = process.env.GITHUB_REPO_OWNER
      // Security: Only allow the repo owner to sign in
      if (profile.login === allowedOwner) {
        return true
      }
      return false
      // Or return '/unauthorized' to show a custom error page
    },
    async session({ session, token, user }) {
      // Expose the github username in session
      if (session?.user) {
        session.user.username = token.sub // 'sub' in JWT is usually the user ID, but let's check profile
      }
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (profile) {
        token.username = profile.login
      }
      return token
    },
  },
})
