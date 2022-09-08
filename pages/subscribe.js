import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import NewsletterForm from '@/components/NewsletterForm'
import Image from 'next/image'
import newsletter from 'public/static/images/psql.jpg'

export default function Projects() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-start">
      <PageSEO
        title={`Subscribe - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <Image width="400em" height="350em" alt="News letter" src={newsletter} />
      {siteMetadata.newsletter.provider !== '' && (
        <div className="flex h-auto flex-col items-center justify-center  justify-self-center pt-4">
          <NewsletterForm />
          <div className="mt-7">
            <h1 className="tex-4xl font-bold">We have some exciting updates for you:</h1>
            <p>- The latest blog posts.</p>
            <p>- The latest industry news and happenings.</p>
            <p>
              - A list of useful tools, services, and resources to help you grow and succeed online.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
