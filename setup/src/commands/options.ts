import { CommandOption } from "src/commands/format";
import { Integer, String } from "src/option-types";

export const pageOption: CommandOption = {
  type: Integer,
  name: "page",
  description: "ページ番号",
  min_value: 0
};

export const orderOption: CommandOption = {
  type: String,
  name: "order",
  description: "並び替え",
  choices: [
    { name: "新しい順", value: "latest" },
    { name: "古い順", value: "oldest" }
  ]
};