import { Controller } from "~/controller";
import { ClientUser } from "~/models";
import { ShowProfilesAction, ShowProfilesParams } from "~/discord/actions/show-profiles-action";

export class ShowProfilesController extends Controller<ShowProfilesAction> {
  requireUsersDiscordId = (ctx: ShowProfilesParams) => [ctx.target];

  async action(ctx: ShowProfilesParams, client: ClientUser) {
    const target = await client.users.getByDiscordId(ctx.target);
    if (!target) throw Error();

    const profiles = await target.getProfiles();

    return await Promise.all(
      profiles.map(async (profile) => {
        if (!profile.author || !profile.content || !profile.index) await profile.fetch();
        if (!profile.author || !profile.content || !profile.index) throw Error();
        if (!profile.author.discordId) await profile.author.fetch();
        if (!profile.author.discordId) throw Error();
        return {
          author: profile.author.discordId,
          content: profile.content,
          index: profile.index
        };
      })
    );
  }
}
