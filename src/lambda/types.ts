export type ApiGatewayEvent = {
  httpMethod: string;
  path: string;
  queryStringParameters?: { [key: string]: string } | undefined;
  headers?: { [key: string]: string } | undefined;
  body: string | null;
  isBase64Encoded: boolean;
  pathParameters: { [key: string]: string | undefined };
};

export type ApiGatewayResponse = {
  statusCode: number;
  body: string;
  headers?: { [key: string]: string };
  isBase64Encoded?: boolean;
};
