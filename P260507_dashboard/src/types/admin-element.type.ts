import { AdminPost } from "./post.type.js";
import { AdminComment } from "./comment.type.js";
import { AdminUser } from "./user.type.js";
import { RuoloAdmin } from "./role.type.js";

export type ElementoAdmin =
  | AdminPost
  | AdminComment
  | AdminUser
  | RuoloAdmin;