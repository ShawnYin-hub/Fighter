# 诊断 app.js 404 错误

请在浏览器控制台（F12 -> Console）中依次运行以下代码，并把结果返回给我。

## 1. 检查所有 script 标签

```javascript
// 检查所有 script 标签
Array.from(document.querySelectorAll('script')).map(s => ({
  src: s.src,
  type: s.type,
  text: s.textContent?.substring(0, 100)
}))
```

## 2. 检查是否有 app.js 的引用

```javascript
// 检查 HTML 中是否有 app.js
document.documentElement.innerHTML.includes('app.js')
```

## 3. 检查网络请求（在 Network 标签中）

打开 Network 标签，刷新页面，然后运行：

```javascript
// 检查失败的请求
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('app.js'))
  .map(r => ({
    name: r.name,
    duration: r.duration,
    transferSize: r.transferSize,
    initiatorType: r.initiatorType
  }))
```

## 4. 检查 Service Worker

```javascript
// 检查是否有 Service Worker
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs.length);
  return regs.map(r => ({
    scope: r.scope,
    active: r.active?.scriptURL
  }));
})
```

## 5. 检查所有网络请求的 URL

```javascript
// 获取所有资源请求
performance.getEntriesByType('resource')
  .map(r => r.name)
  .filter(url => url.includes('.js'))
  .sort()
```

## 6. 检查 Vite 的配置

```javascript
// 检查 window 对象
Object.keys(window).filter(k => k.includes('vite') || k.includes('app'))
```

## 7. 检查动态加载的模块

```javascript
// 检查是否有动态 import
Array.from(document.querySelectorAll('script[type="module"]')).map(s => s.src)
```

## 8. 检查错误堆栈

```javascript
// 如果有错误，检查错误信息
window.onerror = function(msg, url, line, col, error) {
  console.log('Error:', {msg, url, line, col, error: error?.stack});
  return false;
};
// 然后刷新页面，查看控制台输出
```

## 9. 检查所有链接和脚本

```javascript
// 检查所有可能引用 app.js 的地方
{
  scripts: Array.from(document.querySelectorAll('script')).map(s => s.src || s.textContent?.substring(0, 200)),
  links: Array.from(document.querySelectorAll('link[rel="preload"], link[rel="modulepreload"]')).map(l => l.href),
  imports: Array.from(document.querySelectorAll('link[rel="import"]')).map(l => l.href)
}
```

## 10. 检查 Vite 开发服务器的响应

```javascript
// 尝试直接访问可能的路径
fetch('/app.js').then(r => console.log('app.js status:', r.status, r.statusText)).catch(e => console.log('app.js error:', e))
```

---

## 快速诊断（一次性运行）

运行这个综合诊断代码：

```javascript
(async () => {
  const results = {
    scripts: Array.from(document.querySelectorAll('script')).map(s => ({
      src: s.src || 'inline',
      type: s.type,
      hasAppJs: (s.src || s.textContent || '').includes('app.js')
    })),
    htmlHasAppJs: document.documentElement.innerHTML.includes('app.js'),
    failedRequests: performance.getEntriesByType('resource')
      .filter(r => r.name.includes('app.js') || r.name.includes('404'))
      .map(r => ({
        name: r.name,
        status: r.responseStatus || 'unknown'
      })),
    serviceWorkers: await navigator.serviceWorker.getRegistrations().then(regs => 
      regs.map(r => ({ scope: r.scope, active: r.active?.scriptURL }))
    ),
    allJsFiles: performance.getEntriesByType('resource')
      .map(r => r.name)
      .filter(url => url.includes('.js'))
      .sort(),
    viteConfig: {
      hasVite: !!window.__vite_plugin_react__,
      importMap: document.querySelector('script[type="importmap"]')?.textContent
    }
  };
  console.log('诊断结果:', JSON.stringify(results, null, 2));
  return results;
})()
```

运行后，把控制台输出的完整 JSON 结果复制给我。
