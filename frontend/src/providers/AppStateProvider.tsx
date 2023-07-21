import React, {useContext, useState} from 'react';
import {type CognitoUserAttribute} from 'amazon-cognito-identity-js';

type ProviderValue = {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
	userAttributes: CognitoUserAttribute[] | undefined;
	setUserAttributes: React.Dispatch<React.SetStateAction<CognitoUserAttribute[] | undefined>>;
};

const AppStateContext = React.createContext<ProviderValue | undefined>(undefined);

export function useAppState() {
	const state = useContext(AppStateContext);

	if (!state) {
		throw new Error('useAppState must be used within AppStateProvider');
	}

	return state;
}

export function AppStateProvider({children}: any) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userAttributes, setUserAttributes] = useState<CognitoUserAttribute[]>();

	const providerValue = {
		isLoggedIn,
		setIsLoggedIn,
		userAttributes,
		setUserAttributes,
	};

	return (
		<AppStateContext.Provider value={providerValue}>
			{children}
		</AppStateContext.Provider>
	);
}
