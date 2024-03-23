import firebase from '@react-native-firebase/app';

  var config = {
	apiKey: "*******************",
	 authDomain: "*******************",
	 databaseURL: "*******************",
	 projectId: "*******************",
	 storageBucket: "*******************",
	 messagingSenderId: "*******************",
	 appId: "*******************"
	
	
  };


let app = Firebase.initializeApp(config);  
export const fb = app.database(); 
