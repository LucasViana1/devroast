"use client";

import NumberFlow from "@number-flow/react";

interface AnimatedNumberProps {
  value: number;
}

export function AnimatedNumber({ value }: AnimatedNumberProps) {
  return <NumberFlow value={value} className="tabular-nums" />;
}
