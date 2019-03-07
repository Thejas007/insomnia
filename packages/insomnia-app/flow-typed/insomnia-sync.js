// @flow

declare interface BaseDriver {
  constructor(...any): VCS;
}

declare type Operation = 'add' | 'modify' | 'delete';

declare type Snapshot = {
  id: string,
  created: Date,
  parent: string,
  author: string,
  branch: string,
  name: string,
  description: string,
  state: Array<any>,
};

type StageEntry = {
  key: string,
  name: string,
  operation: Operation,
  content: string,
};

type Stage = {
  [string]: StageEntry,
};

type Status = {
  stage: Stage,
  unstaged: {
    [string]: StageEntry,
  },
};

declare class VCS {
  constructor(
    workspaceId: string,
    driver: BaseDriver,
    author: string,
    location: string,
    sessionId: string,
  ): VCS;
  checkout(branchName: string): Promise<void>;
  fork(newBranchName: string): Promise<void>;
  stage(item: StageEntry): Promise<void>;
  unstage(item: StageEntry): Promise<void>;
  status(items: Array<{ key: string, name: string, content: Object }>): Promise<void>;
  push(): Promise<void>;
  takeSnapshot(message: string): Promise<void>;
  getBranchName(): Promise<string>;
  getBranchNames(): Promise<Array<string>>;
  getBranchHistory(branchName: string): Promise<Array<Snapshot>>;
  removeBranch(branchName: string): Promise<void>;
}

declare class FileSystemDriver implements BaseDriver {
  constructor({ directory: string }): VCS;
}

declare module 'insomnia-sync' {
  declare module.exports: {
    FileSystemDriver: typeof FileSystemDriver,
    VCS: typeof VCS,
  };
}
