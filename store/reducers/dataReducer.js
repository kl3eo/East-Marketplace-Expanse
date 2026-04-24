import {GET_DATA, SET_CURRENT_DISP, SET_CURRENT_SLICE, SET_RELO, SET_LOADING, SET_LOOPING, SET_LOOKUP, SET_CATEG, SET_AUTO_SCROLL, SET_LIGHT_BGR, SET_NUM, SET_CHU, SET_FULLY_LOADED, SET_SOMETHING_LOADED, SET_SCALING_ALLOWED, DATA_ERROR, SET_BEAU, SET_CURR_DIFF} from '../types'

const initialState = {
    storedFilteredItems:[],
    loading:true,
    fullyLoaded: true,
    scalingAllowed: false,
    somethingLoaded: false,
    currentDisp:0,
    currDiff:0,
    currentSlice:0,
    relo: false,
    lookupStr:'',
    categStr:'',
    num: 0,
    chu: 0,
    beau: 0,
    autoScroll: false,
    lightBgr: false,
    looping: false
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
        case SET_CURR_DIFF:
        return {
            ...state,
            currDiff:action.payload
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
        case SET_SOMETHING_LOADED:
        return {
            ...state,
            somethingLoaded:action.payload
        }
        case SET_SCALING_ALLOWED:
        return {
            ...state,
            scalingAllowed:action.payload
        }
        case SET_LOOKUP:
        return {
            ...state,
            lookupStr:action.payload
        }
        case SET_CATEG:
        return {
            ...state,
            categStr:action.payload
        }
        case SET_LOOPING:
        return {
            ...state,
            looping:action.payload
        }
        case SET_AUTO_SCROLL:
        return {
            ...state,
            autoScroll:action.payload
        }
        case SET_LIGHT_BGR:
        return {
            ...state,
            lightBgr:action.payload
        }
        case SET_NUM:
        return {
            ...state,
            num:action.payload
        }
        case SET_CHU:
        return {
            ...state,
            chu:action.payload
        }
        case SET_BEAU:
        return {
            ...state,
            beau:action.payload
        }
        case DATA_ERROR:
            return{
                loading: false, 
                error: action.payload 
            }
        default: return state
    }
}
