import {getMessages} from '../../../../services/messageService';

export const getMessagesHandler = async () => {
	const response = await getMessages();
	return response;
};
