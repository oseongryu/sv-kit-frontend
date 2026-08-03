import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @sv/kit-ui 는 소스(ts) 배포 — Next 가 직접 컴파일
  transpilePackages: ["@sv/kit-ui"],
};

export default nextConfig;
