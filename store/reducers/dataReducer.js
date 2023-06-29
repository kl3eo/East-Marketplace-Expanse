import {GET_DATA, DATA_ERROR} from '../types'

const initialState = {
    storedFilteredItems:[],
    loading:true
}

export default function(state = initialState, action){

    switch(action.type){

        case GET_DATA:
        return {
            ...state,
            storedFilteredItems:action.payload,
            loading:false

        }
        case DATA_ERROR:
            return{
                loading: false, 
                error: action.payload 
            }
        default: return state
    }

}
