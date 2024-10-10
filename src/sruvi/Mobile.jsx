import { useMediaQuery } from 'react-responsive';
import React from 'react';

const Mobile = ({ children }) => {
	const isMobile = useMediaQuery({ maxWidth: 1024 });
	return isMobile ? children : null;
};

export default Mobile;
