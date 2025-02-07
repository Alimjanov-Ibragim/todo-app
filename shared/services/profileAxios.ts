// import { addHeadersToRequest } from '@/shared/interceptors/addHeadersToRequest.interceptor';
// import { errorHandlerInterceptor } from '@/shared/interceptors/errorHandler.interceptor';
import { z } from 'zod';

import { profileSchema } from '@/app/validationSchemas';
import { AxiosService } from '@/shared/services/axiosService.service';

type TProfileSchema = z.infer<typeof profileSchema>;

const baseAxiosConfig = {
  baseURL: '/'
};

const AxiosUrls = {
  register: '/api/auth/register',
  logout: '/api/auth/logout'
};

const axiosService = new AxiosService();
const profileAxios = axiosService.createAxios(baseAxiosConfig);
// axiosService.addInterceptorsOnRequestFulfilled([addHeadersToRequest]);
// axiosService.addInterceptorsOnResponseRejected([errorHandlerInterceptor]);

export class ProfileService {
  public async registerUser(data: TProfileSchema) {
    return profileAxios.post(AxiosUrls.register, data);
  }

  public async logout() {
    return profileAxios.post(AxiosUrls.logout);
  }
}

export const ProfileServiceInstance = new ProfileService();
