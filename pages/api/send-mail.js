const nodemailer = require('nodemailer')

export default function handler (req, res) {
  const message = {
    from: '"NFT Postcards" <nftcard@room-house.com>',
    to: req.body.email,
    bcc: 'alex@motivation.ru',
    subject: 'You received a postcard from ' + req.body.subject,
    html: req.body.html
  }
  const isGmail = req.body.email.match(/gmail/g)
  const transporter = nodemailer.createTransport({
    host: isGmail ? 'room-house.com' : process.env.SMTP_HOST || 'mail.room-house.com',
    port: parseInt(process.env.SMTP_PORT || '25'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'user',
      pass: process.env.SMTP_PASSWORD || 'password'
    },
    connectionTimeout: 1000,
    greetingTimeout: 1000,
    socketTimeout: 1000,
    logger: false,
    debug: false
  })

  if (req.method === 'POST') {
    transporter.sendMail(message, (err, info) => {
      if (err) {
        res.status(404).json({
          error: `Connection refused at ${err.address}`
        })
      } else {
        res.status(250).json({
          success: `Message delivered to ${info.accepted}`
        })
      }
    })
  }
}
