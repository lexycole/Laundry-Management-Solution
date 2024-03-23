import * as Actions from '../actions/ActionTypes'
const CartReducer = (state = { isLoding: false, s_discount:0, s_total:0, s_item:[], sub_total:0, promo:undefined, promo_id:0, total_amount:0, delivery_cost:0, pickup_date:undefined, pickup_time:undefined, delivery_date:undefined, delivery_time:undefined, promo_amount:0, address:0, delivery_date:undefined, total_item:0 }, action) => {
    switch (action.type) {
        case Actions.CALCULATE_PRICING:
            return Object.assign({}, state, {
               isLoding: true,
            });
        case Actions.SUB_TOTAL:
            return Object.assign({}, state, {
               sub_total: action.data
            }); 
        case Actions.S_DISCOUNT:
            return Object.assign({}, state, {
                s_discount: action.data
            });
        case Actions.S_TOTAL:
            return Object.assign({}, state, {
                s_total: action.data
            });
        case Actions.S_ITEM:
            return Object.assign({}, state, {
                s_item: action.data
            });
        case Actions.DELIVERY_COST:
            return Object.assign({}, state, {
               delivery_cost: action.data
            }); 
        case Actions.PROMO:
            return Object.assign({}, state, {
               promo: action.data,
               promo_id: action.data.id
            });
        case Actions.TOTAL:
            return Object.assign({}, state, {
               promo_amount: action.data.promo_amount,
               total_amount: action.data.total,  
               isLoding: false       
            }); 
        case Actions.SELECT_ADDRESS:
            return Object.assign({}, state, {
               address: action.data
            });
        case Actions.TOTAL_ITEM:
            return Object.assign({}, state, {
               total_item: action.data
            });
        case Actions.SELECT_DATE:
            return Object.assign({}, state, {
               delivery_date: action.data
            });
        case Actions.SELECT_PICKUP_DATE:
            return Object.assign({}, state, {
               pickup_date: action.data
            });
        case Actions.SELECT_PICKUP_TIME:
            return Object.assign({}, state, {
               pickup_time: action.data
            });
        case Actions.SELECT_DELIVERY_DATE:
            return Object.assign({}, state, {
               delivery_date: action.data
            });
        case Actions.SELECT_DELIVERY_TIME:
            return Object.assign({}, state, {
               delivery_time: action.data
            });
        case Actions.RESET:
            return Object.assign({}, state, {
               isLoding: false, 
               sub_total:0, 
               promo:undefined, 
               promo_id:0, 
               total_amount:0, 
               promo_amount:0, 
               address:0, 
               delivery_date:undefined,
               s_item:[],
               s_total:0
            });
        default:
            return state;
    }
}

export default CartReducer;