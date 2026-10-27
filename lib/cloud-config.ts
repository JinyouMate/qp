/* ============================================================
   云服务 publicConfig

   来源：`workbuddy_cloud_service` 开通时返回的 publicConfig，
   对应应用「汽配知识局」applicationId: wbapp_yfXmEYgObDEk0BhFa2ybxI

   说明：
   1. 这四项是**允许随应用源码分发**的公开配置，publishableKey 本身不带任何
      权限，服务端按 Origin 精确校验，所以放在前端也是安全的。
   2. 不要改成从环境变量 / window.location / 自行拼装的域名读取 —— endpoint
      一旦与应用的已登记域名不一致，服务端会直接拒绝。
   3. 若重新开通拿到新的 publicConfig，整体替换下面的值即可。
   ============================================================ */
export const CLOUD_PUBLIC_CONFIG = {
  resourceId: "wbcs_n3hL5yGoXH0eYPL1z2K3o0",
  endpoint: "https://qipei-knowledge.app.workbuddy.host",
  oauthRelayBaseUrl: "https://www.workbuddy.cn/v2/as/genie-baas/oauth",
  publishableKey: "wbpk_yfXmEYgObDEk0BhFa2ybxI_U8WjnWFM5KOX3R55s6Pr8nhbIQrm5q6r",
} as const;
