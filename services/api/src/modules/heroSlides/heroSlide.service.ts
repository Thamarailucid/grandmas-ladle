import * as repository from './heroSlide.repository.js';

export const getHeroSlides = async () => {
  return await repository.getHeroSlides();
};

export const getPublicHeroSlides = async () => {
  return await repository.getPublicHeroSlides();
};

export const getHeroSlideById = async (id: string) => {
  return await repository.getHeroSlideById(id);
};

export const createHeroSlide = async (data: any) => {
  return await repository.createHeroSlide(data);
};

export const updateHeroSlide = async (id: string, data: any) => {
  return await repository.updateHeroSlide(id, data);
};

export const deleteHeroSlide = async (id: string) => {
  return await repository.deleteHeroSlide(id);
};
