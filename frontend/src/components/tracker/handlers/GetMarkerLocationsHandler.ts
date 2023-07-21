import {getMarkerLocations} from '../../../services/mapService';

export const getMarkerLocationsHandler = async () => {
	const response = await getMarkerLocations();
	return response;
};
