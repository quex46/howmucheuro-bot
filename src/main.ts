import 'source-map-support/register';

import { App } from 'aws-cdk-lib';

import BotStack from './cdk-stacks/bot-stack';

const app = new App();

new BotStack(app, 'bot-stack');
