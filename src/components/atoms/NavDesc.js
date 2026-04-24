import PropTypes from 'prop-types'
import Link from 'next/link'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'

export default function NavDesc ({ title, href }) {
  const { pathname } = useRouter()
  const isActive = pathname === href
  return (
      <Link href={href} key={title} passHref>
        <Button
          component="a"
          target="_blank"
          style={{
            margin: 'auto 0',
            color: '#369',
            display: 'inline',
            textDecoration: isActive && 'underline',
            textAlign: 'left',
            fontSize: '12px',
            '&:hover': {
              backgroundColor: '#9cf',
              color: '#3c52b2'
            }
          }}
        >
          {title}
        </Button>
      </Link>
  )
}

NavDesc.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
}
