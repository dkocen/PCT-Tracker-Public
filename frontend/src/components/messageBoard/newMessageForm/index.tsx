import React, {useState} from 'react';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	useToast,
} from '@chakra-ui/react';
import {ChatIcon} from '@chakra-ui/icons';
import {submitMessage} from './handlers/SubmitMessageHandler';

export default function NewMessageForm(props: NewMessageFormProps) {
	const [contentInput, setContentInput] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState<boolean>();
	const toast = useToast();

	const invalidContent = contentInput === '';

	const handleNewMessage = async () => {
		setIsSubmitting(true);
		const newMessage: {content: string; author: string} = {
			content: contentInput,
			author: props.messsengerName,
		};

		const response = await submitMessage(newMessage);
		if (response === 200) {
			toast({
				title: 'Message submitted',
				description: 'Your message has been received :D',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			props.setRefreshMessages(true);
		} else {
			toast({
				title: 'Message failed to submit',
				description: 'Your message was not received D: This is likely a bug with the website',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}

		setContentInput('');
		setIsSubmitting(false);
	};

	const handleContentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setContentInput(e.target.value);
	};

	return (
		<Box boxShadow={'xl'} rounded='lg' width='100%' paddingBottom={'2'} paddingX='1'>
			<FormControl isRequired={true} isInvalid={isSubmitting && invalidContent}>
				<Input size={'md'} borderWidth='2px' borderColor={'blue.200'} placeholder='Your message here' value={contentInput} onChange={handleContentInputChange} required/>
				<FormErrorMessage>A message is required.</FormErrorMessage>
			</FormControl>
			<Button
				mt={2}
				colorScheme='teal'
				type='submit'
				leftIcon={<ChatIcon />}
				onClick={async () => {
					void handleNewMessage();
				}}
				isDisabled={invalidContent}
				isLoading={isSubmitting}
				size='sm'
			>
          Submit
			</Button>
		</Box>
	);
}
