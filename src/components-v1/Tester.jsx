import React, { useState } from 'react';

const Reader = () => {
	const [greater, setgreater] = useState(false);
	if (3 > 2) {
		setgreater(true);
	} else {
		setgreater(false);
	}
};

const Tester = () => {
	return <Reader />;
};

export default Tester;
