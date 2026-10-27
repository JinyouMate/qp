import Script from "next/script";

/**
 * 分析脚本注入（GA4 / Plausible 二选一或同时）。
 * 两个都没配变量时不注入任何脚本，页面零开销。
 */
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_HOST = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST || "https://plausible.io";

export function Analytics() {
  return (
    <>
      {GA4_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4_ID}');`}
          </Script>
        </>
      ) : null}

      {PLAUSIBLE_DOMAIN ? (
        <Script
          src={`${PLAUSIBLE_HOST}/js/script.manual.js`}
          data-domain={PLAUSIBLE_DOMAIN}
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
