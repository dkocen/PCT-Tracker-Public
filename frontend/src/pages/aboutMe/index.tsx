import React from 'react';
import {
	Heading,
	Divider,
	Box,
	Text,
	HStack,
	VStack,
	Icon,
	UnorderedList,
	ListItem,
	SimpleGrid,
	Link,
} from '@chakra-ui/react';
import {
	AiOutlineLinkedin,
	AiOutlineMail,
	AiOutlinePhone,
	AiOutlineEnvironment,
	AiOutlineCaretRight,
	AiOutlineLink,
} from 'react-icons/ai';
import NavBar from '../../components/navbar';
import {ResumeSection} from '../../components/resumeSection';
import {aboutMe, education, skillsAndCerts, workExperience, leadershipAndService, interests} from '../../pages/aboutMe/resumeContent';

export const AboutMe = () => {
	const x = 1;

	return (
		<>
			<NavBar />
			<Box maxW='800px' mx='auto' my={8} p={4}>
				<ResumeSection title={`${aboutMe.heading} (${aboutMe.pronouns})`} content={
					<>
						<HStack align={'top'} spacing={10} mb={4}>
							<VStack align={'left'}>
								<Text fontSize='sm' color='gray.600'>
									<Icon as={AiOutlineMail}/> {aboutMe.email}
								</Text>
								<Text fontSize='sm' color='gray.600'>
									<Icon as={AiOutlinePhone}/> {aboutMe.phone}
								</Text>
								<Link fontSize='sm' color='gray.600' isExternal href={aboutMe.downloadLink}><Icon as={AiOutlineLink}/> View my resume</Link>
							</VStack>
							<VStack align={'left'}>
								<Text fontSize='sm' color='gray.600'>
									<Icon as={AiOutlineLinkedin}/> {aboutMe.linkedin}
								</Text>
								<Text fontSize='sm' color='gray.600'>
									<Icon as={AiOutlineEnvironment}/> {aboutMe.location}
								</Text>
							</VStack>
						</HStack>
						<Divider mb={4} />
						<Text mb={4}>{aboutMe.description}</Text>
						<Divider mb={4} />
						<SimpleGrid columns={3}>
							{interests.interests.map(interest =>
								<Text key={interest}>
									<Icon as={AiOutlineCaretRight}/> {interest}
								</Text>,
							)}
						</SimpleGrid>
					</>
				} />
				<ResumeSection title={skillsAndCerts.title} content={
					<>
						<Divider mb={4} />
						<HStack align={'top'} spacing={20} m={4} maxW={'100%'} overflow={'scroll'}>
							<VStack align={'left'}>
								<Text fontWeight={'bold'}>Languages/Frameworks</Text>
								<UnorderedList>
									{skillsAndCerts.languages.map(language => <ListItem key={language}>{language}</ListItem>,
									)}
								</UnorderedList>
							</VStack>
							<VStack align={'left'}>
								<Text fontWeight={'bold'}>Skills</Text>
								<UnorderedList>
									{skillsAndCerts.skills.map(skill => <ListItem key={skill}>{skill}</ListItem>,
									)}
								</UnorderedList>
							</VStack>
							<VStack align={'left'}>
								<Text fontWeight={'bold'}>AWS Certifications</Text>
								<UnorderedList>
									{skillsAndCerts.certifications.map(cert => <ListItem key={cert}>{cert}</ListItem>,
									)}
								</UnorderedList>
							</VStack>
						</HStack>
					</>
				} />
				<ResumeSection title={education.title} content={
					<>
						<Text fontSize='xl' mb={4}>
							{education.heading}
						</Text>
						<Divider mb={4} />
						<Text fontWeight={'bold'}>{education.degree}</Text>
						<Text mb={4}>{education.graduated}</Text>
						{
							education.honors.map(honor =>
								<>
									<Text fontStyle={'italic'}>{honor.title}</Text>
									<Text mb={4}>{honor.description}</Text>
								</>,
							)
						}
					</>}
				/>
				<ResumeSection title={workExperience.title} content={<>
					{workExperience.jobs.map(job =>
						<>
							<Box key={job.company} mb={4}>
								<Heading as='h3' fontSize='xl' mb={2}>
									{job.company}
								</Heading>
								{job.roles.map(role =>
									<>
										<Text fontWeight='semibold' mb={1}>
											{role.title}
										</Text>
										<Text mb={1} color='gray.600'>
											{role.date}
										</Text>
										<UnorderedList>
											{role.descriptions.map(descr => <ListItem key={descr}>{descr}</ListItem>,
											)}
										</UnorderedList>
									</>,
								)}

							</Box>
							<Divider mb={4}/>
						</>,
					)}
				</>} />
				<ResumeSection title={leadershipAndService.title} content={<>
					{leadershipAndService.jobs.map(job =>
						<>
							<Box key={job.company} mb={4}>
								<Heading as='h3' fontSize='xl' mb={2}>
									{job.company}
								</Heading>
								{job.roles.map(role =>
									<>
										<Text fontWeight='semibold' mb={1}>
											{role.title}
										</Text>
										<Text mb={1} color='gray.600'>
											{role.date}
										</Text>
										<UnorderedList>
											{role.descriptions.map(descr => <ListItem key={descr}>{descr}</ListItem>,
											)}
										</UnorderedList>
									</>,
								)}

							</Box>
							<Divider mb={4}/>
						</>,
					)}
				</>} />
			</Box>
		</>
	);
};
