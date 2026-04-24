import {GET_DATA, DATA_ERROR, SET_CURRENT_DISP, SET_RELO, SET_CURRENT_SLICE, SET_LOADING, SET_LOOPING, SET_FULLY_LOADED, SET_SOMETHING_LOADED, SET_SCALING_ALLOWED, SET_LOOKUP, SET_CATEG, SET_AUTO_SCROLL, SET_LIGHT_BGR, SET_NUM, SET_CHU, SET_BEAU, SET_CURR_DIFF} from '../types'
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

export const setCurrDiff = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_CURR_DIFF,
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

export const setCurrentSlice = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_CURRENT_SLICE,
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

export const setSomethingLoaded = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_SOMETHING_LOADED,
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

export const setScalingAllowed = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_SCALING_ALLOWED,
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

export const setRelo = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_RELO,
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

export const setCateg = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_CATEG,
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

export const setLooping = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_LOOPING,
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

export const setAutoScroll = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_AUTO_SCROLL,
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

export const setLightBgr = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_LIGHT_BGR,
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

export const setNum = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_NUM,
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

export const setChu = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_CHU,
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

export const setBeau = (data) => async dispatch => {
    
    try{
        dispatch( {
            type: SET_BEAU,
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
