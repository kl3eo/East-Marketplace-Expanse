import {GET_DATA, SET_CURRENT_DISP, DATA_ERROR} from '../types'

const initialState = {
    storedFilteredItems:[],
    loading:true,
    currentDisp:0
}

export default function(state = initialState, action){

    switch(action.type){

        case GET_DATA:
        return {
            ...state,
            storedFilteredItems:action.payload,
            loading:false
        }
        case SET_CURRENT_DISP:
        return {
            ...state,
            currentDisp:action.payload
        }
        case DATA_ERROR:
            return{
                loading: false, 
                error: action.payload 
            }
        default: return state
    }

}
