import CardAddress from '../atoms/CardAddress'

export default function CardAddresses ({ nft }) {
  const isAvailable = !nft.sold
  // console.log('addresses, nft', nft)
  const tId = typeof nft.tokenId === 'object' ? parseInt(nft.tokenId._hex, 16) : parseInt(nft.tokenId)
  return (
    <>
      {typeof window !== 'undefined' && window.location.hostname === 'mydocs.room-house.com' && <div style={{ width: '36px', fontSize: '18px', fontWeight: 'bold' }}>#{tId}</div>}
      {typeof window !== 'undefined' && window.location.hostname !== 'mydocs.room-house.com' && <div style={{ width: '36px', fontSize: '12px' }}>No.{tId}</div>}
      <CardAddress title="Creator" address={nft.creator} />
      {typeof window !== 'undefined' && window.location.hostname !== 'mydocs.room-house.com' && <CardAddress title="Owner" address={nft.owner} />}
      {typeof window !== 'undefined' && window.location.hostname !== 'mydocs.room-house.com' && isAvailable && <CardAddress title="Seller" address={nft.seller} />}
    </>
  )
}
