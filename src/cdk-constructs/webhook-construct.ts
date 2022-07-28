import { Construct } from 'constructs';
import {
  aws_apigateway as apigw,
  aws_logs as logs,
  aws_lambda_nodejs as lambdajs,
} from 'aws-cdk-lib';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';

type Params = {
  api: apigw.IRestApi;
};

export default class WebhookConstruct extends Construct {
  constructor(scope: Construct, params: Params) {
    super(scope, 'webhook-construct');
    const { root } = params.api;
    this.setupWebhookEndpoint(root as apigw.Resource);
  }

  private setupWebhookEndpoint(root: apigw.Resource): void {
    const handler = new lambdajs.NodejsFunction(this, 'webhook-handler', {
      entry: './src/lambda/webhook/handler.ts',
      handler: 'default',
      logRetention: logs.RetentionDays.ONE_DAY,
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
        target: 'node16',
        sourceMap: true,
        sourceMapMode: lambdajs.SourceMapMode.DEFAULT,
      },
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        APILAYER_API_KEYS: process.env.APILAYER_API_KEYS ?? '',
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ?? '',
        TELEGRAM_BOT_WEBHOOK_SECRET: process.env.TELEGRAM_BOT_WEBHOOK_SECRET ?? '',
        TELEGRAM_BOT_ALLOWED_CHATS: process.env.TELEGRAM_BOT_ALLOWED_CHATS ?? '',
      },
    });

    root.addResource('webhook').addMethod('POST', new apigw.LambdaIntegration(handler));
  }
}
