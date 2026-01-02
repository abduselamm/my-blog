const fs = require('fs')
const path = require('path')
const { loadEnvConfig } = require('@next/env')

const dev = process.env.NODE_ENV !== 'production'
const { combinedEnv } = loadEnvConfig(process.cwd(), dev)

console.log('--- Checking Environment Variables ---')

const required = [
  'GITHUB_ID',
  'GITHUB_SECRET',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GITHUB_TOKEN',
  'GITHUB_REPO_OWNER',
]

let missing = false

required.forEach((key) => {
  const val = combinedEnv[key]
  if (!val) {
    console.error(`❌ MISSING: ${key}`)
    missing = true
  } else {
    const len = val.length
    const preview = len > 4 ? val.substring(0, 2) + '...' + val.substring(len - 2) : '****'
    console.log(`✅ FOUND: ${key} (Length: ${len})`)

    if (key === 'NEXTAUTH_URL') {
      console.log(`   Value: ${val}`)
    }
  }
})

if (missing) {
  console.log('\n❌ FAILURE: Some required environment variables are missing.')
  process.exit(1)
} else {
  console.log('\n✅ SUCCESS: All required environment variables seem to be present.')
}
