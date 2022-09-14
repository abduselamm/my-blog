/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { Container } from './Container'

export const HeaderImage = (props) => {
  return (
    <Container>
      <img className="my-0 rounded-md" {...props} />
    </Container>
  )
}
