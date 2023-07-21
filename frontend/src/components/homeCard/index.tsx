import * as React from 'react';
import {
	Card,
	Image,
	Heading,
	Text,
	Button,
	Link,
} from '@chakra-ui/react';

export const HomeCard = (props: HomeCardProps) => (
	<Card
		align='center'
		rounded='lg'
		boxShadow='lg'
		bg='gray.200'
		p='3'
		_hover={{boxShadow: '2xl'}}
	>
		<Image borderRadius={'full'} fit='fill' p='5'
			src={props.imagePath}
		/>
		<Button onClick={props.onClick} bg='pink.400' shadow={'xl'}>{props.title}</Button>
	</Card>
);
