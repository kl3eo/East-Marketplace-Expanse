import {GET_DATA, DATA_ERROR} from '../types'
export const getData = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: GET_DATA,
            payload: data
        })
    }
    catch(error){
        dispatch( {
            type: DATA_ERROR,
            payload: error,
        })
    }

}

export const setData = () => async dispatch => {
    
    try{
        dispatch( {
            type: SET_DATA,
            payload: 'lol'
        })
    }
    catch(error){
        dispatch( {
            type: DATA_ERROR,
            payload: error,
        })
    }

}
