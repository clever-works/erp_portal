import type { ReactNode } from "react";

/**
 * 12-column bento grid. Give children a `span-N` class (N = 3, 4, 5, 6, 7, 8, 12)
 * and optionally `rows-2` to make a tile two rows tall.
 */
export default function Bento({ children }: { children: ReactNode }) {
  return <div className="bento">{children}</div>;
}
