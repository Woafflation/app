import React from 'react'

const DefaultProjectIcon = ({ size = 16, className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox='0 0 22 22'
    xmlns='http://www.w3.org/2000/svg'
  >
    <circle fill='#E7EAF3' cx='11' cy='11' r='10' />
    <path
      fill='#9FAAC4'
      d='M6.224,10.406C6.079,10.595,6,10.794,6,11.002c0,1.104,2.239,2.001,5,2.001c2.764,0,5-0.897,5-2.001 c0-0.208-0.078-0.405-0.225-0.596c-0.27,0.172-0.564,0.316-0.869,0.44c-1.051,0.419-2.43,0.659-3.906,0.659 c-1.476,0-2.856-0.239-3.907-0.659C6.787,10.723,6.493,10.578,6.224,10.406z'
    />
    <path
      fill='#9FAAC4'
      d='M6.224,12.905C6.079,13.095,6,13.291,6,13.5c0,1.104,2.239,2.002,5,2.002c2.764,0,5-0.896,5-2.002 c0-0.209-0.078-0.405-0.225-0.595c-0.27,0.168-0.564,0.313-0.869,0.436c-1.051,0.423-2.432,0.66-3.906,0.66 c-1.475,0-2.856-0.237-3.907-0.66C6.787,13.219,6.493,13.073,6.224,12.905z'
    />
    <path
      fill='#9FAAC4'
      d='M14.032,8.5c-0.021-0.006-0.035-0.014-0.054-0.021C13.291,8.204,12.238,8.001,11,8.001 c-1.238,0-2.29,0.203-2.979,0.479C8.004,8.486,7.986,8.495,7.969,8.5c0.017,0.008,0.036,0.016,0.052,0.022 C8.71,8.797,9.762,9.001,11,9.001c1.238,0,2.291-0.204,2.979-0.479C13.994,8.516,14.014,8.508,14.032,8.5z M11,10.5 c2.764,0,5-0.895,5-2c0-1.106-2.236-2-5-2c-2.761,0-5,0.895-5,2.001S8.239,10.5,11,10.5z'
    />
  </svg>
)

export default DefaultProjectIcon
