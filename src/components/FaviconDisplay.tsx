import React from 'react';
import { cn } from "@/lib/utils";

interface FaviconDisplayProps {
  bookmark: {
    faviconUrl?: string;
    title: string;
  };
  isListView?: boolean;
  backupFaviconUrl?: string; // 添加备用 favicon url
}

const FaviconDisplay: React.FC<FaviconDisplayProps> = ({ bookmark, isListView, backupFaviconUrl }) => {
  const [faviconSrc, setFaviconSrc] = React.useState<string | null>(bookmark.faviconUrl || null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (bookmark.faviconUrl) {
      setFaviconSrc(bookmark.faviconUrl);
      setError(false); // 重置错误状态
    } else if (backupFaviconUrl) {
      setFaviconSrc(backupFaviconUrl);
      setError(false); // 重置错误状态
    } else {
      setFaviconSrc(null);
    }
  }, [bookmark.faviconUrl, backupFaviconUrl]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    (e.target as HTMLImageElement).style.display = 'none';
    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');

    // 尝试使用备用 URL
    if (backupFaviconUrl) {
      setFaviconSrc(backupFaviconUrl);
    } else {
      setFaviconSrc(null); // 如果没有备用 URL，则设置为 null
    }
  };

  if (faviconSrc && !error) {
    return (
      <img
        src={faviconSrc}
        alt={`${bookmark.title} Favicon`}
        width={32}
        height={32}
        className={cn("card-favicon rounded-md object-contain", isListView ? "w-6 h-6" : "w-8 h-8")}
        onError={handleImageError}
      />
    );
  } else {
    return (
      <div className={cn("card-favicon-placeholder rounded-md bg-muted flex items-center justify-center text-primary font-semibold", isListView ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm")}>
        {bookmark.title.charAt(0).toUpperCase()}
      </div>
    );
  }
};

export default FaviconDisplay;
