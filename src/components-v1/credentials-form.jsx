/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useState, useMemo } from 'react';

import { Button, PasswordInput, Row, Text, Tooltip } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import { useLoginConfigStore } from '../store/login/store';
import { InputAdornment, TextField, Typography } from '@mui/material';

const urlParams = new URLSearchParams(window.location.search);

export default function CredentialsForm({
	authError,
	submitCredentials,
	configuration,
	disableInputs,
	onClickForgetPassword,
	loading = false
}) {
	const [t] = useTranslation();

	const [username, setUsername] = useState(urlParams.get('username') || '');
	const [password, setPassword] = useState('');
	const { carbonioDomainName, carbonioFeatureResetPasswordEnabled } = useLoginConfigStore();

	const submitUserPassword = useCallback(
		(e) => {
			e.preventDefault();
			if (username && password) {
				let usernameModified = username;
				if (urlParams.has('virtualacctdomain')) {
					usernameModified = `${usernameModified.replace('@', '.')}@${urlParams.get(
						'virtualacctdomain'
					)}`;
				} else if (urlParams.has('customerDomain') && !username.includes('@')) {
					usernameModified = `${usernameModified.trim()}@${urlParams.get('customerDomain')}`;
				}
				if (!username.includes('@') && carbonioDomainName) {
					usernameModified = `${username}@${carbonioDomainName}`;
				}
				submitCredentials(usernameModified, password);
			}
		},
		[username, password, carbonioDomainName, submitCredentials]
	);

	const samlButtonCbk = useCallback(() => {
		window.location.assign(
			`/zx/auth/startSamlWorkflow?redirectUrl=${configuration.destinationUrl}`
		);
	}, [configuration]);
	const samlButton = useMemo(() => {
		if (configuration.authMethods.includes('saml')) {
			return (
				<Button
					type="outlined"
					data-testid="loginSaml"
					label={t('login_saml', 'Login SAML')}
					color="primary"
					disabled={disableInputs}
					onClick={samlButtonCbk}
				/>
			);
		}
		return (
			// used to keep the correct space where or not SAML is shown
			<div style={{ minHeight: '0px' }} />
		);
	}, [configuration, disableInputs, samlButtonCbk, t]);

	const clickForgetPassword = useCallback(
		(e) => {
			e.preventDefault();
			onClickForgetPassword();
		},
		[onClickForgetPassword]
	);

	const domainElement = useMemo(() => {
		return !username?.includes('@') && carbonioDomainName ? (
			<Tooltip placement="top" label={`@${carbonioDomainName}`} size="small">
				<Text
					color="secondary"
					size="small"
					weight="light"
					style={{ marginTop: '1.25rem', maxWidth: '8.125rem' }}
				>
					@{carbonioDomainName}
				</Text>
			</Tooltip>
		) : null;
	}, [username, carbonioDomainName]);

	///////////Sruvi//////////

	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleMouseUpPassword = (event) => {
		event.preventDefault();
	};
	const UserIcon = (props) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={24}
			height={24}
			color={'#000000'}
			fill={'none'}
			{...props}
		>
			<path
				d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
		</svg>
	);

	return (
		<form
			onSubmit={(e) => e.preventDefault()}
			style={{ width: '100%', height: '100%' }}
			data-testid="credentials-form"
		>
			<div
				style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'start',
					flexDirection: 'column',
					alignItems: 'start'
				}}
			>
				<Typography variant="h5" style={{ textAlign: 'start' }}>
					Login
				</Typography>
				<Typography variant="body1" style={{ textAlign: 'start', marginTop: '4px' }}>
					Please provide the login credentials to continue.
				</Typography>
			</div>
			<Row padding={{ top: 'large' }}>
				<TextField
					label={t('username', 'Username')}
					defaultValue={username}
					disabled={disableInputs}
					onChange={(e) => setUsername(e.target.value)}
					autoComplete="username"
					error={!!authError}
					helperText={authError || <br />}
					fullWidth
					variant="outlined"
					size="large"
					type="text"
				/>

				{/* <Input
					defaultValue={username}
					disabled={disableInputs}
					data-testid="username"
					onChange={(e) => setUsername(e.target.value)}
					hasError={!!authError}
					autocomplete="username"
					label={t('username', 'Username')}
					backgroundColor="gray5"
					CustomIcon={() => domainElement}
				/> */}
			</Row>
			<Row>
				<TextField
					label={t('password', 'Password')}
					defaultValue={password}
					disabled={disableInputs}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="password"
					error={!!authError}
					helperText={authError || <br />}
					fullWidth
					variant="outlined"
					size="large"
					type="password"
				/>
				{/* <PasswordInput
					defaultValue={password}
					disabled={disableInputs}
					data-testid="password"
					onChange={(e) => setPassword(e.target.value)}
					hasError={!!authError}
					autocomplete="password"
					label={t('password', 'Password')}
					backgroundColor="gray5"
				/> */}
			</Row>
			{/* <Text color="error" size="small" overflow="break-word">
				{authError || <br />}
			</Text> */}

			<Typography variant="body2" style={{ color: '#FF6600' }}>
				{authError || <br />}
			</Typography>

			<div style={{ display: 'flex', flexDirection: 'row', rowGap: '20px', alignItems: 'center' }}>
				<div style={{ flex: 1, marginRight: '20px' }}>
					<Button
						loading={loading}
						data-testid="login"
						onClick={submitUserPassword}
						disabled={disableInputs}
						label={t('login', 'Login')}
						width="fill"
					/>
				</div>

				<div style={{ flex: 1, justifyContent: 'flex-end' }}>
					{samlButton}
					{carbonioFeatureResetPasswordEnabled !== false && (
						<Row mainAlignment="flex-start" crossAlignment="flex-start">
							<Text
								onClick={clickForgetPassword}
								color="primary"
								style={{ textDecorationLine: 'underline', cursor: 'pointer' }}
							>
								{t('forget_password', 'Forgot Password?')}
							</Text>
						</Row>
					)}
				</div>
			</div>

			{/* <Row
				orientation="vertical"
				crossAlignment="flex-start"
				padding={{ bottom: 'large', top: 'small' }}
			>
				<Button
					loading={loading}
					data-testid="login"
					onClick={submitUserPassword}
					disabled={disableInputs}
					label={t('login', 'Login')}
					width="fill"
				/>
				
			</Row> */}
			{/* <Row mainAlignment="flex-end" padding={{ bottom: 'extralarge' }}>
			{samlButton}
			</Row> */}
			{/* {carbonioFeatureResetPasswordEnabled !== false && (
				<Row mainAlignment="flex-start" crossAlignment="flex-start">
					<Text
						onClick={clickForgetPassword}
						color="primary"
						style={{ textDecorationLine: 'underline', cursor: 'pointer' }}
					>
						{t('forget_password', 'Forgot Password?')}
					</Text>
				</Row>
			)} */}
		</form>
	);
}
