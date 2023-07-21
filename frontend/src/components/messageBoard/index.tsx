import React, {useState} from 'react';
import {
	Card,
	Stack,
} from '@chakra-ui/react';

import NewMessageForm from './newMessageForm';
import MessageContainer from './messageContainer';

export default function MessageBoard(props: {name: string}) {
	const [refreshMessages, setRefreshMessages] = useState<boolean>(false);

	return (
		<Card align='center' rounded='lg' boxShadow='2xl' bg='gray.200' h={'100%'} >
			<Stack h={'100%'} direction='column' p='3' w='100%'>
				<MessageContainer refreshMessages={refreshMessages} setRefreshMessages={setRefreshMessages}/>
				<NewMessageForm messsengerName={props.name} setRefreshMessages={setRefreshMessages} />
			</Stack>
		</Card>
	);
}

