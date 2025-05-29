// File: src/app/api/fetch-meta/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { URL } from 'url';

const FETCH_TIMEOUT_MS = 15000;

export interface FetchedWebsiteMetadata {
  title?: string;
  description?: string;
  iconLink?: string; // 对应 Java 代码中的 iconLink
  domain: string;
  error?: string;
  // 可以保留 ogImage 作为更优的图片选择
  ogImage?: string;
}

async function fetchMetadataInternal(siteUrl: string): Promise<FetchedWebsiteMetadata> {
  let validatedUrl: URL;
  let initialDomainForError = '';

  console.log(`[Route Handler /api/fetch-meta] fetchMetadataInternal called for: ${siteUrl}`);

  try {
    if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
      siteUrl = 'http://' + siteUrl;
    }
    validatedUrl = new URL(siteUrl);
    initialDomainForError = validatedUrl.hostname;
  } catch (error: any) {
    console.error(`[Route Handler /api/fetch-meta] 无效的 URL 格式: ${siteUrl}`, error.message);
    try {
      initialDomainForError = new URL(siteUrl.startsWith('http') ? siteUrl : `http://${siteUrl}`).hostname;
    } catch { /* 忽略 */ }
    return {
      domain: initialDomainForError,
      title: initialDomainForError || '无效URL',
      iconLink: initialDomainForError ? `https://www.google.com/s2/favicons?domain=${initialDomainForError}&sz=128` : undefined,
      error: '无效的 URL 格式'
    };
  }

  const domain = validatedUrl.hostname;
  const baseOrigin = validatedUrl.origin; // 用于解析相对路径

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log(`[Route Handler /api/fetch-meta] 请求 ${validatedUrl.href} 因超时 (${FETCH_TIMEOUT_MS}ms) 而中止。`);
    controller.abort();
  }, FETCH_TIMEOUT_MS);

  try {
    console.log(`[Route Handler /api/fetch-meta] 正在尝试 fetch: ${validatedUrl.href}`);
    const response = await fetch(validatedUrl.href, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    console.log(`[Route Handler /api/fetch-meta] Fetch 响应状态 for ${validatedUrl.href}: ${response.status}`);

    if (!response.ok) {
      console.warn(`[Route Handler /api/fetch-meta] URL ${validatedUrl.href} 请求失败，状态码: ${response.status}`);
      return {
        domain,
        title: domain,
        iconLink: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        error: `请求失败，状态码: ${response.status}`,
      };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      console.warn(`[Route Handler /api/fetch-meta] URL ${validatedUrl.href} 返回的不是 HTML 内容，类型为: ${contentType}`);
      return {
        domain,
        title: domain,
        iconLink: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        error: '目标网站返回的不是HTML内容。',
      };
    }

    const htmlContent = await response.text();
    console.log(`[Route Handler /api/fetch-meta] 成功获取 ${validatedUrl.href} 的 HTML 内容，长度: ${htmlContent.length}`);
    const $ = cheerio.load(htmlContent);

    // 1. 获取标题 (模仿 doc.title())
    let title = $('title').first().text()?.trim();
    if (!title) { // Jsoup 的 doc.title() 如果title标签为空，会返回空字符串
      // 可以增加 OpenGraph 或 Twitter Card 标题作为备选
      title = $('meta[property="og:title"]').attr('content')?.trim() ||
        $('meta[name="twitter:title"]').attr('content')?.trim() ||
        domain; // 最后备选为域名
    }


    // 2. 获取描述 (模仿 doc.select("meta[name=description]").first())
    const descriptionTag = $('meta[name="description"]').first();
    let description = descriptionTag ? descriptionTag.attr('content')?.trim() : undefined;
    if (!description) {
      // 增加 OpenGraph 或 Twitter Card 描述作为备选
      description = $('meta[property="og:description"]').attr('content')?.trim() ||
        $('meta[name="twitter:description"]').attr('content')?.trim();
    }


    // 3. 获取图标链接 (模仿 doc.select("link[rel=icon], link[rel=shortcut icon]").first())
    let iconLink: string | undefined = undefined;
    const iconTag = $('link[rel="icon"], link[rel="shortcut icon"]').first();
    let rawIconHref = iconTag ? iconTag.attr('href') : undefined;

    if (rawIconHref) {
      try {
        iconLink = new URL(rawIconHref, baseOrigin).href; // 解析相对路径
        console.log(`[Route Handler /api/fetch-meta] 通过 'rel=icon' 或 'rel=shortcut icon' 找到图标: ${iconLink}`);
      } catch (e) {
        console.warn(`[Route Handler /api/fetch-meta] 解析 'rel=icon' 图标路径失败: ${rawIconHref}`);
      }
    }

    // 作为更健壮的备选方案 (可以按需启用或调整优先级)
    let ogImage: string | undefined = undefined;
    const ogImageTag = $('meta[property="og:image"]').first();
    const rawOgImageHref = ogImageTag ? ogImageTag.attr('content') : undefined;
    if (rawOgImageHref) {
      try {
        ogImage = new URL(rawOgImageHref, baseOrigin).href;
        console.log(`[Route Handler /api/fetch-meta] 找到 og:image: ${ogImage}`);
        // 如果 iconLink 没找到，或者希望优先使用 og:image，可以在这里设置
        if (!iconLink) { // 或者总是优先使用og:image: iconLink = ogImage;
          // iconLink = ogImage; // 取决于您希望哪个作为 'iconLink'
        }
      } catch (e) {
        console.warn(`[Route Handler /api/fetch-meta] 解析 og:image 路径失败: ${rawOgImageHref}`);
      }
    }

    // 如果没有通过 link[rel=icon/shortcut icon] 找到，可以尝试 apple-touch-icon
    if (!iconLink) {
      const appleIconTag = $('link[rel="apple-touch-icon"]').last().attr('href'); // 通常选择最大的
      if (appleIconTag) {
        try {
          iconLink = new URL(appleIconTag, baseOrigin).href;
          console.log(`[Route Handler /api/fetch-meta] 通过 'apple-touch-icon' 找到图标: ${iconLink}`);
        } catch (e) { /* 忽略 */ }
      }
    }


    // 如果还是没有，尝试根目录的 /favicon.ico
    if (!iconLink) {
      console.log(`[Route Handler /api/fetch-meta] 未通过 link/meta 标签找到图标, 尝试 /favicon.ico for ${baseOrigin}`);
      try {
        iconLink = new URL('/favicon.ico', baseOrigin).href;
        // 实际应用中，你可能需要一个函数去真正验证这个链接是否有效 (e.g. make a HEAD request)
        // 这里我们先假设它存在
      } catch (e) { /* 忽略 */ }
    }

    // 如果最终都没有，使用 Google Favicon 服务作为备选
    if (!iconLink) {
      console.log(`[Route Handler /api/fetch-meta] 仍然未找到图标, 使用 Google Favicon 服务 for ${domain}`);
      iconLink = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }

    return {
      title: title || domain, // 如果标题为空，使用域名
      description: description,
      iconLink: iconLink,
      domain,
      ogImage: ogImage // 也可选择返回 ogImage 供前端决定使用哪个
    };

  } catch (error: any) {
    clearTimeout(timeoutId);
    let errorMessage = error.message;
    let errorCode = error.code;

    if (error.name === 'AbortError' || (error.cause && error.cause.name === 'AbortError')) {
      errorMessage = '请求超时';
      console.error(`[Route Handler /api/fetch-meta] 获取或解析 URL ${validatedUrl?.href || siteUrl} 时出错: ${errorMessage}`);
    } else if (error.cause && error.cause.message) {
      errorMessage = `${error.message} (具体原因: ${error.cause.message})`;
      errorCode = error.cause.code || errorCode;
      console.error(`[Route Handler /api/fetch-meta] 获取或解析 URL ${validatedUrl?.href || siteUrl} 时发生错误: ${error.message}`, error.cause);
    } else {
      console.error(`[Route Handler /api/fetch-meta] 获取或解析 URL ${validatedUrl?.href || siteUrl} 时发生未知错误:`, error);
    }

    const finalErrorMessage = errorCode ? `获取元数据失败: ${errorMessage} (错误码: ${errorCode})` : `获取元数据失败: ${errorMessage}`;

    return {
      domain: domain || initialDomainForError,
      title: domain || initialDomainForError || '获取失败',
      iconLink: (domain || initialDomainForError) ? `https://www.google.com/s2/favicons?domain=${domain || initialDomainForError}&sz=128` : undefined,
      error: finalErrorMessage,
    };
  }
}

// Route Handler for GET requests (与之前保持一致)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  console.log(`[Route Handler /api/fetch-meta] === Received GET request. URL parameter: ${url} ===`);

  if (!url || typeof url !== 'string') {
    console.log('[Route Handler /api/fetch-meta] Error: URL parameter is required.');
    return NextResponse.json({ error: 'URL 参数是必需的且必须是字符串。' }, { status: 400 });
  }

  try {
    const metadata = await fetchMetadataInternal(url);

    // 根据 metadata 中的 error 字段决定如何响应
    if (metadata.error && metadata.error.includes("无效的 URL 格式")) {
      return NextResponse.json(metadata, { status: 400 });
    }
    // 对于其他 fetchMetadataInternal 内部可预见的错误 (如请求失败、超时、非HTML内容)，
    // 我们仍然返回200，让前端根据 error 字段来决定如何向用户展示信息。
    return NextResponse.json(metadata, { status: 200 });

  } catch (error: any) {
    console.error('[Route Handler /api/fetch-meta] Unexpected error in GET handler:', error);
    const errorMessage = error instanceof Error ? error.message : '处理元数据时发生内部服务器错误。';
    let fallbackDomain = '';
    if (url) {
      try { fallbackDomain = new URL(url.startsWith('http') ? url : `http://${url}`).hostname; } catch {}
    }
    return NextResponse.json(
      {
        error: errorMessage,
        domain: fallbackDomain,
        title: fallbackDomain || '错误',
        iconLink: fallbackDomain ? `https://www.google.com/s2/favicons?domain=${fallbackDomain}&sz=128` : undefined,
      },
      { status: 500 }
    );
  }
}
