import {
  aws_apigateway as apigw,
  StackProps,
  Stack,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

import pkg from '../../package.json';
import WebhookConstruct from '../cdk-constructs/webhook-construct';

export default class BotStack extends Stack {
  public readonly api: apigw.RestApi;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.api = this.createApi();
    this.createResources();
  }

  private createResources() {
    const props = { api: this.api };
    new WebhookConstruct(this, props);
  }

  private createApi() {
    return new apigw.RestApi(this, 'howmucheuro-bot-api', {
      restApiName: 'HowMuchEuro Bot API',
      description: pkg.description,
      apiKeySourceType: apigw.ApiKeySourceType.HEADER,
      disableExecuteApiEndpoint: false,
      retainDeployments: false,
      deploy: true,
      deployOptions: {
        stageName: 'dev',
      },
    });
  }
}
