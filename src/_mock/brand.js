import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const brands = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name_en: faker.name.findName(),
  name_ar: faker.company.companyName(),
  avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
}));

export default brands;
