import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('CategoryResolver (e2e)', () => {
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
    const mutation = `
      mutation {
        createCategory(createCategoryInput: { name: "New Category" }) {
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
      name: 'New Category',
    });

    const categoryInDb = await prismaService.category.findUnique({
      where: { id: response.body.data.createCategory.id },
    });
    expect(categoryInDb).not.toBeNull();
  });

  it('should fetch all categories', async () => {
    await prismaService.category.createMany({
      data: [
        { name: 'Category 1' },
        { name: 'Category 2' },
      ],
    });

    const query = `
      query {
        categories {
          id
          name
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.categories).toHaveLength(2);
    expect(response.body.data.categories[0]).toMatchObject({
      name: 'Category 1',
    });
    expect(response.body.data.categories[1]).toMatchObject({
      name: 'Category 2',
    });
  });

  it('should fetch a category by ID', async () => {
    const category = await prismaService.category.create({
      data: {
        name: 'Category 1',
      },
    });

    const query = `
      query {
        category(id: ${category.id}) {
          id
          name
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.category).toMatchObject({
      name: 'Category 1',
    });
  });

  it('should update a category', async () => {
    const category = await prismaService.category.create({
      data: {
        name: 'Old Category',
      },
    });

    const mutation = `
      mutation {
        updateCategory(id: ${category.id}, updateCategoryInput: { name: "Updated Category" }) {
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
      name: 'Updated Category',
    });

    const updatedCategoryInDb = await prismaService.category.findUnique({
      where: { id: category.id },
    });
    expect(updatedCategoryInDb.name).toBe('Updated Category');
  });

  it('should delete a category', async () => {
    const category = await prismaService.category.create({
      data: {
        name: 'Category to Delete',
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
    await prismaService.category.createMany({
      data: [
        { name: 'Searchable Category One' },
        { name: 'Searchable Category Two' },
      ],
    });

    const query = `
      query {
        searchCategories(keyword: "Searchable") {
          id
          name
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.searchCategories).toHaveLength(2);
    expect(response.body.data.searchCategories[0]).toMatchObject({
      name: 'Searchable Category One',
    });
    expect(response.body.data.searchCategories[1]).toMatchObject({
      name: 'Searchable Category Two',
    });
  });

  it('should paginate categories', async () => {
    await prismaService.category.createMany({
      data: [
        { name: 'Category 1' },
        { name: 'Category 2' },
        { name: 'Category 3' },
        { name: 'Category 4' },
        { name: 'Category 5' },
      ],
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
    expect(response.body.data.paginationCategories[0]).toMatchObject({
      name: 'Category 3',
    });
    expect(response.body.data.paginationCategories[1]).toMatchObject({
      name: 'Category 4',
    });
  });
});