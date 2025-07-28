import axios from 'axios';

// Download document from Documentpath
export const downloadDocument = async (documentId) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/documentpaths/${documentId}/download`, {
            responseType: 'blob',
        });
        
        // Create blob URL
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL
        window.URL.revokeObjectURL(url);
        
        return { success: true };
    } catch (error) {
        console.error('Download error:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Download failed' 
        };
    }
};

// Download historique document
export const downloadHistorique = async (historiqueId) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/historiques/${historiqueId}/download`, {
            responseType: 'blob',
        });
        
        // Create blob URL
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || 'historique';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL
        window.URL.revokeObjectURL(url);
        
        return { success: true };
    } catch (error) {
        console.error('Download error:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Download failed' 
        };
    }
};

// Legacy function for backward compatibility
export const downloadFile = (filename) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = `http://127.0.0.1:8000/download/uploads/${filename}`;
    link.target = '_blank'; // Open in new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}; 