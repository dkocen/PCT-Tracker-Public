import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {
	SimpleGrid,
	Flex,
	Box,
	Center,
	Button,
} from '@chakra-ui/react';
import NavBar from '../../components/navbar';
import {HomeCard} from '../../components/homeCard';
import LoginModal from '../../components/login';
import {useAppState} from '../../providers/AppStateProvider';
import {getCurrentUserAttributes} from '../../services/authService';

export const Home = () => {
	const [openLoginModal, setOpenLoginModal] = useState(false);
	const {isLoggedIn, setIsLoggedIn, setUserAttributes} = useAppState();
	const navigate = useNavigate();

	useEffect(() => {
		const updateUserState = async () => {
			const userAttr = await getCurrentUserAttributes();
			setIsLoggedIn(userAttr.loggedIn);
			setUserAttributes(userAttr.attributes);
		};

		void updateUserState();
	}, []);

	const onAboutMeClick = () => {
		navigate('/about-me');
	};

	const onPctTrackerClick = () => {
		if (isLoggedIn) {
			navigate('/pct-tracker');
		} else {
			setOpenLoginModal(true);
		}
	};

	const onAboutSiteClick = () => {
		navigate('/about-site');
	};

	return (
		<>
			<NavBar />
			<Center minH='100vh' overflow={'auto'}>
				<SimpleGrid
					justifyItems={'center'}
					spacing='40px'
					m='10'
					minChildWidth={'250px'}
				>
					<HomeCard title='About Me' imagePath='/images/david.jpg' onClick={() => {
						onAboutMeClick();
					}} />
					<HomeCard title='PCT Tracker' imagePath='/images/pct-logo.jpg' onClick={() => {
						onPctTrackerClick();
					}} />
					<HomeCard title='About the Site' imagePath='/images/website.png' onClick={() => {
						onAboutSiteClick();
					}} />
				</SimpleGrid>
				<LoginModal isOpen={openLoginModal} onClose={() => {
					setOpenLoginModal(false);
				}} />
			</Center>
		</>
	);
};
