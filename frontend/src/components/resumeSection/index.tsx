import React from 'react';
import {
	Heading,
	Card,
	Fade} from '@chakra-ui/react';

type ResumeSectionProps = {
	title: string;
	content: React.ReactNode;
};

export const ResumeSection = ({title, content}: ResumeSectionProps) => (
	<Fade in>
		<Card
			p={10}
			mb={10}
			borderRadius='xl'
			boxShadow='md'
			bg='gray.200'
			_hover={{boxShadow: 'xl'}}
		>
			<Heading as='h1' fontSize='3xl' mb={4}>
				{title}
			</Heading>
			{content}
		</Card>
	</Fade>
);
