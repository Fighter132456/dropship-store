import assert from "node:assert/strict";
import test from "node:test";

type CartModule = {
  CART_KEY: string;
  readCartSnapshot: () => unknown;
};

function installWindow(stored: string | null) {
  const g = globalThis as Record<string, unknown>;
  g.window = {};
  g.localStorage = {
    getItem: () => stored,
  };
}

async function load(): Promise<CartModule> {
  // Non-literal specifier: Node needs the .ts extension, tsconfig forbids it in literals.
  const path = "./cart-store.ts";
  return (await import(path)) as CartModule;
}

test("readCartSnapshot returns an array when localStorage holds JSON null", async () => {
  installWindow("null");
  const { readCartSnapshot } = await load();
  const items = readCartSnapshot();
  assert.ok(Array.isArray(items));
  // CartView does items.map(...) — must not throw
  assert.doesNotThrow(() => (items as unknown[]).map((i) => i));
});
