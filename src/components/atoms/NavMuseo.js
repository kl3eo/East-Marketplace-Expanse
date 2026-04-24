import PropTypes from 'prop-types'
import Link from 'next/link'
// import { Button } from '@mui/material'
// import { useRouter } from 'next/router'

export default function NavMuseo ({ title, href, col }) {
  // const { pathname } = useRouter()
  // const isActive = pathname === href

  return (
      <Link href={href} key={title} passHref>
        <a target="_blank" style={{ position: 'relative', zIndex: '999', marginBottom: '-8px', textAlign: 'right', fontSize: '12px', color: '#234', padding: '2px', textDecoration: 'none', '&:hover': { backgroundColor: '#9cf', color: '#3c52b2' } }}><span style={{ color: '#006', textDecoration: 'underline' }}>Original</span> in <span style={{ color: col }}> {title}</span></a>
      </Link>
  )
}

NavMuseo.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
}
