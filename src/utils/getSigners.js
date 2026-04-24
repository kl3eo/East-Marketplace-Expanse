import axios from 'axios'

const getSigners = async () => {
  return axios({
    method: 'post',
    url: '/api/get_signers',
    data: {},
  })
}

export default getSigners
