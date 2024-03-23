import { Dimensions } from 'react-native';
 
export const base_url = "enter_admin_url/";
export const api_url = "enter_admin_url/api/";
export const settings = "app_setting";
export const img_url = "enter_admin_url/public/uploads/";
export const service = "service";
export const login = "delivery_partner/login";
export const profile = "delivery_partner";
export const profile_picture = "delivery_partner/profile_picture";
export const partner_reset_password = "delivery_partner/reset_password";
export const my_orders = "get_orders";
export const order_status_change = "order_status_change";
export const dashboard = "dashboard";
export const no_data = "Sorry no data found...";
export const check_phone_number = "delivery_partner/check_phone";
export const partner_forget_password = "delivery_partner/forgot_password";
export const partner_login = "delivery_partner/login";
export const upload_profile_picture = "delivery_partner/profile_picture"; 

//Size
export const screenHeight = Math.round(Dimensions.get('window').height);
export const height_40 = Math.round(40 / 100 * screenHeight);
export const height_45 = Math.round(45 / 100 * screenHeight);
export const height_50 = Math.round(50 / 100 * screenHeight);
export const height_60 = Math.round(60 / 100 * screenHeight);
export const height_35 = Math.round(35 / 100 * screenHeight);
export const height_20 = Math.round(20 / 100 * screenHeight);
export const height_30 = Math.round(30 / 100 * screenHeight);
export const height_27 = Math.round(27 / 100 * screenHeight);
export const height_25 = Math.round(25 / 100 * screenHeight);
export const height_15 = Math.round(15 / 100 * screenHeight);
export const height_55 = Math.round(55 / 100 * screenHeight);
export const height_26 = Math.round(26 / 100 * screenHeight);

//Path
export const logo = require('.././assets/img/logo_with_name.png');
export const pickup_icon = require('.././assets/img/pickup.png');
export const delivery_icon = require('.././assets/img/delivery.png');
export const washing_icon = require('.././assets/img/washing.png');
export const forgot_password = require('.././assets/img/forgot_password.png');
export const reset_password = require('.././assets/img/reset_password.png');
export const loading = require('.././assets/img/loading.png');
export const login_image = require('.././assets/img/logo_with_name.png');
export const washing_machine = require('.././assets/img/washing-machine.png');
export const home_banner = require('.././assets/img/home_banner.png'); 
export const dash_active_icon = require('.././assets/img/dashboard_icons/dash_active_icon.png');
export const dash_completed_icon = require('.././assets/img/dashboard_icons/dash_completed_icon.png');
export const dash_upcoming_icon = require('.././assets/img/dashboard_icons/dash_upcoming_icon.png');
export const dash_pending_icon = require('.././assets/img/dashboard_icons/dash_pending_icon.png');
export const notification_image = require('.././assets/json/bell.json');
export const delivery = require('.././assets/json/delivery.json');

//Font Family
export const normal = "GoogleSans-Medium";
export const bold = "GoogleSans-Bold";

//Map
// export const GOOGLE_KEY = "ENTER_YOUR_MAP_KEY";
// export const LATITUDE_DELTA = 0.0150;
// export const LONGITUDE_DELTA =0.0152;
// //More Menu
// export const menus = [
//   {
//     menu_name: 'Manage Addresses',
//     icon: 'pin',
//     route:'AddressList'
//   },
//   {
//     menu_name: 'Faq',
//     icon: 'help',
//     route:'Faq'
//   },
//   {
//     menu_name: 'Privacy Policy',
//     icon: 'alert',
//     route:'PrivacyPolicy'
//   },
//   {
//     menu_name: 'Logout',
//     icon: 'log-out',
//     route:'Logout'
//   },
// ]

//Image upload options
const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery'
};