./packages/core/README.md

# 1. 配置，初始化，默认目录启动命令等
    d:
    cd D:\workspaces\vscode\grapesjs
    # 初始化需要安装依赖（GrapesJS 是 pnpm monorepo）
    # pnpm install
    # pnpm run build
    pnpm start

    # 功能修改可直接修改packages\core\_index.html，默认会优先加载_index.html，之后才是index.html
    ### [取消]安装完整版支持
    ### [取消] pnpm --filter grapesjs add -D grapesjs-preset-webpage

# 2.自定义插件开发使用
## 2.1 开发配置
    D:\workspaces\vscode\grapesjs\packages\icomponents
    ├─ src
    │  ├─ index.ts          # 插件入口，导出grapesjs插件函数
    │  ├─ api.ts            # 请求后端接口 http://127.0.0.1:8080/service/apijs/findApiJsDetail/{id}
    │  ├─ types.ts          # TS类型定义（对应你be_api_js返回结构）
    │  └─ plugin.ts         # 核心逻辑：拿到接口数据，循环注册block + 分类
    ├─ package.json
    ├─ tsconfig.json
    ├─ vite.config.ts
    └─.gitignore

    配置完插件到根目录D:\workspaces\vscode\grapesjs执行
    pnpm install
    cd packages\icomponents
    pnpm typecheck

## 2.2 启动
    # cmd 第一个窗口
    d:
    cd D:\workspaces\vscode\grapesjs\packages\icomponents
    pnpm dev

    # cmd 第二个窗口
    d:
    cd D:\workspaces\vscode\grapesjs
    pnpm start



