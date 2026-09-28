// plugin.ts
import { Editor } from '../../core/dist/index';
import { fetchApiJsDetail } from './api';

// 批量加载所有jsId，这里你维护id列表，后续可以改成后端批量接口
const JS_ID_LIST: number[] = [21]; /* 这里填全部jsId */

export default async function loadIComponentBlocks(editor: Editor) {
//   console.log('【开始执行组件加载函数】JS_ID_LIST', JS_ID_LIST);
  const blockManager = editor.BlockManager;

  for (const jsId of JS_ID_LIST) {
    try {
    //   console.log('请求接口 jsId =', jsId);
      const detail = await fetchApiJsDetail(jsId);
      const categoryName = detail.name;
      const demoList = JSON.parse(detail.code);

      for (const demo of demoList) {
        const cleanHtml = demo.html.replace(/\\n/g, '\n').trim();
        const blockId = `${detail.menu}-${demo.name}`;

        blockManager.add(blockId, {
          label: demo.name,
          category: categoryName,
          // content 直接给 HTML 字符串！不要包对象
          content: cleanHtml,
        });

        const block = blockManager.get(blockId);
        (block as any).set('blockDeps', demo.deps);
        // 获取
        // const deps = (block as any).get('blockDeps');
        // console.log('注册区块成功：', blockId, cleanHtml);
      }
    } catch (err) {
      console.error('加载组件失败 jsId=', jsId, err);
    }
  }
}
