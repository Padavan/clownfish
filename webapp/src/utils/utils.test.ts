import assert from "node:assert";
import { describe, it } from "node:test";
import { getFibonacciInRange } from "./utils";

describe("getFibonacciInRange", () => {
  it("should render", () => {
    const array = getFibonacciInRange({
      startDate: "2000-01-01",
      startInterval: "2000-01-01",
      endInterval: "2000-01-05",
    });

    assert.equal(array, []);
  });
});
