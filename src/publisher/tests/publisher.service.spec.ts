import { Test, TestingModule } from '@nestjs/testing';
import { ApolloServer } from 'apollo-server-express';
import { AppModule } from 'src/app/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublisherService } from 'src/publisher/publisher.service';

describe('PublisherService (e2e)', () => {
  let app: ApolloServer;
  let prismaService: PrismaService;
  let publisherService: PublisherService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PublisherService, PrismaService],
    }).compile();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    publisherService = moduleFixture.get<PublisherService>(PublisherService);

    app = moduleFixture.createNestApplication().get(ApolloServer);
    await app.start();
  });

  afterAll(async () => {
    await app.stop();
    await prismaService.$disconnect();
  });

  it('should create a publisher', async () => {
    const result = await app.executeOperation({
      query: `
        mutation CreatePublisher($data: PublisherCreateInput!) {
          createPublisher(data: $data) {
            id
            name
            description
          }
        }
      `,
      variables: {
        data: {
          name: 'Test Publisher',
          description: 'Test Description',
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data.createPublisher).toHaveProperty('id');
    expect(result.data.createPublisher.name).toBe('Test Publisher');
  });

  it('should update a publisher', async () => {
    const createResult = await app.executeOperation({
      query: `
        mutation CreatePublisher($data: PublisherCreateInput!) {
          createPublisher(data: $data) {
            id
            name
            description
          }
        }
      `,
      variables: {
        data: {
          name: 'Test Publisher',
          description: 'Test Description',
        },
      },
    });

    const publisherId = createResult.data.createPublisher.id;
    
    const updateResult = await app.executeOperation({
      query: `
        mutation UpdatePublisher($id: Int!, $data: PublisherUpdateInput!) {
          updatePublisher(id: $id, data: $data) {
            id
            name
            description
          }
        }
      `,
      variables: {
        id: publisherId,
        data: {
          name: 'Updated Publisher',
          description: 'Updated Description',
        },
      },
    });

    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data.updatePublisher.name).toBe('Updated Publisher');
  });

  it('should delete a publisher', async () => {
    // First, create a publisher
    const createResult = await app.executeOperation({
      query: `
        mutation CreatePublisher($data: PublisherCreateInput!) {
          createPublisher(data: $data) {
            id
            name
            description
          }
        }
      `,
      variables: {
        data: {
          name: 'Test Publisher',
          description: 'Test Description',
        },
      },
    });

    const publisherId = createResult.data.createPublisher.id;

    // Then, delete the publisher
    const deleteResult = await app.executeOperation({
      query: `
        mutation DeletePublisher($id: Int!) {
          deletePublisher(id: $id) {
            id
            name
            description
          }
        }
      `,
      variables: {
        id: publisherId,
      },
    });

    expect(deleteResult.errors).toBeUndefined();
    expect(deleteResult.data.deletePublisher.id).toBe(publisherId);
  });

  it('should paginate publishers', async () => {
    // Create a few publishers
    for (let i = 0; i < 15; i++) {
      await app.executeOperation({
        query: `
          mutation CreatePublisher($data: PublisherCreateInput!) {
            createPublisher(data: $data) {
              id
              name
            }
          }
        `,
        variables: {
          data: {
            name: `Publisher ${i}`,
            description: `Description ${i}`,
          },
        },
      });
    }

    // Paginate
    const paginateResult = await app.executeOperation({
      query: `
        query PaginatePublishers($skip: Int, $take: Int) {
          paginatePublishers(skip: $skip, take: $take) {
            id
            name
          }
        }
      `,
      variables: {
        skip: 0,
        take: 10,
      },
    });

    expect(paginateResult.errors).toBeUndefined();
    expect(paginateResult.data.paginatePublishers.length).toBe(10);
  });

  it('should search publishers', async () => {
    // Create a publisher to search
    await app.executeOperation({
      query: `
        mutation CreatePublisher($data: PublisherCreateInput!) {
          createPublisher(data: $data) {
            id
            name
          }
        }
      `,
      variables: {
        data: {
          name: 'Special Publisher',
          description: 'Special Description',
        },
      },
    });

    // Search publishers
    const searchResult = await app.executeOperation({
      query: `
        query SearchPublishers($search: String!) {
          searchPublishers(search: $search) {
            id
            name
          }
        }
      `,
      variables: {
        search: 'Special',
      },
    });

    expect(searchResult.errors).toBeUndefined();
    expect(searchResult.data.searchPublishers).toHaveLength(1);
    expect(searchResult.data.searchPublishers[0].name).toBe('Special Publisher');
  });
});