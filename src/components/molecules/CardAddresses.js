import CardAddress from '../atoms/CardAddress'

const currentDomain = 'room-house.com'
export default function CardAddresses ({ nft }) {
  const isAvailable = !nft.sold
  // console.log('addresses, nft', nft)
  const tId = typeof nft.tokenId === 'object' ? parseInt(nft.tokenId._hex, 16) : parseInt(nft.tokenId)
  return (
    <>
      {typeof window !== 'undefined' && window.location.hostname === 'mydocs' + '.' + currentDomain && <div style={{ width: '36px', fontSize: '18px', fontWeight: 'bold' }}>#{tId}</div>}
      {typeof window !== 'undefined' && window.location.hostname !== 'mydocs' + '.' + currentDomain && <div style={{ width: '36px', fontSize: '12px' }}>No.{tId}</div>}
      <CardAddress title="Creator" address={nft.creator} />
      <CardAddress title="Owner" address={nft.owner} />
      {typeof window !== 'undefined' && window.location.hostname !== 'mydocs' + '.' + currentDomain && isAvailable && <CardAddress title="Seller" address={nft.seller} />}
    </>
  )
}
