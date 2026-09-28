// api.ts
import { ApiResponse, ApiJsDetail } from './types';

export async function fetchApiJsDetail(jsId: number): Promise<ApiJsDetail> {
  const res = await fetch(`/api/findApiJsDetail/${jsId}`); // packages\core\webpack.config.js中配置了跨域
//   const res = await fetch(`https://arisu.cn/service/apijs/findApiJsDetail/${jsId}`);
  const json: ApiResponse = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data;
}
