import { Endpoint, EndpointParamsBase } from "./base";
import { RequestMarkdownProps } from "discord/views";

export type CancelRequestEndpointParams = EndpointParamsBase & {
  targetDiscordId: string;
  index: number;
};

export type CancelRequestEndpointResult = RequestMarkdownProps;

export class CancelRequestEndpoint extends Endpoint<CancelRequestEndpointParams, CancelRequestEndpointResult> {}