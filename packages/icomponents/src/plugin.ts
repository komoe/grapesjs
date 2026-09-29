// plugin.ts
import { Editor } from '../../core/dist/index';
import { fetchApiJsDetail } from './api';
import { ApiJsItem } from './types';

// 批量加载所有jsId，这里你维护id列表，后续可以改成后端批量接口
const JS_ID_LIST: number[] = [21]; /* 这里填全部jsId */

/**
 * 预处理html：
 * 1. 提取所有<script src="xxx">地址
 * 2. 删除这些script标签
 * 3. <link>原样保留不动
 */
function extractScriptSrcAndRemoveScriptTag(rawHtml: string) {
  const scriptSrcReg = /<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi;
  const jsUrls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = scriptSrcReg.exec(rawHtml)) !== null) {
    jsUrls.push(match[1]);
  }
  const cleanHtml = rawHtml.replace(scriptSrcReg, '');
  return {
    cleanHtml,
    jsUrls,
  };
}

export default async function loadIComponentBlocks(editor: Editor) {
  // 注册自定义组件类型 icomponent-demo
  editor.Components.addType('icomponent-demo', {
    model: {
      defaults: {
        // 组件实例默认属性
        thirdJsUrls: [] as string[],
        demoJsCode: '',
        content: '',
        _jsExecuted: false,
      },
    },
  });

  // 监听：组件实例添加进画布（每个实例只触发一次）
  editor.on('component:add', async (cmp) => {
    const cmpAny = cmp as any;
    // 判断是否是我们自定义的icomponent-demo组件
    if (cmpAny.get('type') !== 'icomponent-demo') return;

    const thirdJsUrls: string[] = cmpAny.get('thirdJsUrls') || [];
    const demoJsCode: string = cmpAny.get('demoJsCode') || '';
    if (thirdJsUrls.length === 0 && !demoJsCode) return;

    // 防止当前实例重复执行
    if (cmpAny.get('_jsExecuted')) return;

    const iframeDoc = editor.Canvas.getDocument();
    if (!iframeDoc || !iframeDoc.defaultView) return;
    const iframeWin = iframeDoc.defaultView as any;

    // iframe全局缓存，同一个js只加载一次
    if (!iframeWin.__loadedJsUrls) iframeWin.__loadedJsUrls = new Set<string>();

    // 串行加载第三方JS
    for (const jsSrc of thirdJsUrls) {
      if (iframeWin.__loadedJsUrls.has(jsSrc)) continue;
      await new Promise<void>((resolve) => {
        const scriptEl = iframeDoc.createElement('script');
        scriptEl.src = jsSrc;
        scriptEl.onload = () => {
          iframeWin.__loadedJsUrls.add(jsSrc);
          resolve();
        };
        scriptEl.onerror = () => {
          console.warn(`第三方脚本加载失败: ${jsSrc}`);
          resolve();
        };
        iframeDoc.body.appendChild(scriptEl);
      });
    }

    // 第三方js加载完成后执行ApiJsItem内的js代码
    if (demoJsCode) {
      try {
        iframeWin.eval(demoJsCode);
      } catch (e) {
        console.error('执行组件自定义JS代码失败：', e);
      }
    }
    cmpAny.set('_jsExecuted', true);
  });

  const blockManager = editor.BlockManager;
  for (const jsId of JS_ID_LIST) {
    try {
      const detail = await fetchApiJsDetail(jsId);
      const demoList = JSON.parse(detail.code) as ApiJsItem[];
      const categoryName = detail.name;

      for (const demo of demoList) {
        const { cleanHtml, jsUrls } = extractScriptSrcAndRemoveScriptTag(demo.html);
        // block content使用【组件定义对象】，符合官方文档规范
        blockManager.add(`icomponent-${jsId}-${demo.name}`, {
          label: demo.name,
          category: categoryName,
          // 重点：content 是自定义组件配置，不是纯字符串
          content: {
            type: 'icomponent-demo',
            thirdJsUrls: jsUrls,
            demoJsCode: demo.js,
            content: cleanHtml,
          },
        });
      }
    } catch (err) {
      console.error('加载区块失败', err);
    }
  }
}
