import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBlwBMooyo3IrB5VVJLv8dpc0wzSM3fgnw',
	authDomain: 'control-287d3.firebaseapp.com',
	projectId: 'control-287d3',
	storageBucket: 'control-287d3.appspot.com',
	messagingSenderId: '452963548837',
	appId: '1:452963548837:web:b368f9cc328ba5b40c974c',
	measurementId: 'G-E5KFFGK03X'
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
