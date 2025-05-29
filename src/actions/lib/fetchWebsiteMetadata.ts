import * as cheerio from 'cheerio';
import { URL } from 'url'; // Node.js 内置 URL 模块

// 定义期望获取的元数据结构
export interface FetchedWebsiteMetadata {
  title?: string;
  description?: string;
  favicon?: string; // 最终选择的图标链接
  domain: string;
  // 可以考虑添加 ogImage (OpenGraph image) 作为更高质量的预览图
  // ogImage?: string;
}

// 定义 Bookmark 接口（与您提供的一致）
export interface Bookmark {
  id: string; // 由数据库生成
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  domain: string;
  readingProgress?: number; // 应用内部逻辑
  categoryId: string; // 应用内部逻辑
}

/**
 * 从给定的 URL 获取网站元数据
 * @param siteUrl 要获取元数据的网站 URL
 * @returns Promise<FetchedWebsiteMetadata | null>
 */
export async function fetchWebsiteMetadata(siteUrl: string): Promise<FetchedWebsiteMetadata | null> {
  let validatedUrl: URL;
  try {
    // 1. 验证和标准化 URL
    if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
      siteUrl = 'http://' + siteUrl; // 尝试添加 http 作为默认协议
    }
    validatedUrl = new URL(siteUrl);
  } catch (error) {
    console.error(`[MetadataFetcher] 无效的 URL 格式: ${siteUrl}`, error);
    return null;
  }

  const domain = validatedUrl.hostname;
  const controller = new AbortController(); // 用于设置超时
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时

  try {
    // 2. 发送 HTTP GET 请求
    const response = await fetch(validatedUrl.href, {
      method: 'GET',
      headers: {
        // 设置一个常见的浏览器 User-Agent 很重要，避免被一些网站基于 User-Agent 屏蔽
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      signal: controller.signal, // 关联超时控制器
      // redirect: 'follow', // fetch 默认行为是 follow, 最多20次，Node.js fetch 可能需要显式 polyfill 或 node-fetch 库支持此选项
    });
    clearTimeout(timeoutId); // 清除超时

    // 3. 处理响应 - 确保是 HTML 内容
    if (!response.ok) { // 检查 HTTP 状态码是否成功 (200-299)
      console.warn(`[MetadataFetcher] URL ${validatedUrl.href} 请求失败，状态码: ${response.status}`);
      return {
        domain,
        title: domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      console.warn(`[MetadataFetcher] URL ${validatedUrl.href} 返回的不是 HTML 内容，类型为: ${contentType}`);
      return {
        domain,
        title: domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      };
    }

    const htmlContent = await response.text();

    // 4. 解析 HTML
    const $ = cheerio.load(htmlContent);

    // 5. 提取元数据
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').first().text() ||
      $('h1').first().text();

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content');

    let favicon: string | undefined = undefined;
    const potentialIconsSelectors = [
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ];

    for (const selector of potentialIconsSelectors) {
      let iconPath = $(selector).last().attr('href');
      if (selector === 'link[rel="icon"]') {
        let largestIconPath: string | undefined = undefined;
        let maxSize = 0;
        $('link[rel="icon"]').each((i, el) => {
          const href = $(el).attr('href');
          const sizes = $(el).attr('sizes');
          if (href) {
            if (sizes) {
              const sizeParts = sizes.split('x');
              const currentSize = parseInt(sizeParts[0], 10);
              if (!isNaN(currentSize) && currentSize > maxSize) {
                maxSize = currentSize;
                largestIconPath = href;
              }
            } else if (!largestIconPath) {
              largestIconPath = href;
            }
          }
        });
        iconPath = largestIconPath || iconPath;
      }

      if (iconPath) {
        try {
          favicon = new URL(iconPath, validatedUrl.origin).href;
          break;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // console.warn(`[MetadataFetcher] 无法解析图标路径: ${iconPath}，基于 ${validatedUrl.origin}`, e);
        }
      }
    }

    if (!favicon) {
      try {
        const fallbackFaviconUrl = new URL('/favicon.ico', validatedUrl.origin).href;
        // 实际应用中，可能需要发起 HEAD 请求验证 fallbackFaviconUrl 是否存在且有效
        // const headResponse = await fetch(fallbackFaviconUrl, { method: 'HEAD', signal: controller.signal, timeout: 3000 });
        // if (headResponse.ok) {
        //   favicon = fallbackFaviconUrl;
        // }
        favicon = fallbackFaviconUrl; // 简化处理
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) { /* 忽略 */ }
    }

    if (!favicon) {
      favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }

    return {
      title: title?.trim() || domain,
      description: description?.trim(),
      favicon,
      domain,
    };

  } catch (error) {
    clearTimeout(timeoutId); // 确保在任何错误情况下都清除超时
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (error.name === 'AbortError') {
      console.error(`[MetadataFetcher] 请求 URL ${validatedUrl.href} 超时`);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.error(`[MetadataFetcher] 获取或解析 URL ${validatedUrl.href} 时出错:`, error.message);
    }
    return {
      domain,
      title: domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    };
  }
}