import * as ActionTypes from './ActionTypes';

export const subTotal = (data) => ({
    type: ActionTypes.SUB_TOTAL,
    data: data
})

export const total = (data) => ({
    type: ActionTypes.TOTAL,
    data: data
})

export const promo = (data) => ({
    type: ActionTypes.PROMO,
    data: data
})

export const calculatePricing = () => ({
    type: ActionTypes.CALCULATE_PRICING,
})

export const selectAddress = (data) => ({
    type: ActionTypes.SELECT_ADDRESS,
    data: data
})

export const selectDate = (data) => ({
    type: ActionTypes.SELECT_DATE,
    data: data
})

export const reset = () => ({
    type: ActionTypes.RESET,
})

export const selectPickupDate = (data) => ({
    type: ActionTypes.SELECT_PICKUP_DATE,
    data: data
})

export const selectPickupTime = (data) => ({
    type: ActionTypes.SELECT_PICKUP_TIME,
    data: data
})

export const selectDeliveryDate = (data) => ({
    type: ActionTypes.SELECT_DELIVERY_DATE,
    data: data
})

export const selectDeliveryTime = (data) => ({
    type: ActionTypes.SELECT_DELIVERY_TIME,
    data: data
})

export const deliveryCost = (data) => ({
    type: ActionTypes.DELIVERY_COST,
    data: data
})


export const totalItem = (data) => ({
    type: ActionTypes.TOTAL_ITEM,
    data: data
})

export const sDiscount = (data) => ({
    type: ActionTypes.S_DISCOUNT,
    data: data
})

export const sTotal = (data) => ({
    type: ActionTypes.S_TOTAL,
    data: data
})

export const sItem = (data) => ({
    type: ActionTypes.S_ITEM,
    data: data
})