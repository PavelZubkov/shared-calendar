import { Dictionary } from "./ts-utils";

export type RequestContext = {
  routeKey: string;
  http: {
    method: string;
    path: string;
  };
  requestId?: string;
  domainName?: string;
};

export type HttpFunctionRequest = {
  version: string;
  routeKey: string;
  rawPath: string;
  pathParameters?: Dictionary<string>;
  rawQueryString: string;
  queryStringParameters?: Dictionary<string>;
  cookies?: string[];
  headers: Dictionary<string>;
  requestContext: RequestContext;
  body?: string;
  isBase64Encoded?: boolean;
};

export type HttpFunctionResponse = {
  statusCode: number;
  headers?: Dictionary<string>;
  cookies?: string[];
  body?: string;
  isBase64Encoded?: boolean;
};

export function redirect(redirectTo: string): HttpFunctionResponse {
  return {
    statusCode: 302,
    headers: {
      Location: redirectTo,
    },
  };
}

export function getBaseUrl(req: HttpFunctionRequest): string {
  const { domainName } = req.requestContext;
  const scheme = domainName == null ? "http://" : "https://";
  return `${scheme}${domainName ?? "localhost:3333"}`;
}

export type WrappedHandler<TArgs extends unknown[]> = (
  req: HttpFunctionRequest,
  ...args: TArgs
) => Promise<HttpFunctionResponse>;

export function withBaseUrl<T extends unknown[]>(
  handler: WrappedHandler<[string, ...T]>
): WrappedHandler<T> {
  return async (req, ...rest) => {
    const baseUrl = getBaseUrl(req);
    return handler(req, baseUrl, ...rest);
  };
}
