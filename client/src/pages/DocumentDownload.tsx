import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import React from 'react';

interface DocumentDownloadProps {
  imgUrl: string;
}

const DocumentDownload: React.FC<DocumentDownloadProps> = ({ imgUrl }) => {
    const handleDownload = async () => {
        event?.preventDefault()
        try {
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
    
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = 'image.jpg'; // You can set a custom filename here if needed
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
    
          // Release the object URL to prevent memory leaks
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error downloading image:', error);
        }
      };

  return (
    <div>
      <Button onClick={handleDownload}><Download/></Button>
    </div>
  );
};

export default DocumentDownload;
