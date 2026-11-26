import test from "node:test";
import assert from "node:assert/strict";

const store = new Map<string, string>();
Object.assign(globalThis, {
  window: {},
  localStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  },
});

const { readCartSnapshot, CART_KEY } = await import("./cart-store.ts");

// DROPSHIP-STORE-1-4: same crash (null.map in CartView); snapshot must stay stable
test("readCartSnapshot returns a stable empty array for stored null", () => {
  store.set(CART_KEY, "null");
  const first = readCartSnapshot();
  assert.deepEqual(first, []);
  assert.equal(readCartSnapshot(), first);
});

// DROPSHIP-STORE-1-2: CartView crashed on items.map when snapshot was null
for (const raw of ["null", "{}", '"x"', "42"]) {
  test(`readCartSnapshot returns an array for stored value ${raw}`, () => {
    store.set(CART_KEY, raw);
    assert.ok(Array.isArray(readCartSnapshot()));
  });
}
