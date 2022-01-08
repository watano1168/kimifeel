import { CommandInteraction, Interaction } from "discord.js";
import { ClientManager } from "../client";

export type CreateCommandEventOptions = {
  commandName: string;
  subCommandGroupName?: string;
  subCommandName?: string;
  allowBot: boolean;
};

export type CreateCommandEventHandler = (command: CommandInteraction) => PromiseLike<void>;

type CreateCommandEventRegistration = {
  handler: CreateCommandEventHandler;
  options: CreateCommandEventOptions;
};

export class InteractionEventRunner {
  private readonly registrations = {
    onCommandCreated: [] as CreateCommandEventRegistration[]
  };

  constructor(client: ClientManager) {
    client.onInteractionCreated((interaction) => this.onInteractionCreated(interaction));
  }

  public registerCreateEvent(handler: CreateCommandEventHandler, options: CreateCommandEventOptions) {
    this.registrations.onCommandCreated.push({ handler, options });
  }

  private async onInteractionCreated(interaction: Interaction) {
    if (interaction.isCommand()) {
      await this.onCommandCreated(interaction);
    }
  }

  private async onCommandCreated(command: CommandInteraction) {
    let registrations = this.registrations.onCommandCreated;

    registrations = registrations.filter((registration) => this.checkBot(command, registration.options));
    registrations = registrations.filter((registration) => this.checkCommandName(command, registration.options));

    await registrations.mapAsync(async (registration) => await registration.handler(command));
  }

  private checkBot(interaction: Interaction, options: CreateCommandEventOptions) {
    return options.allowBot || !interaction.user.bot;
  }

  private checkCommandName(interaction: CommandInteraction, options: CreateCommandEventOptions) {
    const mainValid = interaction.commandName === options.commandName;
    const subGroupValid = (interaction.options.getSubcommandGroup(false) ?? undefined) === options.subCommandGroupName;
    const subValid = (interaction.options.getSubcommand(false) ?? undefined) === options.subCommandName;

    return mainValid && subGroupValid && subValid;
  }
}