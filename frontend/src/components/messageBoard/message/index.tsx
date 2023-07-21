import React from 'react';
import {
	Box,
	Text,
} from '@chakra-ui/react';

export default function Message(props: Message) {
	return (
		<Box p='2' marginTop='5' boxShadow={'lg'} rounded='lg' bg={props.author === 'Main User' ? 'blue.400' : 'pink.400'} minWidth={'15vh'}>
			<Text fontSize={'sm'}>{props.content}</Text>
			<Text color='gray.600' fontSize={'xs'}>{props.author}</Text>
			<Text color ='gray.600' fontSize={'xs'}>{(new Date(props.sentOn)).toLocaleString()}</Text>
		</Box>
	);
}

