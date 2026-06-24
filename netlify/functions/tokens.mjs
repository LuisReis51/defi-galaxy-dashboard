const CATEGORY = {
  ethereum:'ethereum-ecosystem', bsc:'binance-smart-chain', solana:'solana-ecosystem',
  arbitrum:'arbitrum-ecosystem', polygon:'polygon-ecosystem', avalanche:'avalanche-ecosystem',
  optimism:'optimism-ecosystem', base:'base-ecosystem',
};
let cache = { data: null, ts: 0 };
const TTL = 120_000;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
 
async function fetchNetwork(net, key) {
  const keyParam = key ? `&x_cg_demo_api_key=${key}` : '';
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h&category=${CATEGORY[net]}${keyParam}`;
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url);
      console.log(`📊 ${net}: HTTP ${r.status}`);
      if (r.status === 429) { await sleep(1000 * (i + 1)); continue; }
      if (!r.ok) return [];
      return await r.json();
    } catch (e) { console.log(`💥 ${net}: ${e.message}`); await sleep(400); }
  }
  return [];
}
 
export default async () => {
  const key = (process.env.COINGECKO_KEY || '').trim();
  console.log(`🔑 API Key: ${key ? 'Present ('+key.slice(0,8)+'...)' : 'MISSING'}`);
  if (cache.data && Date.now() - cache.ts < TTL) {
    return Response.json(cache.data, { headers: { 'Cache-Control': 'public, max-age=120' } });
  }
  const out = {};
  for (const net of Object.keys(CATEGORY)) { out[net] = await fetchNetwork(net, key); await sleep(250); }
  const got = Object.values(out).filter(a => Array.isArray(a) && a.length > 0).length;
  const complete = got === Object.keys(CATEGORY).length;
  console.log(`📈 Results: ${got}/8 networks; complete=${complete}`);
  if (complete) cache = { data: out, ts: Date.now() };
  const body = complete ? out : (cache.data || out);
  // never let the edge cache a partial/failed result
  const cc = complete ? 'public, max-age=120' : 'no-store, max-age=0';
  return Response.json(body, { headers: { 'Cache-Control': cc } });
};
