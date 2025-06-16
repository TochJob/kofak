interface ProcessosItemType {
  pid: number;
  parentPid: number;
  name: string;
  cpu: number;
  cpuu: number;
  cpus: number;
  mem: number;
  priority: number;
  memVsz: number;
  memRss: number;
  nice: number;
  started: Date;
  state: string;
  tty: string;
  user: string;
  command: string;
  path: string;
  params: string;
}

interface ProcessosListType {
  all: number;
  blocked: number;
  running: number;
  sleeping: number;
  unknown: number;
  list: ProcessosItemType[];
}

type AvailibleIntervals = 1000 | 2000 | 5000 | 10000;
export type { ProcessosItemType, ProcessosListType, AvailibleIntervals };
