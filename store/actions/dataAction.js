import {GET_DATA, DATA_ERROR, SET_CURRENT_DISP, SET_LOADING, SET_FULLY_LOADED, SET_LOOKUP} from '../types'
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

export const setLoading = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_LOADING,
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

export const setFullyLoaded = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_FULLY_LOADED,
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

export const setLookup = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_LOOKUP,
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
