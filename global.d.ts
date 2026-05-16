declare module "better-sqlite3" {
  class Database {
    constructor(filename: string);
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
  }
  class Statement {
    run(...params: unknown[]): { lastInsertRowid: number | bigint; changes: number };
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
  }
  export = Database;
}
