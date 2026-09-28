import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'IComponents',
      formats: ['es'],
      fileName: (format) => `icomponents.${format}.js`,
    },
    rollupOptions: {
      // 外部依赖，不打包core代码进插件产物
      external: ['../../core/dist/index'],
    },
  },
});
