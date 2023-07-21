/* eslint-disable @typescript-eslint/naming-convention */
import {Amplify, Auth} from 'aws-amplify';
import {type CognitoUser, type CognitoUserAttribute} from 'amazon-cognito-identity-js';
import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth';

import configParams from '../configParams.json';

const amplifyAuthConfig = {
	userPoolId: configParams.userPoolId,
	userPoolWebClientId: configParams.userPoolClientId,
	region: configParams.cognitoRegion,
	oauth: {
		domain: configParams.userPoolDomainUrl.replace(/^https?:\/\//, ''),
		scope: [
			'email',
			'profile',
			'openid',
			'aws.cognito.signin.user.admin',
		],
		redirectSignIn: configParams.callbackUrl,
		redirectSignOut: configParams.signOutUrl,
		clientId: configParams.userPoolClientId,
		responseType: 'code',
	},
};

Amplify.configure({
	Auth: amplifyAuthConfig,
});

export const signInUser = async () => {
	try {
		const response = await Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google});
		return 'success';
	} catch (error) {
		console.error('Error signing in user: ', error);
		return 'failed';
	}
};

export const signOutUser = async () => {
	try {
		await Auth.signOut();
		return 'success';
	} catch (error) {
		console.error('Error signing out user: ', error);
		return 'failed';
	}
};

export const getCurrentUserAttributes = async () => {
	try {
		const user = await Auth.currentAuthenticatedUser() as CognitoUser;
		const attributes: CognitoUserAttribute[] = await new Promise((resolve, reject) => {
			user.getUserAttributes((error, attributes) => {
				if (error) {
					reject(error);
				} else {
					resolve(attributes!);
				}
			});
		});
		return {loggedIn: true, attributes};
	} catch (error) {
		console.error('Error fetching current user attributes: ', error);
		return {loggedIn: false, attributes: []};
	}
};

export const getSignedAuthHeaders = async () => {
	try {
		const session = await Auth.currentSession();
		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session.getAccessToken().getJwtToken()}`,
		};
		return headers;
	} catch (error) {
		console.error('Error getting signed auth headers: ', error);
	}
};
