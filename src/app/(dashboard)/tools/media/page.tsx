'use client';

import ToolProcessor from '@/components/tools/ToolProcessor';
import Badge from '@/components/ui/Badge';

export default function MediaToolsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-white">Media Tools</h1>
        <Badge variant="pro">PRO</Badge>
      </div>

      <div className="grid gap-8">
        <ToolProcessor
          operation="VIDEO_CONVERT"
          title="Video Convert"
          description="Convert video files between different formats. Requires ffmpeg for full functionality."
          acceptedTypes=".mp4,.avi,.mov,.webm"
        />
      </div>
    </div>
  );
}
