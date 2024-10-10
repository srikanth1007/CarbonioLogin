import React from 'react';

const MobilePageLayout = ({ div1children, div2children }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
				width: '100vw',
				overflow: 'hidden'
			}}
		>
			<div
				style={{
					display: 'flex',
					height: '80%',
					flexDirection: 'column',
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				{div1children}
			</div>
			<div
				style={{
					display: 'flex',
					height: '20%',
					flexDirection: 'column',
					width: '100%',
					justifyContent: 'flex-end'
				}}
			>
				<div style={{ marginBottom: '8px', marginLeft: '8px' }}>{div2children}</div>
			</div>
		</div>
	);
};

export default MobilePageLayout;
