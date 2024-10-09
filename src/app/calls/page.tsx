"use client"
import { CallContent } from '@/components/call-content'
import { NavigationBar } from '@/components/NaviGationBar'
import React from 'react'

const page = () => {
  return (
      <>
          <NavigationBar  
          trigger={null}
          />

      <CallContent />
      </>
  )
}

export default page 