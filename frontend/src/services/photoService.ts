import axios from 'axios';
import configParams from '../configParams.json';

export const getPhotoUrls = async () => {
	try {
		const {data, status} = await axios.get<string[]>(
			`https://google-photos-album-demo2.glitch.me/${configParams.photoAlbumId}`,
		);

		return {status, data};
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Error with getPhotoUrls: ', error.message);
			return {status: 400, data: undefined, error: error.message};
		}

		console.log('unexpected error with getPhotoUrls: ', error);
		return {status: 400, data: undefined, error: 'an unexpected error occurred with getPhotoUrls'};
	}
};
