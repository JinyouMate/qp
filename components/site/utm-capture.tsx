"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

/** 挂载在 layout：首次落地捕获 UTM 与 referrer */
export function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);
  return null;
}
