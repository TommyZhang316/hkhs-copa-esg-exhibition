import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Property Management Division sustainability experience", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /創建宜居．永續共融/);
  assert.match(html, /香港房屋協會-物業管理部門 可持續發展/);
  assert.match(html, /以量化成果，呈現我們的進展。/);
  assert.match(html, /Hong Kong Housing Society Property Management Division/);
  assert.match(html, /香港房屋協會 物業管理部門/);
  assert.doesNotMatch(html, /跨代共融遊樂空間，讓不同年齡居民共享屋邨設施|以清楚範圍，呈現我們的進展|每個數字都與年份/);
  assert.match(html, /三大支柱/);
  assert.doesNotMatch(html, /ESG 概覽影片|完整影片將於此位置播放/);
  assert.match(html, /頁面進度/);
  assert.match(html, /物業管理，讓可持續發展在屋邨發生/);
  assert.match(html, /共融社區/);
  assert.match(html, /數碼服務/);
  assert.match(html, /智慧管理/);
  assert.match(html, /\/media\/estate-actions\/EA-07\.webp/);
  assert.match(html, /\/media\/estate-actions\/EA-11\.webp/);
  assert.match(html, /以智能監測支援精準防蚊/);
  assert.match(html, /智能回收，讓廚餘分類走進日常/);
  assert.match(html, /電子通告板，讓資訊更快到達/);
  assert.match(html, /跨代共融遊樂空間，連繫不同年齡/);
  assert.match(html, /共享工作室，連繫房地產科技創新/);
  assert.match(html, /Walkable PV Panel，讓公共空間同時發電/);
  assert.doesNotMatch(html, /為舊衣物預留回收出口|用清楚標示支援多類回收/);
  assert.match(html, /20 個出租屋邨/);
  assert.doesNotMatch(html, /20 個出租屋邨及 1 個管理物業/);
  assert.doesNotMatch(html, /物業及資產綜合平臺|透過物聯網（IoT）在單一平臺|COPA 智能設施/);
  assert.doesNotMatch(html, /從建造到管理，把長遠價值帶進日常|以負責任管治，推動每一步|房協方向/);
  assert.match(html, /\/media\/videos\/latest\/VD-01\.mp4/);
  assert.match(html, /智能廚餘機使用示範/);
  assert.match(html, /由物業管理員工示範廚餘分類和回收流程/);
  assert.doesNotMatch(html, /food-waste-kll|food-waste-ltt|觀龍樓智能廚餘回收/);
  assert.ok(html.indexOf("物業管理，讓可持續發展在屋邨發生") < html.indexOf("三大支柱，共同支撐宜居未來"));
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
  assert.doesNotMatch(html, /DxwklpgWz3c|kr5ljZSQx_c|wxdvJ-yH_JQ|1bH5kHK0oec/);
});

test("server-renders English and Simplified Chinese routes", async () => {
  const [english, simplified] = await Promise.all([render("/en"), render("/zh-cn")]);
  assert.equal(english.status, 200);
  assert.equal(simplified.status, 200);

  assert.match(await english.text(), /Creating Homes for Sustainable Living/);
  assert.match(await simplified.text(), /创建宜居．永续共融/);
});
