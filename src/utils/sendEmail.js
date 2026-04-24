import axios from 'axios'

const sendEmail = async (email, subject, html) => {
  return axios({
    method: 'post',
    url: '/api/send-mail',
    data: {
      email: email,
      subject: subject,
      html: html,
    },
  })
}

export default sendEmail
