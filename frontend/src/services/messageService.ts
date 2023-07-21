import axios from 'axios';
import {getSignedAuthHeaders} from './authService';
import configParams from '../configParams.json';

export const getMessages = async () => {
	try {
		const headers = await getSignedAuthHeaders();
		const {data, status} = await axios.get<GetMessagesResponse>(
			`${configParams.frontendApiEndpoint}/messages`, {
				headers,
			},
		);
		return {status, data: data.data.Items};
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Error with getMessage: ', error.message);
			return {status: 400, data: undefined, error: error.message};
		}

		console.log('unexpected error with getMessages: ', error);
		return {status: 400, data: undefined, error: 'an unexpected error occurred with getMessages'};
	}
};

export const putMessage = async (message: {author: string; content: string}) => {
	try {
		const data = {
			author: message.author,
			content: message.content,
		};
		const headers = await getSignedAuthHeaders();
		const {status} = await axios.post<PutMessageResponse>(
			`${configParams.frontendApiEndpoint}/messages`, data, {
				headers,
			},
		);

		return status;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Error with putMessage: ', error.message);
			return error.message;
		}

		console.error('Unexpected error with putMessage: ', error);
		return 'An unexpected error occured with putMessage';
	}
};
