import * as React from 'react';
import {
	ChakraProvider,
	extendTheme,
} from '@chakra-ui/react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {PctTracker} from './pages/pctTracker';
import {Home} from './pages/home';
import {AppStateProvider} from './providers/AppStateProvider';
import {AboutMe} from './pages/aboutMe';
import {AboutSite} from './pages/aboutSite';

const customTheme = extendTheme({
	styles: {
		global: {
			body: {
				background: 'linear-gradient(180deg, #D6A2E8  0%, #9D4EDD 50%, #5A189A 100%)',
			},
		},
	},
});

export const App = () => (
	<AppStateProvider>
		<ChakraProvider theme={customTheme}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/home' element={<Home />} />
					<Route path='/pct-tracker' element={<PctTracker />} />
					<Route path ='/about-me' element={<AboutMe />} />
					<Route path ='/about-site' element={<AboutSite />} />
				</Routes>
			</BrowserRouter>
		</ChakraProvider>
	</AppStateProvider>

);
