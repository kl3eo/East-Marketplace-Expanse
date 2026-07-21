import PropTypes from 'prop-types'
import Link from 'next/link'
// import { Button } from '@mui/material'
// import { useRouter } from 'next/router'

export default function NavMuseo ({ title, href, col }) {
  // const { pathname } = useRouter()
  // const isActive = pathname === href

  return (
    title === 'Nationalmuseum, Stockholm' || title.match(/Pinakothek/g) || title === 'Art Gallery, Manchester' || title === 'Bruecke-Museum, Berlin'
      ? <Link href={href} key={title} passHref>
        <a target="_blank" style={{ position: 'relative', zIndex: '999', marginBottom: '-8px', textAlign: 'right', fontSize: '12px', color: '#234', padding: '2px', textDecoration: 'none', '&:hover': { backgroundColor: '#9cf', color: '#3c52b2' } }}><span style={{ color: '#006', textDecoration: 'underline' }}>Credits:</span> <span style={{ color: '#000', fontWeight: 'normal', textDecoration: 'none' }}>{title}.</span> (<span style={{ color: '#006' }}><a style={{ padding: '0px', textDecoration: 'none' }} href='https://creativecommons.org/licenses/by-sa/4.0/'>CC BY-SA</a></span>)</a>
      </Link>
      : title === 'NGA, Washington' || title === 'Museum of Art, Cleveland' || title === 'Met Museum, New York' || title === 'Art Institute, Chicago' || title.match(/Smithsonian/g) || title === 'Lenbachhaus, Munchen' || title === 'Walters Museum, Baltimore' || title === 'Getty Museum, LA' || title === 'Staatliche Kunsthalle, Karlsruhe' || title.match(/Thorvaldsen/g)
        ? <Link href={href} key={title} passHref>
        <a target="_blank" style={{ position: 'relative', zIndex: '999', marginBottom: '-8px', textAlign: 'right', fontSize: '12px', color: '#234', padding: '2px', textDecoration: 'none', '&:hover': { backgroundColor: '#9cf', color: '#3c52b2' } }}><span style={{ color: '#006', textDecoration: 'underline' }}>Image:</span> <span style={{ color: '#000', fontWeight: 'normal', textDecoration: 'none' }}>{title}</span> (<span style={{ color: '#006' }}><a style={{ padding: '0px', textDecoration: 'none' }} href='https://creativecommons.org/publicdomain/zero/1.0/legalcode.en'>CC0</a></span>)</a>
      </Link>
        : title === 'Nasjonalmuseet, Oslo' || title === 'Wien Museum, Vienna' || title === 'Museum für Neue Kunst, Freiburg' || title === 'Augustiner Museum, Freiburg'
          ? <Link href={href} key={title} passHref>
          <a target="_blank" style={{ position: 'relative', zIndex: '999', marginBottom: '-8px', textAlign: 'right', fontSize: '12px', color: '#234', padding: '2px', textDecoration: 'none', '&:hover': { backgroundColor: '#9cf', color: '#3c52b2' } }}><span style={{ color: '#006', textDecoration: 'underline' }}>Credits:</span> <span style={{ color: '#000', fontWeight: 'normal', textDecoration: 'none' }}>{title}</span> (<span style={{ color: '#006' }}><a style={{ padding: '0px', textDecoration: 'none' }} href='https://creativecommons.org/licenses/by/4.0/'>CC-BY</a></span>)</a>
        </Link>
          : title === 'Städel Museum, Frankfurt' || title === 'Minneapolis Institute of Art' || title === 'KMSKA, Antwerpen' || title === 'SMK, Copenhagen' || title === 'Staatliche Museen zu Berlin' || title === 'Ghent Museum, Belgium' || title === 'Museum of Modern Art, Ostend'
            ? <Link href={href} key={title} passHref>
            <a target="_blank" style={{ position: 'relative', zIndex: '999', marginBottom: '-8px', textAlign: 'right', fontSize: '12px', color: '#234', padding: '2px', textDecoration: 'none', '&:hover': { backgroundColor: '#9cf', color: '#3c52b2' } }}><span style={{ color: '#006', textDecoration: 'underline' }}>Image:</span> <span style={{ color: '#000', fontWeight: 'normal', textDecoration: 'none' }}>{title}</span> (<span style={{ color: '#006' }}><a style={{ padding: '0px', textDecoration: 'none' }} href='https://creativecommons.org/publicdomain/mark/1.0/'>CC-PDM</a></span>)</a>
          </Link>
            : title === 'Clark Art Institute, MA' || title === 'Dallas Museum of Art, TX' || title === 'Birmingham Museum of Art, AL' || title === 'County Museum of Art, LA' || title === 'Museum of Art, Philadelphia' || title === 'Art Museum, Saint Louis' || title === 'Detroit Institute of Arts' || title === 'Kunstmuseum, Basel' || title === 'Newfields Archives, IN' || title === 'Yale Art Gallery, CT' || title === 'Albertina Museum, Vienna' || title === 'Centraal Museum, Utrecht' || title === 'Galerie Belvedere, Wien' || title === 'The Jewish Museum, New York'
              ? <Link href={href} key={title} passHref>
              <a target="_blank" style={{ position: 'relative', zIndex: '999', marginBottom: '-8px', textAlign: 'right', fontSize: '12px', color: '#234', padding: '2px', textDecoration: 'none', '&:hover': { backgroundColor: '#9cf', color: '#3c52b2' } }}><span style={{ color: '#006', textDecoration: 'underline' }}>Image:</span> <span style={{ color: '#000', fontWeight: 'normal', textDecoration: 'none' }}>{title}</span> (<span style={{ color: '#006' }}><a style={{ padding: '0px', textDecoration: 'none' }} href='https://creativecommons.org/publicdomain/mark/1.0/'>PD</a></span>)</a>
            </Link>
              : <Link href={href} key={title} passHref>
              <a target="_blank" style={{ position: 'relative', zIndex: '999', marginBottom: '-8px', textAlign: 'right', fontSize: '12px', color: '#234', padding: '2px', textDecoration: 'none', '&:hover': { backgroundColor: '#9cf', color: '#3c52b2' } }}><span style={{ color: '#006', textDecoration: 'underline' }}>Image:</span> <span style={{ color: '#000', fontWeight: 'normal', textDecoration: 'none' }}>{title}</span></a>
              </Link>
  )
}

NavMuseo.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
}

// old
/*         : <Link href={href} key={title} passHref>
        <a target="_blank" style={{ position: 'relative', zIndex: '999', marginBottom: '-8px', textAlign: 'right', fontSize: '12px', color: '#234', padding: '2px', textDecoration: 'none', '&:hover': { backgroundColor: '#9cf', color: '#3c52b2' } }}><span style={{ color: '#006', textDecoration: 'underline' }}>Original</span> in <span style={{ color: col }}> {title}</span></a>
        </Link>
*/
