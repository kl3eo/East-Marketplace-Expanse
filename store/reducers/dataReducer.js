import {GET_DATA, SET_DATA, DATA_ERROR} from '../types'

const initialState = {
    storedFilteredItems:[],
    loading:true,
    setdata: false
}

export default function(state = initialState, action){

    switch(action.type){

        case GET_DATA:
        return {
            ...state,
            storedFilteredItems:action.payload,
            loading:false

        }
        case SET_DATA:
        return {
            ...state,
            setdata:action.payload
        }
        case DATA_ERROR:
            return{
                loading: false, 
                error: action.payload 
            }
        default: return state
    }

}
