import axios from 'axios'

const getUri = async (uri, signed) => {
  return axios({
    method: 'post',
    url: '/api/get_uri',
    data: {
      uri: uri,
      signed: signed,
    },
  })
}

export default getUri
