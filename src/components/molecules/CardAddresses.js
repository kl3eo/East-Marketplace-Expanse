import CardAddress from '../atoms/CardAddress'

export default function CardAddresses ({ nft }) {
  const isAvailable = !nft.sold && !nft.canceled
  const tId = parseInt(nft.tokenId._hex, 16)
  return (
    <>
      <div style={{ width: '36px', fontSize: '12px' }}>No.{tId}</div>
      <CardAddress title="Creator" address={nft.creator} />
      <CardAddress title="Owner" address={nft.owner} />
      {isAvailable && <CardAddress title="Seller" address={nft.seller} />}
    </>
  )
}
