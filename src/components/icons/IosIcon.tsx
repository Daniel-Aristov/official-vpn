interface IconProps {
  className?: string
  strokeOpacity?: number
}

export function IosIcon({ className, strokeOpacity = 0.5 }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_ios_icon)">
        <path
          d="M8.286 7.00846C5.07 7.00846 4 10.2385 4 12.9285C4 16.1575 6.143 21.0005 8.286 21.0005C9.451 20.9505 10.085 20.4625 11.5 20.4625C12.906 20.4625 13.107 21.0005 14.714 21.0005C16.321 21.0005 19 17.7715 19 15.6195C18.97 15.6085 16.351 15.1855 16.321 12.3895C16.301 10.0545 18.91 9.21046 19 9.16146C17.904 7.55546 15.838 7.04846 15.25 7.00846C13.715 6.88846 12.218 8.08546 11.5 8.08546C10.771 8.08546 9.464 7.00846 8.286 7.00846Z"
          stroke="white"
          strokeOpacity={strokeOpacity}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.4142 3.41421C13.0391 3.78929 12.5304 4 12 4C12 3.46957 12.2107 2.96086 12.5858 2.58579C12.9609 2.21071 13.4696 2 14 2C14 2.53043 13.7893 3.03914 13.4142 3.41421Z"
          stroke="white"
          strokeOpacity={strokeOpacity}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_ios_icon">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
