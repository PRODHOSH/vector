import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const yamlPath = join(process.cwd(), "docs", "openapi.yaml");
  const yaml = readFileSync(yamlPath, "utf-8");
  return new NextResponse(yaml, {
    headers: {
      "Content-Type": "application/yaml",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
