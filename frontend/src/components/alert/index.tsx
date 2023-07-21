import * as React from 'react';
import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	type AlertStatus,
} from '@chakra-ui/react';
import {type AlertWrapperProps} from './alert';

export default function AlertWrapper({status, title, message}: AlertWrapperProps) {
	return (
		<Alert
			status={status}
			flexDirection='column'
			alignItems='center'
			justifyContent='center'
			textAlign='center'
			maxHeight={'50%'}
		>
			<AlertIcon boxSize='5vh' />
			<AlertTitle mt={4} mb={1} fontSize='lg'>{title}</AlertTitle>
			<AlertDescription maxWidth='sm'>{message}</AlertDescription>
		</Alert>
	);
}
