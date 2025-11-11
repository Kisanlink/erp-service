import type { ApiClient } from '../utils/apiClient.js';
import type {
  ApiResponse,
  AttachmentResponse,
  AttachmentInfoResponse,
} from '../types/index.js';

/**
 * Creates attachment service for file upload/download operations
 *
 * @param apiClient - Configured API client instance
 * @returns Attachment service methods
 *
 * @example
 * ```typescript
 * const attachmentService = createAttachmentService(apiClient);
 * const attachment = await attachmentService.upload(file, 'logo', 'CLAB_001');
 * ```
 */
const createAttachmentService = (apiClient: ApiClient) => {
  return {
    /**
     * List attachments with optional filters
     *
     * @param params - Filter parameters
     * @returns List of attachments
     */
    list: (params?: {
      entity_type?: string;
      entity_id?: string;
      limit?: number;
      offset?: number;
    }) => apiClient.get<ApiResponse<AttachmentResponse[]>>('/api/v1/attachments', { params }),

    /**
     * Get attachment by ID
     *
     * @param id - Attachment ID
     * @returns Attachment details
     */
    get: (id: string) =>
      apiClient.get<ApiResponse<AttachmentResponse>>(`/api/v1/attachments/${id}`),

    /**
     * Get attachments by entity
     *
     * @param entityType - Entity type (e.g., 'logo', 'po', 'grn')
     * @param entityId - Entity ID
     * @returns List of attachments for the entity
     */
    getByEntity: (entityType: string, entityId: string) =>
      apiClient.get<ApiResponse<AttachmentResponse[]>>(
        `/api/v1/attachments/entity/${entityType}/${entityId}`
      ),

    /**
     * Upload attachment
     *
     * @param file - File to upload
     * @param entityType - Entity type
     * @param entityId - Entity ID
     * @returns Uploaded attachment details
     */
    upload: (file: File, entityType: string, entityId: string) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entity_type', entityType);
      formData.append('entity_id', entityId);
      return apiClient.post<ApiResponse<AttachmentResponse>>(
        '/api/v1/attachments',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    },

    /**
     * Get attachment info with file size
     *
     * @param id - Attachment ID
     * @returns Attachment info including file size
     */
    getInfo: (id: string) =>
      apiClient.get<ApiResponse<AttachmentInfoResponse>>(`/api/v1/attachments/${id}/info`),

    /**
     * Get download URL for attachment
     *
     * @param id - Attachment ID
     * @returns Download URL
     */
    getDownloadUrl: (id: string) =>
      apiClient.get<ApiResponse<{ url: string }>>(`/api/v1/attachments/${id}/url`),

    /**
     * Download attachment
     *
     * @param id - Attachment ID
     * @returns File blob
     */
    download: (id: string) =>
      apiClient.get<Blob>(`/api/v1/attachments/${id}/download`, {
        headers: { 'Accept': 'application/octet-stream' },
      }),

    /**
     * Delete attachment
     *
     * @param id - Attachment ID
     * @returns Void on success
     */
    delete: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/api/v1/attachments/${id}`),
  };
};

export default createAttachmentService;
