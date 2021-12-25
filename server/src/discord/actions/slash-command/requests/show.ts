import { NoBotActionError } from "../../errors";
import { ActionWith } from "../../base";
import { SessionIn } from "../../session";
import { FindRequestEndpoint, FindRequestEndpointParams, FindRequestEndpointResult } from "endpoints";
import { ErrorEmbed, RequestListEmbed } from "discord/views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";

export class SlashCommandShowRequestAction extends ActionWith<SlashCommandEvent, FindRequestEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "request",
    subCommandName: "show",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<SlashCommandShowRequestAction> {
  async fetch(): Promise<FindRequestEndpointParams> {
    await Promise.resolve();

    const target = this.context.interaction.options.getUser("target", false);
    const index = this.context.interaction.options.getInteger("number", true);

    if (target && target.bot) {
      throw new NoBotActionError();
    }

    return {
      clientDiscordId: this.context.member.id,
      index: index,
      targetDiscordId: target?.id ?? this.context.member.id
    };
  }

  async onSucceed(result: FindRequestEndpointResult) {
    const listEmbed = new RequestListEmbed({ requests: [result] });
    await this.context.interaction.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
