// lib/apiFetch.js
import envConfig from "@/configs/envConfig";

const BASE_URL = envConfig.NEXT_PUBLIC_BACKEND_URL; // Thay bằng base URL của backend
const DEFAULT_TIMEOUT = 10000; // 10 giây

// Lớp xử lý lỗi tùy chỉnh
class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Hàm tạo timeout cho fetch
const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new ApiError('Request timed out', null, null)), ms);
  });
  return Promise.race([promise, timeout]);
};

// Hàm làm mới token
const refreshToken = async () => {
  const response = await fetch(`${BASE_URL}/refresh-token`, {
    method: 'POST',
    credentials: 'include', // Gửi refresh token trong HTTP-only cookie
  });

  if (!response.ok) {
    throw new ApiError('Failed to refresh token', response.status, null);
  }

  const data = await response.json();
  return data.access_token; // Giả định backend trả về access_token mới
};

// Interceptor mặc định
const defaultInterceptors = {
  request: async (config) => config, // Có thể thêm logic như thêm header
  response: async (response) => response, // Có thể xử lý response
  error: async (error) => Promise.reject(error), // Xử lý lỗi
};

// Hàm chính: apiFetch
const apiFetch = async (endpoint, options = {}, interceptors = defaultInterceptors) => {
  const controller = new AbortController();
  const { signal } = controller;

  // Cấu hình mặc định
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Gửi HTTP-only cookies
    signal, // Hỗ trợ hủy request
    ...options,
  };

  // Áp dụng request interceptor
  const modifiedConfig = await interceptors.request(config);

  // Tạo URL đầy đủ
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    // Gửi request với timeout
    let response = await withTimeout(
      fetch(url, modifiedConfig),
      options.timeout || DEFAULT_TIMEOUT
    );

    // Áp dụng response interceptor
    response = await interceptors.response(response);

    // Kiểm tra lỗi HTTP
    if (!response.ok) {
      if (response.status === 401) {
        // Thử làm mới token
        try {
          const newAccessToken = await refreshToken();
          // Thêm token mới vào headers
          modifiedConfig.headers.Authorization = `Bearer ${newAccessToken}`;
          // Thử lại request
          response = await withTimeout(
            fetch(url, modifiedConfig),
            options.timeout || DEFAULT_TIMEOUT
          );
        } catch (refreshError) {
          throw new ApiError('Authentication failed', 401, refreshError);
        }
      }

      // Nếu vẫn lỗi, ném lỗi với chi tiết
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'API request failed',
        response.status,
        errorData
      );
    }

    // Trả về dữ liệu JSON
    return response.json();
  } catch (error) {
    // Áp dụng error interceptor
    return interceptors.error(error);
  }
};

// Hàm hủy request
apiFetch.cancel = (controller) => {
  controller.abort();
};

// Tạo instance với cấu hình tùy chỉnh
apiFetch.create = (customConfig = {}, customInterceptors = {}) => {
  const interceptors = { ...defaultInterceptors, ...customInterceptors };
  return (endpoint, options = {}) =>
    apiFetch(endpoint, { ...customConfig, ...options }, interceptors);
};

// Export
export default apiFetch;