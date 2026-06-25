import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 用相对路径构建，这样 dist/index.html 可以直接双击在浏览器打开，
// 不依赖本地服务器。配合桌面快捷方式使用。
export default defineConfig({
  plugins: [react()],
  base: "./",
});
