import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import NewsletterForm from '@/components/NewsletterForm'

export default function Projects() {
  return (
    <>
      <PageSEO
        title={`Subscribe - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      {siteMetadata.newsletter.provider !== '' && (
        <div className="flex h-96 flex-col items-start justify-center  justify-self-center pt-4">
          <NewsletterForm />
          <div className="mt-7">
            <h1 className="tex-4xl font-bold">We have some exciting updates for you:</h1>
            <p>- The latest blog posts from your favorite blogs.</p>
            <p>- The latest industry news and happenings.</p>
            <p>
              - A list of useful tools, services, and resources to help you grow and succeed online.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
