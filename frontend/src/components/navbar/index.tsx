import React, {type ReactNode, useEffect, useState} from 'react';
import {
	Box,
	Flex,
	Avatar,
	HStack,
	Link,
	IconButton,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	useDisclosure,
	useColorModeValue,
	Stack,
	Heading,
} from '@chakra-ui/react';
import {HamburgerIcon, CloseIcon} from '@chakra-ui/icons';
import {useAppState} from '../../providers/AppStateProvider';
import {signInUser, signOutUser} from '../../services/authService';

const Links = [
	{name: 'PCT Tracker', route: '/pct-tracker'},
	{name: 'About Me', route: '/about-me'},
	{name: 'About Site', route: '/about-site'},
];
const NavLink = ({children}: {children: {name: string; route: string}}) => (
	<Link
		px={2}
		py={1}
		rounded={'md'}
		_hover={{
			textDecoration: 'none',
			bg: useColorModeValue('gray.200', 'gray.700'),
		}}
		href={children.route}>
		{children.name}
	</Link>
);

export default function NavBar() {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {isLoggedIn, userAttributes} = useAppState();

	const handleSignOut = async () => {
		await signOutUser();
	};

	const handleSignIn = async () => {
		await signInUser();
	};

	const renderAccountButton = () => {
		if (isLoggedIn) {
			return (
				<Menu>
					<MenuButton
						as={Button}
						rounded={'full'}
						variant={'link'}
						cursor={'pointer'}
						minW={0}>
						<Avatar
							size={'sm'}
							fontWeight='bold'
							name={userAttributes![3].Value}
							bg={'pink.400'}
						/>
					</MenuButton>
					<MenuList>
						<MenuItem onClick={() => {
							void handleSignOut();
						}}>Sign Out</MenuItem>
					</MenuList>
				</Menu>
			);
		}

		return (
			<Menu>
				<MenuButton
					as={Button}
					rounded={'full'}
					bg='pink.400'
					cursor={'pointer'}
					minW={0}
					onClick={() => {
						void handleSignIn();
					}}>
					Log In
				</MenuButton>
			</Menu>
		);
	};

	return (
		<Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}
		>
			<Flex h={'6vh'} alignItems={'center'} justifyContent={'space-between'}>
				<IconButton
					size={'md'}
					icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
					aria-label={'Open Menu'}
					display={{md: 'none'}}
					onClick={isOpen ? onClose : onOpen}
				/>
				<HStack spacing={8} alignItems={'center'}>
					<Heading mb={1} as={Link} href='/'>PCT Tracker</Heading>
					<HStack
						as={'nav'}
						spacing={4}
						display={{base: 'none', md: 'flex'}}>
						{Links.map(link => (
							<NavLink key={link.name}>{link}</NavLink>
						))}
					</HStack>
				</HStack>
				<Flex alignItems={'center'}>
					{renderAccountButton()}
				</Flex>
			</Flex>

			{isOpen ? (
				<Box pb={4} display={{md: 'none'}}>
					<Stack as={'nav'} spacing={4}>
						{Links.map(link => (
							<NavLink key={link.name}>{link}</NavLink>
						))}
					</Stack>
				</Box>
			) : null}
		</Box>
	);
}
