type GpsMessage = {
	altitude: number;
	author: string;
	latitude: number;
	longitude: number;
	content: string;
	sentBy: string;
	sentOn: string;
};

type GetGpsPointsResponse = {
	message: string;
	reqId: string;
	data: {
		Items: GpsMessage[];
		Count: number;
	};
};

type PutMessageResponse = {
	message: string;
	reqId: string;
	data: {
		Items: Message[];
		Count: number;
	};
};

type GetMessagesResponse = {
	message: string;
	reqId: string;
	data: {
		Items: Message[];
		Count: number;
	};
};
