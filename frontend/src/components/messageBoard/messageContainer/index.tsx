/* eslint-disable react/jsx-key */
import React, {useState, useEffect} from 'react';
import {
	Box,
	VStack,
	Spinner,
} from '@chakra-ui/react';
import Message from '../message';
import {getMessagesHandler} from './handlers/getMessagesHandler';
import AlertWrapper from '../../alert';

export default function MessageContainer(props: MessageContainerProps) {
	const [error, setError] = useState<boolean>(false);
	const [messages, setMessages] = useState<Message[]>();
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	useEffect(() => {
		const loadMessages = async () => {
			const getMessagesResponse = await getMessagesHandler();
			console.log('Messages: ', getMessagesResponse);
			if (getMessagesResponse.status === 200) {
				setMessages(getMessagesResponse.data?.reverse());
			} else {
				setError(true);
			}

			props.setRefreshMessages(false);
			setIsLoaded(true);
		};

		void loadMessages();
	}, [props.refreshMessages]);

	const renderMessages = () => (
		<VStack h={'100%'} display='flex' align='flex-start' justify-='flex-end' spacing={'5'} overflowY={'scroll'} style={{flexDirection: 'column-reverse'}}>
			{messages!.map(message => <Message author={message.author} content={message.content} sentOn={message.sentOn} />)}
		</VStack>
	);

	return (
		<Box height={'100%'} overflowY={'auto'} shadow={'lg'} rounded={'md'} p='5'>
			{error && <AlertWrapper title='An error occurred' message='Unable to load messages. Try again later' status='error'/>}
			{isLoaded ? renderMessages()
				: <Spinner thickness='4px'
					speed='0.65s'
					emptyColor='gray.200'
					color='blue.500'
					size='xl'/>}
		</Box>
	);
}
