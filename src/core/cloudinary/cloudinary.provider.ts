import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    cloudinary.config({
      cloud_name: "dop8r12l2",
      api_key: "432867716543159",
      api_secret: "ZEPxMNB3QMtP9ILeXQAf3ICvuIM",
    });

    return cloudinary;
  },
};

