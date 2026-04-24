import * as React from 'react'
import { Html } from '@react-email/html'
import { Img } from '@react-email/img'
import { Heading } from '@react-email/heading'
import { Section } from '@react-email/section'
import { Text } from '@react-email/text'
import { Hr } from '@react-email/hr'
import { Link } from '@react-email/link'
// import { Column } from '@react-email/column'
// import { Container } from '@react-email/container'
import { Head } from '@react-email/head'
// import { Font } from '@react-email/font'

export default function EmailCard ({ nft, mes, who }) {
  const { name, description, image } = nft
  if (who.length && mes.length) {
    return (
      <Html lang="en">
      <Head>
        <meta charset="UTF-8" />
      </Head>
        <Section>
          <Img src={image} alt={name} height="480" />
          <Heading as="h2">{name}</Heading>
          <Text>{description}</Text>
          <Hr />
          <Text style={{ fontSize: '18px', fontFamily: 'Courier' }}><span style={{ fontWeight: 'bold' }}>{who}</span> wrote to you:</Text>
          <Text style={{ fontSize: '18px', fontFamily: 'Courier' }}>&quot;{mes}&quot;</Text>
          <Hr />
        </Section>
        <Text>Create and Send Custom Postcards! <Link href="https://supernft.room-house.com">Room-House NFTs</Link></Text>
      </Html>
    )
  } else if (mes.length) {
    return (
      <Html lang="en">
      <Head>
        <meta charset="UTF-8" />
      </Head>
        <Section>
          <Img src={image} alt={name} height="480" />
          <Heading as="h2">{name}</Heading>
          <Text>{description}</Text>
          <Hr />
          <Text style={{ fontSize: '18px', fontFamily: 'Courier' }}>&quot;{mes}&quot;</Text>
          <Hr />
        </Section>
        <Text>Create and Send Custom Postcards! <Link href="https://supernft.room-house.com">Room-House NFTs</Link></Text>
      </Html>
    )
  } else {
    return (
      <Html lang="en">
      <Head>
        <meta charset="UTF-8" />
      </Head>
        <Section>
          <Img src={image} alt={name} height="480" />
          <Heading as="h2">{name}</Heading>
          <Text>{description}</Text>
          <Hr />
        </Section>
        <Text>Create and Send Custom Postcards! <Link href="https://supernft.room-house.com">Room-House NFTs</Link></Text>
      </Html>
    )
  }
/*
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://room-house.com/fonts/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2'
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Container>
      <Section>
        <Column>
          <Img src={image} alt={name} width="300" height="300" />
          <Heading as="h2">{name}</Heading>
          <Text>{description}</Text>
        </Column>
        <Column>
          <Text>{mes}</Text>
        </Column>
      </Section>
      </Container>
    </Html>
  )
*/
}
