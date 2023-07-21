import {getPhotoUrls} from '../../../services/photoService';
export const getPhotoUrlsHandler = async () => {
	const response = await getPhotoUrls();
	return response;
};
