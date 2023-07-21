import React, {useState, useEffect} from 'react';
import {
	GoogleMap,
	MarkerF,
	LoadScript,
	InfoWindowF,
} from '@react-google-maps/api';
import {
	Card,
	Spinner,
} from '@chakra-ui/react';
import {getMarkerLocationsHandler} from './handlers/GetMarkerLocationsHandler';
import AlertWrapper from '../alert';

import configParams from '../../configParams.json';

export default function TrackerCard() {
	const [markerInfo, setMarkerInfos] = useState<GpsMessage[]>([]);
	const [map, setMap] = useState<google.maps.Map | undefined>(undefined);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [selectedMarker, setSelectedMarker] = useState<GpsMessage>();

	useEffect(() => {
		const loadMarkers = async () => {
			const getMarkerLocationsResponse = await getMarkerLocationsHandler();
			console.log('Marker locations: ', getMarkerLocationsResponse);
			if (getMarkerLocationsResponse.status === 200) {
				setMarkerInfos(getMarkerLocationsResponse.data!);
			} else {
				setError(true);
			}
		};

		void loadMarkers();
	}, []);

	const handleMapLoad = (map: google.maps.Map) => {
		setMap(map);
		markerInfo.forEach(markerInfo => {
			const marker = new google.maps.Marker({
				position: {lat: markerInfo.latitude, lng: markerInfo.longitude},
				map,
			});

			marker.addListener('click', () => {
				handleMarkerClick(markerInfo);
			});
		});

		setSelectedMarker(markerInfo[-1]);
	};

	const handleMarkerClick = (gpsMessage: GpsMessage) => {
		setSelectedMarker(gpsMessage);
	};

	const handleInfoWindowClose = () => {
		setSelectedMarker(undefined);
	};

	return (
		<Card align='center' p={6} rounded='lg' boxShadow='2xl' bg='gray.200' height={'100%'}>
			{error && <AlertWrapper title='An error occurred' message='Try again later' status='error'/>}
			<LoadScript
				googleMapsApiKey={configParams.mapsApiKey}
				onLoad={() => {
					setIsLoaded(true);
				}}
			>
				{isLoaded && markerInfo.length > 0 ? (
					<GoogleMap
						mapContainerStyle={{height: '100%', width: '100%'}}
						zoom={8}
						center={{lat: markerInfo[markerInfo.length - 1].latitude, lng: markerInfo[markerInfo.length - 1].longitude}}
						onLoad={map => {
							handleMapLoad(map);
						}}
					>
						{markerInfo.map((gpsMessage, index) =>
							<MarkerF key={index}
								position={{lat: gpsMessage.latitude, lng: gpsMessage.longitude}}
								visible={true}
								title={gpsMessage.sentOn}
								onClick={() => {
									handleMarkerClick(gpsMessage);
								}}
							/>)
						}
						{selectedMarker && (
							<InfoWindowF
								position={{lat: (selectedMarker.latitude + 0.01), lng: (selectedMarker.longitude + 0.01)}}
								onCloseClick={handleInfoWindowClose}
							>
								<div>
									<h1><b>Date</b>: {(new Date(selectedMarker.sentOn)).toLocaleString()}</h1>
									<h3><b>Lat</b>: {selectedMarker.latitude.toFixed(4)}</h3>
									<h3><b>Lon</b>: {selectedMarker.longitude.toFixed(4)}</h3>
									<h3><b>Alt</b>: {selectedMarker.altitude} ft</h3>
									<p><b>Message</b>: {selectedMarker.content}</p>
								</div>
							</InfoWindowF>
						)}
					</GoogleMap>
				)
					: (
						<Spinner />
					)
				}
			</LoadScript>
		</Card>
	);
}
