import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

describe('CategoryService (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prismaService.category.deleteMany(); // Clean up categories before each test
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new category', async () => {
    const categoryName = faker.commerce.department();

    const mutation = `
      mutation {
        createCategory(createCategoryInput: {
          name: "${categoryName}"
        }) {
          id
          name
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.createCategory).toMatchObject({
      name: categoryName,
    });

    const categoryInDb = await prismaService.category.findUnique({
      where: { id: response.body.data.createCategory.id },
    });
    expect(categoryInDb).not.toBeNull();
  });

  it('should fetch all categories', async () => {
    const categoryNames = [faker.commerce.department(), faker.commerce.department()];

    await prismaService.category.createMany({
      data: categoryNames.map((name, index) => ({
        id: index + 1,
        name,
      })),
    });

    const query = `
      query {
        findAllCategories {
          id
          name
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.findAllCategories).toHaveLength(2);
    expect(response.body.data.findAllCategories[0]).toMatchObject({
      name: categoryNames[0],
    });
    expect(response.body.data.findAllCategories[1]).toMatchObject({
      name: categoryNames[1],
    });
  });

  it('should fetch a category by ID', async () => {
    const categoryName = faker.commerce.department();

    const category = await prismaService.category.create({
      data: {
        id: 1,
        name: categoryName,
      },
    });

    const query = `
      query {
        findOne(id: ${category.id}) {
          id
          name
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.findOne).toMatchObject({
      name: categoryName,
    });
  });

  it('should update a category', async () => {
    const oldCategoryName = faker.commerce.department();
    const newCategoryName = faker.commerce.department();

    const category = await prismaService.category.create({
      data: {
        id: 1,
        name: oldCategoryName,
      },
    });

    const mutation = `
      mutation {
        updateCategory(id: ${category.id}, updateCategoryInput: {
          name: "${newCategoryName}"
        }) {
          id
          name
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.updateCategory).toMatchObject({
      name: newCategoryName,
    });

    const updatedCategoryInDb = await prismaService.category.findUnique({
      where: { id: category.id },
    });
    expect(updatedCategoryInDb.name).toBe(newCategoryName);
  });

  it('should delete a category', async () => {
    const categoryName = faker.commerce.department();

    const category = await prismaService.category.create({
      data: {
        id: 1,
        name: categoryName,
      },
    });

    const mutation = `
      mutation {
        removeCategory(id: ${category.id}) {
          id
        }
      }
    `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    const deletedCategoryInDb = await prismaService.category.findUnique({
      where: { id: category.id },
    });
    expect(deletedCategoryInDb).toBeNull();
  });

  it('should search categories by keyword', async () => {
    const searchableNames = [faker.commerce.department(), faker.commerce.department()];
    const keyword = searchableNames[0].split(' ')[0]; // Use the first word as a keyword

    await prismaService.category.createMany({
      data: searchableNames.map((name, index) => ({
        id: index + 1,
        name,
      })),
    });

    const query = `
      query {
        searchCategories(keyword: "${keyword}") {
          id
          name
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.searchCategories.length).toBeGreaterThan(0);
    expect(response.body.data.searchCategories[0].name).toContain(keyword);
  });

  it('should paginate categories', async () => {
    const categoryNames = Array.from({ length: 5 }, () => faker.commerce.department());

    await prismaService.category.createMany({
      data: categoryNames.map((name, index) => ({
        id: index + 1,
        name,
      })),
    });

    const query = `
      query {
        paginationCategories(paginationDto: { skip: 2, take: 2 }) {
          id
          name
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.paginationCategories).toHaveLength(2);
    expect(response.body.data.paginationCategories[0].name).toBe(categoryNames[2]);
    expect(response.body.data.paginationCategories[1].name).toBe(categoryNames[3]);
  });
});