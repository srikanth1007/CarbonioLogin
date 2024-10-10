import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

const Typingeffect = ({ displaytext }) => {
	const [text, setText] = useState('');
	const [index, setIndex] = useState(0);
	const [speed, setSpeed] = useState(50);

	const sentence = displaytext;

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (index < sentence.length) {
				setText(sentence.substring(0, index + 1));
				setIndex(index + 1);
			}
		}, speed);

		return () => clearInterval(intervalId);
	}, [index, speed]);

	return (
		<div>
			<Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
				{text}
			</Typography>
		</div>
	);
};

export default Typingeffect;
