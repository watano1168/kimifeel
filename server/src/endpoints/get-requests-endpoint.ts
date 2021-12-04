import { Endpoint, EndpointParamsBase } from "../endpoint";
import { ProfileMarkdownProps } from "../views";

type GetReceivedRequestsEndpointParams =
  | {
      method: "latest" | "oldest";
      page: number;
    }
  | {
      method: "specific";
      index: number;
    };

type GetSentRequestsParams =
  | {
      method: "latest" | "oldest";
      page: number;
    }
  | {
      method: "specific";
      targetDiscordId: string;
      index: number;
    };

export type GetRequestsEndpointParams = EndpointParamsBase &
  (({ genre: "received" } & GetReceivedRequestsEndpointParams) | ({ genre: "sent" } & GetSentRequestsParams));

export type GetRequestsEndpointResult = ProfileMarkdownProps[];

export class GetRequestsEndpoint extends Endpoint<GetRequestsEndpointParams, GetRequestsEndpointResult> {}