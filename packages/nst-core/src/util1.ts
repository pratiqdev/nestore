import { Thang } from "./types";

const util = (a?: string): Thang => {
  return a ?? "util1";
};

export default util;
