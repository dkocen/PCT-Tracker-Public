type Message = {
	content: string;
	author: string;
	sentOn: string;
};

type MessageContainerProps = {
	refreshMessages: boolean;
	setRefreshMessages: React.Dispatch<React.SetStateAction<boolean>>;
};

type NewMessageFormProps = {
	setRefreshMessages: React.Dispatch<React.SetStateAction<boolean>>;
	messsengerName: string;
};
