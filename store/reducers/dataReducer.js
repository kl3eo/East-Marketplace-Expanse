import {GET_DATA, SET_CURRENT_DISP, SET_CURRENT_SLICE, SET_RELO, SET_LOADING, SET_LOOKUP, SET_FULLY_LOADED, DATA_ERROR} from '../types'

const initialState = {
    storedFilteredItems:[],
    loading:true,
    fullyLoaded: false,
    currentDisp:0,
    currentSlice:0,
    relo: false,
    lookupStr:''
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_DATA:
        return {
            ...state,
            storedFilteredItems:action.payload
        }
        case SET_CURRENT_DISP:
        return {
            ...state,
            currentDisp:action.payload
        }
        case SET_CURRENT_SLICE:
        return {
            ...state,
            currentSlice:action.payload
        }
        case SET_RELO:
        return {
            ...state,
            relo:action.payload
        }
        case SET_LOADING:
        return {
            ...state,
            loading:action.payload
        }
        case SET_FULLY_LOADED:
        return {
            ...state,
            fullyLoaded:action.payload
        }
        case SET_LOOKUP:
        return {
            ...state,
            lookupStr:action.payload
        }
        case DATA_ERROR:
            return{
                loading: false, 
                error: action.payload 
            }
        default: return state
    }
}
