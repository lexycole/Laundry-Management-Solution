import * as Actions from '../actions/ActionTypes'
const MyOrdersReducer = (state = { isLoding: false, error: undefined, data:[], message:undefined, status:undefined }, action) => {
    switch (action.type) {
        case Actions.MYORDERS_LIST_PENDING:
            return Object.assign({}, state, {
               isLoding: true,
            });
        case Actions.MYORDERS_LIST_ERROR:
            return Object.assign({}, state, {
                isLoding: false,
                error: action.error
            });
        case Actions.MYORDERS_LIST_SUCCESS:
          return Object.assign({}, state, {
            isLoding: false,
            data: action.data
          });
        default:
            return state;
    }
}

export default MyOrdersReducer;
