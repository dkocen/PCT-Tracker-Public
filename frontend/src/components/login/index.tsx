import React from 'react';
import {
	Modal,
	Button,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	Text,
	ModalBody,
} from '@chakra-ui/react';
import {signInUser} from '../../services/authService';

export default function LoginModal(props: LoginModalProps) {
	const handleLogin = async () => {
		await signInUser();
	};

	return (
		<Modal isOpen={props.isOpen} onClose={props.onClose}>
			<ModalOverlay alignItems={'center'} justifyContent={'center'}/>
			<ModalContent>
				<ModalHeader textAlign={'center'}>Login to Access PCT Tracker</ModalHeader>
				<ModalBody>
					<Text>To view the PCT Tracker you must first sign in with Google. This is to avoid spammers/creepy people trying to see my location and posting messages.</Text>
				</ModalBody>
				<Button bg='pink.400' onClick={() => {
					void handleLogin();
				}}>Sign in With Google</Button>
			</ModalContent>
		</Modal>
	);
}
