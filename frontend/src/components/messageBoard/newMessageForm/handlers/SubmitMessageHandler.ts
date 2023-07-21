import {putMessage} from '../../../../services/messageService';

export const submitMessage = async (message: {content: string; author: string}) => {
	const response = await putMessage(message);
	return response;
};
