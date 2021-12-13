import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestCanceledEmbed } from "discord/views";
import { ActionWith } from "../base";
import { CancelRequestEndpoint, CancelRequestEndpointParams, CancelRequestEndpointResult } from "endpoints";
import { basePhrase } from "./phrases";
import { MessageCommandSession } from "./session";

const format = {
  prefixes: [`${basePhrase} cancel-request`, `${basePhrase} request cancel`],
  arguments: [
    {
      name: "リクエスト対象のユーザーID",
      description: "",
      type: "userId"
    },
    {
      name: "リクエストの番号",
      description: "",
      type: "integer"
    }
  ],
  options: {}
} as const;

export class MessageCommandCancelRequestAction extends ActionWith<MessageCommandEvent, CancelRequestEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new MessageCommandCancelRequestSession(context, this.endpoint, format).run();
  }
}

class MessageCommandCancelRequestSession extends MessageCommandSession<
  MessageCommandCancelRequestAction,
  typeof format
> {
  async fetch(): Promise<CancelRequestEndpointParams> {
    await Promise.resolve();

    return {
      clientDiscordId: this.context.member.id,
      index: this.command.arguments[1],
      targetDiscordId: this.command.arguments[0]
    };
  }

  async onSucceed(result: CancelRequestEndpointResult) {
    const embed = new RequestCanceledEmbed({ request: result });
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionEndpointError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
