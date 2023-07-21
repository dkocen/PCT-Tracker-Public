import React, {useEffect, useState} from 'react';
import {
	Grid,
	GridItem,
	Spinner,
	Text,
	Center,
	Box,
	Link,
} from '@chakra-ui/react';
import TrackerCard from '../../components/tracker';
import MessageBoard from '../../components/messageBoard';
import PhotoGallery from '../../components/photoGallery';
import NavBar from '../../components/navbar';
import {useAppState} from '../../providers/AppStateProvider';
import {getCurrentUserAttributes} from '../../services/authService';
import LoginModal from '../../components/login';

export const PctTracker = () => {
	const {isLoggedIn, setIsLoggedIn, userAttributes, setUserAttributes} = useAppState();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const updateUserState = async () => {
			const userAttr = await getCurrentUserAttributes();
			setIsLoggedIn(userAttr.loggedIn);
			setUserAttributes(userAttr.attributes);
			setIsOpen(!userAttr.loggedIn);
		};

		void updateUserState();
	}, []);

	const renderTrackerPage = () => (
		<>
			<NavBar />
			<Grid
				templateColumns={{base: 'repeat(3, 1fr)'}}
				templateRows={{base: 'repeat(3, 1fr)', md: 'repeat(2, 1fr)'}}
				marginLeft={{lg: '5%'}}
				marginRight={{lg: '5%'}}
			>
				<GridItem
					colSpan={{base: 3, md: 3, lg: 2}}
					rowSpan={{base: 3, md: 1, lg: 2}}
					p='5'
					minH={{base: '94vh', md: '47vh', lg: '47vh'}}
					maxH='94vh'
				>
					<TrackerCard />
				</GridItem>
				<GridItem
					colSpan={{base: 3, md: 1, lg: 1}}
					rowSpan={{base: 3, md: 1, lg: 1}}
					p='5'
					minH='47vh'
					maxH={{base: '100vh', md: '47vh'}}
				>
					<MessageBoard name={userAttributes![3].Value}/>
				</GridItem>
				<GridItem
					colSpan={{base: 3, md: 2, lg: 1}}
					rowSpan={{base: 3, md: 1, lg: 1}}
					p='5'
					maxH={{base: '100vh', md: '47vh'}}
				>
					<PhotoGallery />
				</GridItem>
			</Grid>
		</>
	);

	return (
		<>
			<LoginModal isOpen={isOpen} onClose={() => {
				setIsOpen(false);
			}} />
			{isLoggedIn ? renderTrackerPage() : (
				<Box w={'100vw'} h={'100vh'} >
					<Center h='100vh'>
						<Spinner p={5} m={5}/>
						<Text color={'white'}>Please make sure you are logged in before accessing the tracker. Return to the {<Link color={'blue.200'} href='/'>home page</Link>}.</Text>
					</Center>
				</Box>
			)}
		</>
	);
};
