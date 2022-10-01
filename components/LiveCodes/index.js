/* eslint-disable @next/next/no-img-element */
import React from 'react'

export const CssRotate = () => {
  const [angle, setAngle] = React.useState(0)
  const handleRotate = (rotation) => {
    setAngle(rotation)
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <button
          onClick={() => handleRotate(0)}
          className="m-1 rounded-md bg-gray-500 p-2 text-white ring-green-400 hover:bg-gray-500 focus:ring-4"
        >
          rotate(0)
        </button>
        <button
          onClick={() => handleRotate('90deg')}
          className="m-1 rounded-md bg-gray-500 p-2 text-white ring-green-400 hover:bg-gray-500 focus:ring-4"
        >
          rotate(90deg)
        </button>
        <button
          onClick={() => handleRotate('180deg')}
          className="m-1 rounded-md bg-gray-500 p-2 text-white ring-green-400 hover:bg-gray-500 focus:ring-4"
        >
          rotate(180deg)
        </button>
        <button
          onClick={() => handleRotate('360deg')}
          className="m-1 rounded-md bg-gray-500 p-2 text-white ring-green-400 hover:bg-gray-500 focus:ring-4"
        >
          rotate(360deg)
        </button>
        <button
          onClick={() => handleRotate('-0.25turn')}
          className="m-1 rounded-md bg-gray-500 p-2 text-white ring-green-400 hover:bg-gray-500 focus:ring-4"
        >
          rotate(-0.25turn)
        </button>
      </div>
      <img
        style={{
          transform: `rotate(${angle})`,
          transition: 'all 0.3s ease-in-out',
        }}
        className="mt-14 w-48"
        src="/static/images/css-lighthouse.png"
        alt="css rotate"
      />
    </div>
  )
}
