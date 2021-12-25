import { IdentityUser } from "./identity-user";
import { Context } from "../context";
import { ContextModel } from "../context-model";
import { ImaginaryProfileService } from "../services";
import { ContentLengthLimitError } from "../errors";

export class ImaginaryProfile extends ContextModel {
  private readonly service = new ImaginaryProfileService(this);
  public readonly owner: IdentityUser;
  public readonly author: IdentityUser;
  public readonly content: string;
  public static readonly MinContentLength = 1;
  public static readonly MaxContentLength = 100;

  public constructor(ctx: Context, props: CreateProfileProps) {
    super(ctx);
    this.owner = props.owner;
    this.author = props.author;
    this.content = props.content;
    this.validation();
  }

  private validation() {
    if (
      this.content.length < ImaginaryProfile.MinContentLength ||
      ImaginaryProfile.MaxContentLength < this.content.length
    ) {
      throw new ContentLengthLimitError(
        ImaginaryProfile.MinContentLength,
        ImaginaryProfile.MaxContentLength,
        this.content.length
      );
    }
  }

  public async create() {
    return await this.service.create();
  }
}

export type CreateProfileProps = {
  owner: IdentityUser;
  author: IdentityUser;
  content: string;
};
