import React from 'react'

import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'

export const LiveShow = ({ Code, showCode = true, title = 'Live code' }) => {
  const scope = { Code }

  const code = `
  <Code />
`
  return (
    <LiveProvider code={code} scope={scope}>
      <h2>{title}</h2>
      <div className="mb-5 flex h-72 w-full flex-wrap justify-center divide-x-2 overflow-auto rounded-r-md rounded-l-none bg-gray-100 p-3">
        {showCode && (
          <div className="flex h-auto w-1/2 items-center justify-center overflow-auto rounded-l-md bg-gray-900">
            <LiveEditor />
          </div>
        )}
        <div
          className={`flex h-auto ${showCode ? 'w-1/2' : 'w-full'}  items-center justify-center`}
        >
          <LivePreview />
        </div>
      </div>
      <LiveError className="bg-red-600" />
    </LiveProvider>
  )
}

export const LiveShowString = ({ Code, showCode = true, title = 'Live code' }) => {
  return (
    <LiveProvider code={Code}>
      <h2>{title}</h2>
      <div className="mb-5 flex h-auto w-full flex-wrap justify-around  overflow-auto rounded-r-md rounded-l-none bg-gray-100 ">
        {showCode && (
          <div className="flex h-auto w-auto items-center justify-center overflow-auto rounded-l-md bg-gray-900">
            <LiveEditor />
          </div>
        )}
        <div
          className={`flex h-auto ${showCode ? 'w-auto' : 'w-full'}  items-center justify-center`}
        >
          <LivePreview />
        </div>
      </div>
      <LiveError className="bg-red-600" />
    </LiveProvider>
  )
}
