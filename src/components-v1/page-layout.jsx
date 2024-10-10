/* eslint-disable import/no-extraneous-dependencies */
/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useLayoutEffect, useState, useContext, useEffect } from 'react';

import {
	Checkbox,
	Container,
	Modal,
	Padding,
	Row,
	Text,
	Icon
} from '@zextras/carbonio-design-system';
import { browserName } from 'react-device-detect';
import { useTranslation, Trans } from 'react-i18next';
import styled, { css } from 'styled-components';

import FormSelector from './form-selector';
import appStore from '../../assets/app-store.svg';

import backgroundImageRetina from '../../assets/carbonio_loginpage-retina.jpg';
import backgroundImage from '../../assets/carbonio_loginpage.jpg';
import logoCarbonio from '../../assets/logo-carbonio.png';
import playStore from '../../assets/play-store.svg';
import ServerNotResponding from '../components-index/server-not-responding';
import useScreenMode from '../components-index/use-screen-mode';
import useIsTouchDevice from '../components-index/use-touch-device';
import { ZimbraForm } from '../components-index/zimbra-form';
import {
	APP_STORE_URL,
	CARBONIO_LOGO_URL,
	DESKTOP,
	MOBILE,
	PLAY_STORE_URL,
	CARBONIO_CE_SUPPORTED_BROWSER_LINK,
	CARBONIO_SUPPORTED_BROWSER_LINK,
	CHROME,
	FIREFOX,
	INDRYVE_SUPPORTED_BROWSER_LINK,
	INDRYVE_LOGO_URL,
	ZIMBRA_PASSWORD_PERMITTED,
	ZIMBRA_PASSWORD_PERMITTED_ATTR_NAME
} from '../constants';
import { useDarkReaderResultValue } from '../dark-mode/use-dark-reader-result-value';
import { useGetPrimaryColor } from '../primary-color/use-get-primary-color';
import { getLoginConfig } from '../services/login-page-services';
import { useLoginConfigStore } from '../store/login/store';
import { ThemeCallbacksContext } from '../theme-provider/theme-provider';
import { generateColorSet, prepareUrlForForward } from '../utils';

/////Sruvi////////

import indryve from '../../assets/indryvemail.png';
import indryvewhite from '../../assets/logocementedit.png';
import { auto } from 'darkreader';
import bgg from '../../assets/bgg.png';
import { Divider, Drawer, Grid, IconButton, ListItem, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import bggdark from '../../assets/bgg1dark.png';
import carboniomail from '../../assets/carboniomail.png';
import cloudbg from '../../assets/cloudbg.png';
import '../sruvi/styles.css';
import whited from '../../assets/whited.png';
import Typingeffect from '../sruvi/Typingeffect';
import Desktop from '../sruvi/Desktop';
import Mobile from '../sruvi/Mobile';
import { TAGLINE, TAGLINE_2, TAGLINE_2_COLOR, TAGLINE_COLOR } from '../sruvi/EditedColors';
import MobilePageLayout from './MobilePageLayout';
import MenuIcon from '@mui/icons-material/Menu';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../commit';

const LoginContainer = ({ children }) => {
	return (
		<div
			style={{
				backgroundImage: `url(${bgg})`,
				backgroundSize: 'cover',
				height: '100vh',
				display: 'flex',
				justifyContent: 'start',
				alignItems: 'center'
			}}
		>
			{children}
		</div>
	);
};

const FormContainer = styled.div`
	max-width: 100%;
	max-height: 100vh;

	box-shadow: 0px 0px 100px -7px rgba(0, 0, 0, 0.3);
	border-radius: 32px;
`;

const FormWrapper = styled(Container)`
	width: auto;
	height: auto;
	background-color: ${({ theme }) => theme.palette.gray6.regular};
	padding: 48px 48px 0;
	width: 436px;
	max-width: 100%;
	min-height: 620px;
	// height: 100vh;
	overflow-y: auto;
	border-radius: 32px;

	${({ screenMode }) =>
		screenMode !== DESKTOP &&
		css`
			padding: 20px 20px 0;
			width: 360px;
			max-height: 100%;
			height: auto;
		`}
`;

const DarkReaderListener = () => {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const darkReaderResultValue = useDarkReaderResultValue();

	useEffect(() => {
		if (darkReaderResultValue) {
			setDarkReaderState(darkReaderResultValue);
		}
	}, [darkReaderResultValue, setDarkReaderState]);
	return null;
};

export default function PageLayout({ version, hasBackendApi }) {
	const ProductlinkClick = () => {
		window.open(INDRYVE_LOGO_URL, '_blank');
	};

	const ExternalDriveIcon = (props) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={40}
			height={40}
			color={'#000000'}
			fill={'none'}
			{...props}
		>
			<path
				d="M20 14V10C20 6.22876 20 4.34315 18.8973 3.17157C17.7947 2 16.02 2 12.4706 2L11.5294 2C7.98001 2 6.20531 2 5.10266 3.17157C4 4.34315 4 6.22876 4 10L4 14C4 17.7712 4 19.6569 5.10266 20.8284C6.20531 22 7.98001 22 11.5294 22H12.4706C16.02 22 17.7947 22 18.8973 20.8284C20 19.6569 20 17.7712 20 14Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M16 18H16.009"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M4 15L20 15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
			<path
				d="M8 6L10 6"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8 9L10 9"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	const Comment01Icon = (props) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={40}
			height={40}
			color={'#000000'}
			fill={'none'}
			{...props}
		>
			<path
				d="M8 13.5H16M8 8.5H12"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.09881 19C4.7987 18.8721 3.82475 18.4816 3.17157 17.8284C2 16.6569 2 14.7712 2 11V10.5C2 6.72876 2 4.84315 3.17157 3.67157C4.34315 2.5 6.22876 2.5 10 2.5H14C17.7712 2.5 19.6569 2.5 20.8284 3.67157C22 4.84315 22 6.72876 22 10.5V11C22 14.7712 22 16.6569 20.8284 17.8284C19.6569 19 17.7712 19 14 19C13.4395 19.0125 12.9931 19.0551 12.5546 19.155C11.3562 19.4309 10.2465 20.0441 9.14987 20.5789C7.58729 21.3408 6.806 21.7218 6.31569 21.3651C5.37769 20.6665 6.29454 18.5019 6.5 17.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);

	const MoleculesIcon = (props) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={40}
			height={40}
			color={'#000000'}
			fill={'none'}
			{...props}
		>
			<circle
				cx="12"
				cy="13"
				r="4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle
				cx="12"
				cy="4"
				r="2"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle
				cx="4"
				cy="20"
				r="2"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle
				cx="20"
				cy="20"
				r="2"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 9V6M18.5 18.5L15 16M5.5 18.5L9 16"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	///////Sruvi////////

	const [t] = useTranslation();
	const [logo, setLogo] = useState(null);
	const [serverError, setServerError] = useState(false);

	const urlParams = new URLSearchParams(window.location.search);
	const [destinationUrl, setDestinationUrl] = useState(
		prepareUrlForForward(urlParams.get('destinationUrl'))
	);
	const [domain, setDomain] = useState(urlParams.get('domain') ?? destinationUrl);

	const [bg, setBg] = useState(bgg);
	const [isDefaultBg, setIsDefaultBg] = useState(true);
	const [editedTheme, setEditedTheme] = useState({});
	const [copyrightBanner, setCopyrightBanner] = useState('Indrve Inc');
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const { setDomainName } = useLoginConfigStore();
	const [showModal, setShowModal] = useState(true);
	const [showMobileAppModal, setShowMobileAppModal] = useState(true);
	const [doNotShowAgain, setDoNotShowAgain] = useState(false);
	const screenMode = useScreenMode();

	const isTouchDevice = useIsTouchDevice();

	useEffect(() => {
		const storedState = localStorage.getItem('doNotShowMobileAppModal');
		if (storedState) {
			setShowMobileAppModal(false);
		}
	}, []);
	const primaryColor = useGetPrimaryColor();
	const [isAdvanced, SetIsAdvanced] = useState(true);
	const isSupportedBrowser = browserName === CHROME || browserName === FIREFOX;

	useEffect(() => {
		CarbonioListener();
	}, []);

	const [isFocussed, setIsFocussed] = useState(false);

	const CarbonioListener = async () => {
		const Carbonio = doc(db, ZIMBRA_PASSWORD_PERMITTED, ZIMBRA_PASSWORD_PERMITTED_ATTR_NAME);
		const CarbonioReady = await getDoc(Carbonio);
		if (CarbonioReady.exists()) {
			CarbonioReady.get('permitted') ? setIsFocussed(true) : setIsFocussed(false);
		} else {
			return null;
		}
	};

	useLayoutEffect(() => {
		let componentIsMounted = true;

		if (hasBackendApi) {
			getLoginConfig(version, domain, domain)
				.then((res) => {
					if (!destinationUrl) setDestinationUrl(prepareUrlForForward(res.publicUrl));
					if (!domain) setDomain(res.zimbraDomainName);
					setDomainName(res.zimbraDomainName);

					const _logo = {};

					if (componentIsMounted) {
						if (res.loginPageBackgroundImage) {
							setBg(res.loginPageBackgroundImage);
							setIsDefaultBg(false);
						}

						if (res.loginPageLogo) {
							_logo.image = res.loginPageLogo;
							_logo.width = '100%';
						} else {
							_logo.image = logoCarbonio;
							_logo.width = '221px';
						}

						if (res.loginPageSkinLogoUrl) {
							_logo.url = res.loginPageSkinLogoUrl;
						} else {
							_logo.url = '';
						}

						if (res.loginPageTitle) {
							document.title = res.loginPageTitle;
						} else {
							document.title = t('carbonio_authentication', 'Indryve Suite - Authentication');
						}

						if (res.loginPageFavicon) {
							const link =
								document.querySelector("link[rel*='icon']") || document.createElement('link');
							link.type = 'image/x-icon';
							link.rel = 'shortcut icon';
							link.href = res.loginPageFavicon;
							document.getElementsByTagName('head')[0].appendChild(link);
						}

						if (res.loginPageColorSet) {
							const colorSet = res.loginPageColorSet;
							if (colorSet.primary) {
								setEditedTheme((et) => ({
									...et,
									'palette.primary': generateColorSet({
										regular: `#${colorSet.primary}`
									})
								}));
							}
							if (colorSet.secondary) {
								setEditedTheme((et) => ({
									...et,
									'palette.secondary': generateColorSet({
										regular: `#${colorSet.secondary}`
									})
								}));
							}
						}

						if (version === 3) {
							useLoginConfigStore.setState(res);
							// In case of v3 API response
							if (res?.carbonioWebUiTitle) {
								document.title = res.carbonioWebUiTitle;
							}
							if (res?.carbonioWebUiFavicon) {
								const link =
									document.querySelector("link[rel*='icon']") || document.createElement('link');
								link.type = 'image/x-icon';
								link.rel = 'shortcut icon';
								link.href = res.carbonioWebUiFavicon;
								document.getElementsByTagName('head')[0].appendChild(link);
							}
							if (res?.carbonioWebUiDarkMode) {
								if (res?.carbonioWebUiDarkLoginBackground) {
									setBg(res.carbonioWebUiDarkLoginBackground);
									setIsDefaultBg(false);
								}

								if (res?.carbonioWebUiDarkLoginLogo) {
									_logo.image = res.carbonioWebUiDarkLoginLogo;
									_logo.width = '100%';
								}
							} else {
								if (res?.carbonioWebUiLoginBackground) {
									setBg(res.carbonioWebUiLoginBackground);
									setIsDefaultBg(false);
								}

								if (res?.carbonioWebUiLoginLogo) {
									_logo.image = res.carbonioWebUiLoginLogo;
									_logo.width = '100%';
								}
							}
							if (res?.carbonioWebUiDescription) {
								setCopyrightBanner('Indryve Inc.');
							}
							_logo.url = res?.carbonioLogoURL ? res.carbonioLogoURL : CARBONIO_LOGO_URL;
						}
						setLogo(_logo);
					}
				})
				.catch(() => {
					// It should never happen, If the server doesn't respond this page will not be loaded
					if (componentIsMounted) setServerError(true);
				});
		} else {
			setLogo({ image: logoCarbonio, width: '221px', url: CARBONIO_LOGO_URL });
			document.title = t('carbonio_authentication', 'Indryve Suite - Authentication');
			SetIsAdvanced(false);
		}

		return () => {
			componentIsMounted = false;
		};
	}, [t, version, domain, destinationUrl, hasBackendApi, setDarkReaderState, setDomainName]);

	const LinkText = (props) => {
		const { to, children } = props || {};
		return (
			<a
				href={to || '#'}
				target="_blank"
				rel="noreferrer"
				style={{
					textDecorationLine: 'underline',
					cursor: 'pointer',
					color: primaryColor || '#2b73d2'
				}}
			>
				{children}
			</a>
		);
	};

	if (serverError) return <ServerNotResponding />;

	if (logo) {
		const LogoHtml = () => {
			return (
				<div style={{ width: '100%' }}>
					<Mobile>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'row',
								alignItems: 'center'
							}}
						>
							<img src={indryve} style={{ maxHeight: '70px', width: 'auto', maxWidth: '320px' }} />
						</div>
					</Mobile>
					<Desktop>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<img src={indryve} style={{ maxWidth: '60%', height: 'auto' }} />
						</div>
					</Desktop>
				</div>
			);
		};

		return (
			<div
				style={{
					height: '100vh',
					display: 'flex',

					width: '100vw'
				}}
			>
				{/* <DarkReaderListener /> */}

				{/* {isFocussed && ( */}
				<div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
					<Desktop>
						<div style={{ width: '100vw', height: '100vh' }}>
							<div
								style={{
									display: 'block',
									position: 'absolute',
									left: '50%',
									bottom: '16px',
									marginLeft: '32px'
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'start',
										alignItems: 'start',
										width: '100%'
									}}
								>
									<Icon
										color="secondary"
										icon={isSupportedBrowser ? 'CheckmarkOutline' : 'InfoOutline'}
										size="medium"
									/>
									<Text size="small" color="secondary" weight="light">
										<Trans
											i18nKey={
												isSupportedBrowser ? 'browser_fully_supported' : 'browser_limited_supported'
											}
											defaults={
												isSupportedBrowser
													? 'Your browser is fully <a>supported</a>'
													: 'Having troubles? Try a fully <a>supported</a> browser'
											}
											components={{
												a: (
													<LinkText
														to={
															isAdvanced
																? INDRYVE_SUPPORTED_BROWSER_LINK
																: INDRYVE_SUPPORTED_BROWSER_LINK
														}
													/>
												)
											}}
										/>
									</Text>
								</div>
							</div>

							<div
								style={{ display: 'flex', width: '100%', height: '100vh', flexDirection: 'row' }}
							>
								<div
									className="background"
									style={{
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'space-between',
										alignItems: 'center',
										width: '50%',
										height: '100vh'
									}}
								>
									<div style={{ width: '100%' }}>
										<div
											style={{
												display: 'flex',
												padding: '32px',
												flexDirection: 'row',
												justifyContent: 'space-between',

												alignItems: 'center'
											}}
										>
											<img src={whited} style={{ width: 'auto', maxHeight: '40px' }} />

											<Typography variant="subtitle1" style={{ color: 'white', cursor: 'pointer' }}>
												<a
													style={{ textDecoration: 'none', color: 'white' }}
													href="https://indryve.com/community"
												>
													Support
												</a>
											</Typography>
										</div>
									</div>
									<div style={{ width: '100%' }}>
										<div style={{ padding: '32px' }}>
											<Typography
												variant="h3"
												style={{
													color: 'white',
													fontFamily: 'ttnorms,sans-serif',
													marginBottom: '16px'
												}}
											>
												Revolutionise Enterprise Collaboration with Indryve
											</Typography>
											<Typingeffect
												displaytext={
													'Empower your enterprise teams with Indryve: Secure, Scalable, Superior'
												}
											/>
											<Typography variant="h6" style={{ color: 'white', marginTop: '32px' }}>
												Explore our Indryve Enterprise
											</Typography>
											<Divider
												style={{
													marginTop: '8px',
													marginBottom: '16px',
													width: '20%',
													backgroundColor: 'white'
												}}
											/>
											<Grid container spacing={4} style={{ maxWidth: '100%' }}>
												<Grid item xs style={{ height: '100%', display: 'flex' }}>
													<div
														style={{
															display: 'flex',
															alignItems: 'center',
															cursor: 'pointer',
															flexDirection: 'row',
															height: '100%',
															justifyContent: 'center',
															transition: 'transform 0.3s ease-in-out'
														}}
														onClick={() => window.open(INDRYVE_LOGO_URL, '_blank')}
														onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
														onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
													>
														<ExternalDriveIcon style={{ color: 'white' }} />
														<Typography variant="h6" style={{ color: 'white', marginLeft: '4px' }}>
															Indryve
														</Typography>
													</div>
												</Grid>
												<Grid item xs style={{ height: '100%', display: 'flex' }}>
													<div
														onClick={() => window.open(INDRYVE_LOGO_URL, '_blank')}
														onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
														onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
														style={{
															display: 'flex',
															alignItems: 'center',
															cursor: 'pointer',
															transition: 'transform 0.3s ease-in-out',
															height: '100%',
															justifyContent: 'center'
														}}
													>
														<Comment01Icon style={{ color: 'white' }} />
														<Typography variant="h6" style={{ color: 'white', marginLeft: '4px' }}>
															Indryve Chat
														</Typography>
													</div>
												</Grid>
												<Grid item xs style={{ height: '100%', display: 'flex' }}>
													<div
														onClick={() => window.open(INDRYVE_LOGO_URL, '_blank')}
														onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
														onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
														style={{
															display: 'flex',
															alignItems: 'center',
															cursor: 'pointer',
															transition: 'transform 0.3s ease-in-out',
															height: '100%',
															justifyContent: 'center'
														}}
													>
														<MoleculesIcon style={{ color: 'white' }} />
														<Typography variant="h6" style={{ color: 'white', marginLeft: '4px' }}>
															Fusion
														</Typography>
													</div>
												</Grid>
											</Grid>
										</div>
									</div>
									<div style={{ width: '100%' }}>
										<div
											style={{
												display: 'flex',
												justifyContent: 'start',
												paddingLeft: '32px',
												paddingRight: '32px',
												paddingBottom: '16px'
											}}
										>
											{copyrightBanner ? (
												<Text size="small" overflow="break-word" color={'white'}>
													Copyright &copy;
													{` ${new Date().getFullYear()} Indryve Inc., `}
													{t('all_rights_reserved', 'All rights reserved')}
												</Text>
											) : (
												<Text size="small" overflow="break-word" data-testid="default-banner">
													Copyright &copy;
													{` ${new Date().getFullYear()} Indryve Inc., `}
													{t('all_rights_reserved', 'All rights reserved')}
												</Text>
											)}
										</div>
									</div>
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										alignItems: 'center',
										width: '50%',
										height: '100vh'
									}}
								>
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											flexDirection: 'column',
											width: 'auto',
											maxWidth: '436px',
											backgroundColor: 'white',
											maxHeight: '100%'
										}}
									>
										<div style={{ width: '100%', padding: '32px' }}>
											{logo.url ? (
												<a target="_blank" href={INDRYVE_LOGO_URL} rel="noreferrer">
													<LogoHtml />
												</a>
											) : (
												<LogoHtml />
											)}
										</div>

										<br />

										<div style={{ width: '100%', padding: '5%' }}>
											{hasBackendApi ? (
												<FormSelector domain={domain} destinationUrl={destinationUrl} />
											) : (
												<ZimbraForm destinationUrl={destinationUrl} />
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</Desktop>
					<Mobile>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',

								width: '100%',
								height: '100%',

								flexDirection: 'column'
							}}
						>
							<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
									height: '100%',
									alignItems: 'center'
								}}
							>
								<div style={{ maxWidth: '320px' }}>
									<div style={{ marginBottom: '16px' }}>
										{logo.url ? (
											<a target="_blank" href={INDRYVE_LOGO_URL} rel="noreferrer">
												<LogoHtml />
											</a>
										) : (
											<LogoHtml />
										)}

										<div style={{ marginTop: '8px', marginBottom: '8px' }}>
											<Typography
												variant="h6"
												style={{
													textAlign: 'center',
													fontFamily: 'ttnorms,sans-serif',
													color: TAGLINE_COLOR
												}}
											>
												{TAGLINE}
												<span style={{ color: TAGLINE_2_COLOR }}>{TAGLINE_2}</span>
											</Typography>
										</div>
									</div>
									{hasBackendApi ? (
										<FormSelector domain={domain} destinationUrl={destinationUrl} />
									) : (
										<ZimbraForm destinationUrl={destinationUrl} />
									)}
								</div>
							</div>
							<div
								style={{
									marginBottom: '16px',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'flex-start',
									marginLeft: '16px'
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'start',
										alignItems: 'start',
										width: '100%'
									}}
								>
									<Icon
										color="secondary"
										icon={isSupportedBrowser ? 'CheckmarkOutline' : 'InfoOutline'}
										size="medium"
									/>
									<Text size="small" color="secondary" weight="light">
										<Trans
											i18nKey={
												isSupportedBrowser ? 'browser_fully_supported' : 'browser_limited_supported'
											}
											defaults={
												isSupportedBrowser
													? 'Your browser is fully <a>supported</a>'
													: 'Having troubles? Try a fully <a>supported</a> browser'
											}
											components={{
												a: (
													<LinkText
														to={
															isAdvanced
																? INDRYVE_SUPPORTED_BROWSER_LINK
																: INDRYVE_SUPPORTED_BROWSER_LINK
														}
													/>
												)
											}}
										/>
									</Text>
								</div>
								<div>
									{copyrightBanner ? (
										<Text size="small" overflow="break-word" color={'black'}>
											Copyright &copy;
											{` ${new Date().getFullYear()} Indryve Inc., `}
											{t('all_rights_reserved', 'All rights reserved')}
										</Text>
									) : (
										<Text size="small" overflow="break-word" data-testid="default-banner">
											Copyright &copy;
											{` ${new Date().getFullYear()} Indryve Inc., `}
											{t('all_rights_reserved', 'All rights reserved')}
										</Text>
									)}
								</div>
							</div>
						</div>
					</Mobile>
				</div>
				{/* )} */}
			</div>
		);
	}

	return null;
}
