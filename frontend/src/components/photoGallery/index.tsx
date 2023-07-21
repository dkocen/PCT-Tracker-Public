import React, {useState, useEffect} from 'react';
import {
	IconButton,
	Image,
	Card,
	Flex,
	VStack,
} from '@chakra-ui/react';
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons';
import {getPhotoUrlsHandler} from './handler/getPhotoUrlsHandler';

export default function PhotoGallery() {
	const [currentPhotoUrlIndex, setCurrentPhotoUrlIndex] = useState<number>(0);
	const [photoUrls, setPhotoUrls] = useState<string[]>([]);
	const [error, setError] = useState<boolean>(false);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	useEffect(() => {
		const loadPhotos = async () => {
			const getPhotoUrlsResponse = await getPhotoUrlsHandler();
			console.log('Photo URLS: ', getPhotoUrlsResponse);
			if (getPhotoUrlsResponse.status === 200) {
				setPhotoUrls(getPhotoUrlsResponse.data!);
				setCurrentPhotoUrlIndex((getPhotoUrlsResponse.data!.length - 1));
			} else {
				setError(true);
			}

			setIsLoaded(true);
		};

		void loadPhotos();
	}, []);

	const goToNextImage = () => {
		setCurrentPhotoUrlIndex((currentPhotoUrlIndex + 1) % photoUrls.length);
	};

	const goToPreviousImage = () => {
		setCurrentPhotoUrlIndex((currentPhotoUrlIndex - 1 + photoUrls.length) % photoUrls.length);
	};

	return (
		<Card align='center' rounded='lg' boxShadow='2xl' bg='gray.200' height={'100%'} p='3'>
			<VStack h='100%' w='100%' justifyContent='center' spacing='3'>
				<Image boxShadow='2xl' h='100%' src={photoUrls[currentPhotoUrlIndex]} referrerPolicy='no-referrer' alt={'Image from the PCT Gallery If it is not loading try refreshing the page or visit [link to photos]'} />
				<Flex >
					<IconButton icon={<ChevronLeftIcon />} colorScheme='pink' aria-label='Previous image' variant='solid' onClick={goToPreviousImage} marginRight='5'/>
					<IconButton marginLeft='5' icon={<ChevronRightIcon />} colorScheme='pink' aria-label='Next image' variant='solid' onClick={goToNextImage} />
				</Flex>
			</VStack>
		</Card>
	);
}
