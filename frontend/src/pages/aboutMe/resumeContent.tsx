// This information is from my personal deployment to show how to format this section.

export const aboutMe = {
	title: 'About Me',
	heading: 'David Kocen',
	pronouns: 'he/they',
	email: 'dkocen0@gmail.com',
	phone: '+1 (760) 902-9837',
	linkedin: 'https://www.linkedin.com/in/david-kocen/',
	location: 'Seattle, WA',
	description: 'Before starting this hike I was a builder solutions architect working at Amazon Web Services engaging with the cloud and all the opportunities it can provide. With the help of my team I provided starter projects and other open source code snippets to help accelerate customer adoption of various AWS services. I also worked directly with service teams to ensure new features and services align well with customer expectations. Right now I am especially interested in learning about security and DevOps in the cloud. I graduated from Boston College summa cum laude where I studied computer science and psychology. At Boston College I was a member of the Gabelli Presidential Scholars Program, the only merit based scholarship program offered to fifteen students per year emphasizing leadership, social justice, and international engagement.',
	downloadLink: 'https://docs.google.com/document/d/1hlI9Llwv7hPEGQm72TEfa3B5K_K3HhpTnZuDC_oncJ0/edit?usp=sharing',
};

export const education = {
	title: 'Education',
	heading: 'Boston College, Morrissey College of Arts and Sciences',
	graduated: 'Class of 2021',
	degree: 'Bachelor of Arts in Computer Science and Psychology',
	gpa: 'Cumulative GPA: 3.90, Phi Beta Kappa',
	honors: [
		{
			title: 'Gabelli Presidential Scholar',
			description: 'Only merit based scholarship program at Boston College offered to 15 students per year emphasizing leadership, social justice, and international engagement',
		},
		{
			title: 'Dean\'s Scholar in Psychology',
			description: 'Award given to top 5% of Juniors excelling in their field of study',
		},
	],
};

export const skillsAndCerts = {
	title: 'Skills and Certifications',
	certifications: [
		'Security Specialist',
		'Associate Solutions Architect',
		'Associate Developer',
	],
	languages: [
		'JavaScript',
		'Python',
		'Java',
		'React',
		'AWS CDK',
		'Git',
	],
	skills: [
		'Fullstack serverless architecture',
		'CI/CD pipelines',
		'DevSecOps',
		'Infrastructure as code',
	],
};

export const workExperience = {
	title: 'Work Experience',
	jobs: [
		{
			company: 'Amazon Web Services',
			roles: [
				{
					title: 'Productivity Applications Builder Solutions Architect',
					date: 'July 2021-April 2023',
					descriptions: [
						'Designed and developed open-source library providing Amazon Connect Step-By-Step Guides users with 5 reusable modules and 5 deployable examples to get started using the new feature',
						'Developed and operated a new feature demo used by ~200 AWS SAs during external presentations.',
						'Lead 4 enablement sessions helping sellers get up to speed with the new release',
						'Documented and wrote set of best practices for using Amazon Connect Step-By-Step Guides AWS blog post',
						'Mentored new hires and rewrote team onboarding process based on personal experience and team feedback',
					],
				},
				{
					title: 'Productivity Applications Security Guardian',
					date: 'September 2022-April 2023',
					descriptions: [
						'Served as first internal security guardian for my immediate organization (~100 people) to validate and improve security posture of publicly shared content',
						'Performed 5 content security reviews, created internal security guidance wiki, and offered ad-hoc feedback and secure design sessions to over 50 SAs',
						'Created code pipeline to run automated security check on code stored in Git repositories',
						'Worked with AWS AppSec team to validate review process and adopt pre-existing security mechanisms',
					],
				},
				{
					title: 'Solutions Architect Internship',
					date: 'Summer 2020',
					descriptions: [
						'Designed and developed a cloud-native scheduled callbacks solution for Amazon Connect contact centers',
					],
				},
			],
		},
		{
			company: 'Boston College Computer Science Department',
			roles: [
				{
					title: 'Teacher\'s Assistant Introduction to Data Science',
					date: 'January 2020-May 2021',
					descriptions: [],
				},
				{
					title: 'Teacher\'s Assistant Logic and Computation',
					date: 'January 2019-May 2019',
					descriptions: [],
				},
			],
		},
		{
			company: 'The Language Learning Lab at Boston College',
			roles: [
				{
					title: 'Statistics Team Research Assistant',
					date: 'January 2018-May 2019',
					descriptions: [
						'Assisted replication of statistical word segmentation study collecting and analyzing data from 238 online participants using R, JavaScript, and Amazon Mechanical Turk. Paper published June 2022',
					],
				},
			],
		},
	],
};

export const leadershipAndService = {
	title: 'Leadership and Service',
	jobs: [
		{
			company: 'Glamazon (Amazon\'s LGBTQ+ Affinity Group)',
			roles: [
				{
					title: 'Team Representative',
					date: 'July 2022-April 2023',
					descriptions: [
						'Served as representative for team at Out In Tech 2022 global conference and at internal Glamazon events',
					],
				},
			],
		},
		{
			company: 'Bridge Over Troubled Water',
			roles: [
				{
					title: 'Teaching and Career Services Assistant',
					date: 'Summer 2018',
					descriptions: [
						'Mentored and tutored class of 18 at-risk youth working towards gaining HiSET/GED degree',
						'Created a centralized resource manual of  ~30 career opportunities for impoverished youth in Boston compiling information found online and through direct contacts',
					],
				},
			],
		},
		{
			company: 'Boy Scouts of America Troop 707, California Inland Empire Council',
			roles: [
				{
					title: 'Eagle Scout - Bronze & Gold Palm Recipient',
					date: 'January 2013-June 2017',
					descriptions: [],
				},
			],
		},
	],
};

export const interests = {
	title: 'Interests',
	interests: [
		'Backpacking',
		'Snowboarding',
		'CrossFit',
		'Cognitive psychology',
		'Sociology',
	],
};
