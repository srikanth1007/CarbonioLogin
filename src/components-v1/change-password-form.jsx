/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState, useCallback, useEffect } from 'react';

import { Row, Text, Input, Button, PasswordInput } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import {
	ZM_AUTH_TOKEN,
	ZIMBRA_PASSWORD_MAX_LENGTH_ATTR_NAME,
	ZIMBRA_PASSWORD_MIN_LENGTH_ATTR_NAME,
	ZIMBRA_PASSWORD_MIN_LOWERCASE_CHARS_ATTR_NAME,
	ZIMBRA_PASSWORD_MIN_NUMERIC_CHARS_ATTR_NAME,
	ZIMBRA_PASSWORD_MIN_PUNCTUATION_CHARS_ATTR_NAME,
	ZIMBRA_PASSWORD_MIN_UPPERCASE_CHARS_ATTR_NAME,
	INVALID_PASSWORD_ERR_CODE,
	PASSWORD_RECENTLY_USED_ERR_CODE,
	BLOCK_PERSONAL_DATA_IN_PASSWORD_POLICY,
	BLOCK_COMMON_WORDS_IN_PASSWORD_POLICY,
	PASSWORD_LOCKED,
	ZIMBRA_PASSWORD_MIN_DIGITS_OR_PUNCS
} from '../constants';
import { saveCredentials, setCookie } from '../utils';
import { TextField, Typography } from '@mui/material';

export const submitChangePassword = (username, oldPassword, newPassword) => {
	return fetch('/service/soap/ChangePasswordRequest', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'omit',
		body: JSON.stringify({
			Body: {
				ChangePasswordRequest: {
					_jsns: 'urn:zimbraAccount',
					csrfTokenSecured: '1',
					persistAuthTokenCookie: '1',
					account: {
						by: 'name',
						_content: username
					},
					oldPassword: {
						_content: oldPassword
					},
					password: {
						_content: newPassword
					},
					prefs: [{ pref: { name: 'zimbraPrefMailPollingInterval' } }]
				}
			}
		})
	});
};

const ChangePasswordForm = ({ isLoading, setIsLoading, username, configuration }) => {
	const [t] = useTranslation();

	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [showOldPasswordError, setShowOldPasswordError] = useState(false);
	const [errorLabelNewPassword, setErrorLabelNewPassword] = useState(false);
	const [errorLabelConfirmNewPassword, setErrorLabelConfirmNewPassword] = useState('');

	const onChangeOldPassword = useCallback(
		(ev) => setOldPassword(ev.target.value),
		[setOldPassword]
	);
	const onChangeNewPassword = useCallback(
		(ev) => setNewPassword(ev.target.value),
		[setNewPassword]
	);
	const onChangeConfirmNewPassword = useCallback(
		(ev) => setConfirmNewPassword(ev.target.value),
		[setConfirmNewPassword]
	);

	useEffect(() => {
		setErrorLabelNewPassword('');
		setErrorLabelConfirmNewPassword('');
	}, [newPassword, t]);

	useEffect(() => {
		if (newPassword && confirmNewPassword !== newPassword) {
			setErrorLabelConfirmNewPassword(
				t('changePassword_error_confirmPassword', 'Confirm password not valid')
			);
		} else {
			setErrorLabelConfirmNewPassword('');
		}
	}, [confirmNewPassword, newPassword, t]);

	const submitChangePasswordCb = useCallback(
		(e) => {
			e.preventDefault();
			setIsLoading(true);
			if (newPassword && confirmNewPassword === newPassword && !errorLabelNewPassword) {
				submitChangePassword(username, oldPassword, newPassword)
					.then(async (res) => {
						let payload;
						try {
							payload = await res.json();
						} catch (err) {
							payload = await res;
						}
						if (res.status === 200) {
							const authTokenArr = payload?.Body?.ChangePasswordResponse?.authToken;
							const authToken =
								authTokenArr && authTokenArr.length > 0 ? authTokenArr[0]._content : undefined;
							if (authToken) {
								setCookie(ZM_AUTH_TOKEN, authToken);
							}
						}
						switch (res.status) {
							case 200:
								await saveCredentials(username, newPassword);
								window.location.assign(configuration.destinationUrl);
								break;
							case 401:
							case 422:
								if (payload?.Body?.Fault?.Detail?.Error?.Code === INVALID_PASSWORD_ERR_CODE) {
									setShowOldPasswordError(false);
									const { a } = payload.Body.Fault.Detail.Error;
									let currNum = a
										? a.find((rec) => rec.n === BLOCK_COMMON_WORDS_IN_PASSWORD_POLICY)
										: undefined;
									if (currNum) {
										setErrorLabelNewPassword(
											t('changePassword_error_block_common_words', {
												defaultValue:
													'Invalid password: password is known to be too common: {{str}}',
												replace: { str: currNum._content }
											})
										);
										break;
									}
									currNum = a
										? a.find((rec) => rec.n === BLOCK_PERSONAL_DATA_IN_PASSWORD_POLICY)
										: undefined;
									if (currNum) {
										setErrorLabelNewPassword(
											t('changePassword_error_block_personal_data', {
												defaultValue:
													'Invalid password: password contains username or other personal data: {{str}}',
												replace: { str: currNum._content }
											})
										);
										break;
									}
									currNum = a
										? a.find((rec) => rec.n === ZIMBRA_PASSWORD_MAX_LENGTH_ATTR_NAME)
										: undefined;
									if (currNum) {
										setErrorLabelNewPassword(
											t('changePassword_error_maxLength', {
												defaultValue: 'Maximum length is {{num}} characters',
												replace: { num: currNum._content }
											})
										);
										break;
									}

									currNum = a
										? a.find((rec) => rec.n === ZIMBRA_PASSWORD_MIN_LENGTH_ATTR_NAME)
										: undefined;
									if (currNum) {
										setErrorLabelNewPassword(
											t('changePassword_error_minLength', {
												defaultValue: 'Minimum length is {{num}} characters',
												replace: { num: currNum._content }
											})
										);
										break;
									}

									currNum = a
										? a.find((rec) => rec.n === ZIMBRA_PASSWORD_MIN_LOWERCASE_CHARS_ATTR_NAME)
										: undefined;
									if (currNum) {
										setErrorLabelNewPassword(
											t('changePassword_error_minLowerCaseChars', {
												defaultValue: 'Expecting at least {{num}} lowercase characters',
												replace: { num: currNum._content }
											})
										);
										break;
									}
									currNum = a
										? a.find((rec) => rec.n === ZIMBRA_PASSWORD_MIN_NUMERIC_CHARS_ATTR_NAME)
										: undefined;
									if (currNum) {
										setErrorLabelNewPassword(
											t('changePassword_error_minNumericChars', {
												defaultValue: 'Expecting at least {{num}} numeric characters',
												replace: { num: currNum._content }
											})
										);
										break;
									}
									currNum = a
										? a.find((rec) => rec.n === ZIMBRA_PASSWORD_MIN_PUNCTUATION_CHARS_ATTR_NAME)
										: undefined;
									if (currNum) {
										setErrorLabelNewPassword(
											t('changePassword_error_minPunctuationChars', {
												defaultValue: 'Expecting at least {{num}} punctuation characters',
												replace: { num: currNum._content }
											})
										);
										break;
									}
									currNum = a
										? a.find((rec) => rec.n === ZIMBRA_PASSWORD_MIN_UPPERCASE_CHARS_ATTR_NAME)
										: undefined;
									if (currNum) {
										setErrorLabelNewPassword(
											t('changePassword_error_minUppercaseChars', {
												defaultValue: 'Expecting at least {{num}} uppercase characters',
												replace: { num: currNum._content }
											})
										);
									}
									currNum = a
										? a.find((rec) => rec.n === ZIMBRA_PASSWORD_MIN_DIGITS_OR_PUNCS)
										: undefined;
									if (currNum) {
										setErrorLabelNewPassword(
											t('changePassword_error_minDigitsOrPuncs', {
												defaultValue:
													'Expecting at least {{num}} numeric or punctuation characters',
												replace: { num: currNum._content }
											})
										);
									}
								} else if (payload?.Body?.Fault?.Detail?.Error?.Code === PASSWORD_LOCKED) {
									setShowOldPasswordError(false);
									setErrorLabelNewPassword(
										t('changePassword_error_passwordLocked', {
											defaultValue: "Password is locked and can't be changed"
										})
									);
								} else if (
									payload?.Body?.Fault?.Detail?.Error?.Code === PASSWORD_RECENTLY_USED_ERR_CODE
								) {
									setShowOldPasswordError(false);
									setErrorLabelNewPassword(
										t('changePassword_error_passwordRecentlyUsed', {
											defaultValue: 'Password recently used'
										})
									);
								} else {
									setShowOldPasswordError(true);
									setErrorLabelNewPassword('');
								}
								break;
							case 502:
								setShowOldPasswordError(false);
								setErrorLabelNewPassword(
									t('server_unreachable', 'Error 502: Service Unreachable - Retry later.')
								);
								setIsLoading(false);
								break;
							default:
								setShowOldPasswordError(false);
								setErrorLabelNewPassword(
									t(
										'something_went_wrong',
										'Something went wrong. Please contact your administrator.'
									)
								);
								setIsLoading(false);
						}
					})
					.catch((err) => {
						setIsLoading(false);
						if (err.message.startsWith('authentication failed')) {
							setShowOldPasswordError(true);
							setErrorLabelNewPassword('');
						}
					});
			}
			setIsLoading(false);
		},
		[
			t,
			setIsLoading,
			newPassword,
			confirmNewPassword,
			errorLabelNewPassword,
			username,
			oldPassword,
			configuration.destinationUrl
		]
	);

	return (
		<form onSubmit={submitChangePasswordCb} style={{ width: '100%', height: '100%' }}>
			<input type="submit" style={{ display: 'none' }} />

			{/* <Row padding={{ bottom: 'large' }}>
				<Text size="large" color="text" weight="bold">
					{t('changePassword_title', 'Create a new password')}
				</Text>
			</Row> */}

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
					{t('changePassword_title', 'Create a new password')}
				</Typography>
				<Typography variant="body1" style={{ textAlign: 'start', marginTop: '4px' }}>
					Remember the new password for further login.
				</Typography>
			</div>
			{/* <Row padding={{ top: 'large' }}>
				<Input defaultValue={username} disabled label="Email" data-testid="email" />
			</Row> */}
			<Row padding={{ top: 'large', width: '100%' }}>
				<TextField
					defaultValue={username}
					disabled
					label={t('username', 'Username')}
					data-testid="username"
					fullWidth
				/>
			</Row>

			<Row padding={{ top: 'large', width: '100%' }}>
				<TextField
					fullWidth
					defaultValue={oldPassword}
					error={showOldPasswordError}
					onChange={onChangeOldPassword}
					label={t('changePassword_oldPassword', 'Old password')}
					data-testid="oldPassword"
				/>

				{/* <PasswordInput
					defaultValue={oldPassword}
					hasError={showOldPasswordError}
					onChange={onChangeOldPassword}
					label={t('changePassword_oldPassword', 'Old password')}
					backgroundColor="gray5"
					data-testid="oldPassword"
				/> */}
			</Row>
			{showOldPasswordError && (
				<Row padding={{ top: 'small' }} mainAlignment="flex-start">
					{/* <Text color="error" size="small" overflow="break-word">
						{t('wrong_password', 'Wrong password, please check data and try again')}
					</Text> */}
					<Typography variant="body2" style={{ color: '#FF6600' }}>
						{t('wrong_password', 'Wrong password, please check data and try again')}
					</Typography>
				</Row>
			)}
			<Row padding={{ top: 'large', width: '100%' }}>
				{/* <PasswordInput
					defaultValue={newPassword}
					hasError={errorLabelNewPassword}
					onChange={onChangeNewPassword}
					label={t('changePassword_newPassword', 'New password')}
					backgroundColor="gray5"
					data-testid="newPassword"
				/> */}

				<TextField
					fullWidth
					defaultValue={newPassword}
					error={errorLabelNewPassword}
					onChange={onChangeNewPassword}
					label={t('changePassword_newPassword', 'New password')}
					data-testid="newPassword"
				/>
			</Row>
			{errorLabelNewPassword && (
				<Row padding={{ top: 'small' }} mainAlignment="flex-start">
					{/* <Text color="error" size="small" overflow="break-word">
						{errorLabelNewPassword}
					</Text> */}
					<Typography variant="body2" style={{ color: '#FF6600' }}>
						{errorLabelNewPassword}
					</Typography>
				</Row>
			)}
			<Row padding={{ top: 'large', width: '100%' }}>
				{/* <PasswordInput
					defaultValue={confirmNewPassword}
					hasError={errorLabelConfirmNewPassword}
					onChange={onChangeConfirmNewPassword}
					label={t('changePassword_confirmNewPassword', 'Confirm new password')}
					backgroundColor="gray5"
					data-testid="confirmNewPassword"
				/> */}

				<TextField
					fullWidth
					defaultValue={confirmNewPassword}
					error={errorLabelConfirmNewPassword}
					onChange={onChangeConfirmNewPassword}
					label={t('changePassword_confirmNewPassword', 'Confirm new password')}
					data-testid="confirmNewPassword"
				/>
			</Row>
			{errorLabelConfirmNewPassword && (
				<Row padding={{ top: 'extrasmall' }} mainAlignment="flex-start">
					{/* <Text color="error" size="small" overflow="break-word">
						{errorLabelConfirmNewPassword}
					</Text> */}

					<Typography variant="body2" style={{ color: '#FF6600' }}>
						{errorLabelConfirmNewPassword}
					</Typography>
				</Row>
			)}
			<Row orientation="vertical" crossAlignment="flex-start" padding={{ vertical: 'large' }}>
				<Button
					onClick={submitChangePasswordCb}
					label={t('changePassword_confirm_label', 'Change password and login')}
					width="fill"
					loading={isLoading}
					disabled={!newPassword || confirmNewPassword !== newPassword || errorLabelNewPassword}
					data-testid="submitChangePasswordBtn"
				/>
			</Row>
		</form>
	);
};

export default ChangePasswordForm;
