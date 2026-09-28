// index.ts
import { Editor, Plugin } from '../../core/dist/index';
import loadIComponentBlocks from './plugin';

const IComponentsPlugin: Plugin = (editor: Editor) => {
  // 换成 load 事件，fromElement 场景更稳定
  editor.on('load', async () => {
    console.log('【load事件触发，开始拉取组件】');
    await loadIComponentBlocks(editor);
  });
};

IComponentsPlugin.__gjsPluginId = 'icomponents';
export default IComponentsPlugin;

