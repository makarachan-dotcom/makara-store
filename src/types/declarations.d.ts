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

declare module "@hono/vite-dev-server" {
  import { Plugin } from "vite";
  interface Options {
    entry: string;
    exclude?: RegExp[];
  }
  export default function devServer(options: Options): Plugin;
}

declare module "kimi-plugin-inspect-react" {
  import { Plugin } from "vite";
  export function inspectAttr(): Plugin;
}
