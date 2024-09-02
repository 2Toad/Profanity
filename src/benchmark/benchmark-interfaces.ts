export interface VersionData {
  version: number;
  smallCleanText: string;
  smallProfaneText: string;
  largeCleanText: string;
  largeProfaneText: string;
}

export interface TestData {
  comment1: string;
  comment2: string;
  versions: VersionData[];
}
