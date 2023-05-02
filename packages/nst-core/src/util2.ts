import { Thang } from "./types";

const util = (a?: string): Thang => {
  return a ?? "util2";
};

export default util;
