import { SessionIn } from "../session";
import { ActionWith } from "../base";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestCanceledEmbed } from "discord/views";
import { CancelRequestEndpoint, CancelRequestEndpointParams, CancelRequestEndpointResult } from "endpoints";

export class SlashCommandCancelRequestAction extends ActionWith<SlashCommandEvent, CancelRequestEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "cancel-request",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new SlashCommandCancelRequestSession(context, this.endpoint).run();
  }
}

class SlashCommandCancelRequestSession extends SessionIn<SlashCommandCancelRequestAction> {
  async fetch(): Promise<CancelRequestEndpointParams> {
    await Promise.resolve();
    const index = this.context.interaction.options.getInteger("number", true);
    const target = this.context.interaction.options.getUser("target", true);

    return {
      clientDiscordId: this.context.member.id,
      index,
      targetDiscordId: target.id
    };
  }

  async onSucceed(result: CancelRequestEndpointResult) {
    const embed = new RequestCanceledEmbed({ request: result });
    await this.context.interaction.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionEndpointError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed] });
  }
}