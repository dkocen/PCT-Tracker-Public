import axios from 'axios';
import configParams from '../configParams.json';
import {getSignedAuthHeaders} from './authService';

export const getMarkerLocations = async () => {
	try {
		const headers = await getSignedAuthHeaders();
		const {data, status} = await axios.get<GetGpsPointsResponse>(
			`${configParams.frontendApiEndpoint}/gps`, {
				headers,
			},
		);
		return {status, data: data.data.Items};
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Error with getMarkerLocations: ', error.message);
			return {status: 400, data: undefined, error: error.message};
		}

		console.error('unexpected error with getMarkerLocations: ', error);
		return {status: 400, data: undefined, error: 'an unexpected error occurred with getMarkerLocations'};
	}
};
