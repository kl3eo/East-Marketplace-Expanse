import {GET_DATA, DATA_ERROR, SET_CURRENT_DISP} from '../types'
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

export const setCurrentDisp = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_CURRENT_DISP,
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
