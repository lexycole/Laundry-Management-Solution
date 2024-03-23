import { Dimensions } from 'react-native';
import strings from "../languages/strings.js";

export const base_url = "enter_your_admin_url/";
export const api_url = "enter_your_admin_url/api/";
export const settings = "app_setting";
export const img_url = "enter_your_admin_url/public/uploads/";
export const service = "service";
export const app_name = "Rith Laundry";
export const faq = "faq";
export const privacy = "privacy_policy";
export const product = "product";
export const customer_register = "customer";
export const customer_login = "customer/login";
export const address = "address";
export const address_list = "address/all";
export const address_delete = "address/delete";
export const my_orders = "get_orders";
export const promo_code = "promo";
export const profile = "customer";
export const profile_picture = "customer/profile_picture";
export const customer_forget_password = "customer/forgot_password";
export const customer_reset_password = "customer/reset_password";
export const place_order = "order";
export const payment_list = "payment";
export const online_payment_list = "online_payment"; 
export const get_region = "get_region";
export const get_area = "get_area";
export const stripe_payment = "check_cards";
export const get_wallet = "customer/wallet";
export const add_wallet = "customer/add_wallet";
export const get_time = "get_time";
export const get_delivery_charge = "get_delivery_charge";
export const get_labels = "get_labels";
export const check_order_count = "check_order_count";
export const no_wallet = "Wallet balance is empty";
export const no_data = "No data found";
export const get_cards = "customer/get_cards";
export const delete_card = "customer/delete_card";
export const add_card = "customer/add_card"; 
export const customer_check_phone = "customer/check_phone"; 
export const upload_profile_picture = "customer/profile_picture";  
export const update_profile_picture = "customer/profile_picture_update"; 
export const product_search = "customer/product_search"; 
export const price_service_list = "customer/get_services"; 
export const price_fare_list = "customer/get_fares";
export const about_us = "customer/about_us";
export const feed_back = "customer/add_feedback"; 
export const subscription_packages = "get_subscription_packages"; 
export const add_subscription = "buy_subscription"; 
export const calculate_subtotal = "calculate_subtotal";
export const get_notification_list = "get_notification_list";

//Size
export const screenHeight = Math.round(Dimensions.get('window').height);
export const height_45 = Math.round(45 / 100 * screenHeight);
export const height_40 = Math.round(40 / 100 * screenHeight);
export const height_50 = Math.round(50 / 100 * screenHeight);
export const height_60 = Math.round(60 / 100 * screenHeight);
export const height_35 = Math.round(35 / 100 * screenHeight);
export const height_20 = Math.round(20 / 100 * screenHeight);
export const height_30 = Math.round(30 / 100 * screenHeight);
export const height_26 = Math.round(26 / 100 * screenHeight);



//Path
export const logo = require('.././assets/img/logo.png');
//export const empty_card = require('.././assets/img/empty_card.png');
export const forgot_password = require('.././assets/img/forgot_password.png');
export const reset_password = require('.././assets/img/reset_password.png');
export const loading = require('.././assets/img/loading.png');
export const pin = require('.././assets/img/location_pin.png');
export const logo_with_name = require('.././assets/img/logo_with_name.png');
export const washing_machine = require('.././assets/img/washing-machine.png');
export const completed_icon = require('.././assets/img/completed.png');
export const active_icon = require('.././assets/img/active.png');
export const plus = require('.././assets/img/plus.png');
export const minus = require('.././assets/img/minus.png');
export const pickup = require('.././assets/img/pickup.png');
export const delivery = require('.././assets/img/delivery.png');
export const low_wallet = require('.././assets/img/wallet.png');
export const background_img = require(".././assets/img/background_img.jpg");
export const platinum = require('.././assets/img/platinum.jpeg');
export const subscription_img = require('.././assets/img/subscription_img.png');

//Font Family
export const normal = "GoogleSans-Medium";
export const bold = "GoogleSans-Bold";

//Map
export const GOOGLE_KEY = "enter_map_key";
export const LATITUDE_DELTA = 0.0150;
export const LONGITUDE_DELTA =0.0152;
