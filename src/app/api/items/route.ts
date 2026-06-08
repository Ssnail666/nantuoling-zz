import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "当前项目直接通过 supabase-js 读写 items 表，这个接口仅作为占位说明。"
  });
}
