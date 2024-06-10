import { DefaultDatum } from "@nivo/tree";

export type Dict = {[key in string]: number};
export type NodeDatum = DefaultDatum & {name: string};

export interface Weight {
  a: number;
  b: number;
}
