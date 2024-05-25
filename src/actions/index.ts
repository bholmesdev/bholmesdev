import { ActionError, defineAction, z } from "astro:actions";
import {
  checkIfRateLimited,
  updateLikes,
  BUTTONDOWN_URL,
} from "~/utils.server";
import { getEntry } from "astro:content";

export const server = {};
