'use client';

import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function GlobalProgressBar() {
  const isFetching = useIsFetching();
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const [animationTimeout, setAnimationTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let finishTimeout: NodeJS.Timeout;

    // 清除之前的定时器
    if (animationTimeout) clearTimeout(animationTimeout);

    if (isFetching) {
      // 确保至少显示一次进度动画
      const newTimeout = setTimeout(() => {
        setShow(true);
        setProgress(10); // 立即显示10%进度

        interval = setInterval(() => {
          setProgress(prev => Math.min(prev + 5, 90)); // 缓慢增长到90%
        }, 200);
      }, 100); // 延迟100ms开始，避免闪烁

      setAnimationTimeout(newTimeout);
    } else {
      // 请求完成时的动画
      if (progress > 0) {
        setProgress(100); // 立即完成到100%
        finishTimeout = setTimeout(() => {
          setShow(false);
          setProgress(0);
        }, 300); // 300ms后隐藏
      }
    }

    return () => {
      clearInterval(interval);
      clearTimeout(finishTimeout);
    };
  }, [isFetching]);

  return show ? (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[9999] overflow-hidden bg-gray-100">
      <div
        className="h-full bg-blue-500 transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          backgroundImage: 'linear-gradient(to right, #3b82f6, #6366f1, #8b5cf6)'
        }}
      />
    </div>
  ) : null;
}
