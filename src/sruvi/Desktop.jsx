import { useMediaQuery } from 'react-responsive';

const Desktop = ({ children }) => {
	const isDesktop = useMediaQuery({ minWidth: 1025 });
	return isDesktop ? children : null;
};

export default Desktop;
