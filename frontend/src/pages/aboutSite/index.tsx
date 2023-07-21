import React from 'react';
import {
	Divider,
	Box,
	Text,
	Icon,
	Link,
} from '@chakra-ui/react';
import {
	AiOutlineGithub,
} from 'react-icons/ai';
import NavBar from '../../components/navbar';
import {ResumeSection} from '../../components/resumeSection';
import {aboutSite} from './aboutSiteContent';

export const AboutSite = () => (
	<>
		<NavBar />
		<Box maxW='800px' mx='auto' my={8} p={4} h={'88vh'}>
			<ResumeSection title={aboutSite.title} content={<>
				<Text>{aboutSite.description}</Text>
				<Divider m={4} />
				<Link fontSize='sm' color='gray.800' isExternal href={aboutSite.githubLink}><Icon as={AiOutlineGithub}/> View the GitHub repo</Link>
			</>} />
		</Box>
	</>
);
