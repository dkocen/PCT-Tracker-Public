/* eslint-disable @typescript-eslint/naming-convention */
// Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const configParams = require('../../config.params.json');
import * as ssm from 'aws-cdk-lib/aws-ssm';
import {type Construct} from 'constructs';

export const loadSSMParams = (scope: Construct) => {
	const params: any = {};
	const SSM_NOT_DEFINED = 'not-defined';
	for (const param of configParams.parameters) {
		if (param.boolean) {
			params[param.name] = (ssm.StringParameter.valueFromLookup(scope, `${configParams.hierarchy}${param.name}`).toLowerCase() === 'true');
		} else {
			params[param.name] = ssm.StringParameter.valueFromLookup(scope, `${configParams.hierarchy}${param.name}`);
		}
	}

	return {...params, SSM_NOT_DEFINED};
};

export const fixDummyValueString = (value: string): string => {
	if (value.includes('dummy-value-for-')) {
		return value.replace(/\//g, '-');
	}

	return value;
};
