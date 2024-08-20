import { Test, TestingModule } from '@nestjs/testing';
import { ApolloServer } from 'apollo-server-express';
import { AppModule } from 'src/app/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
//@ts-ignore
import { createTestClient } from 'apollo-server-testing';

describe('PublisherResolver (e2e)', () => {
  let server: any;
  let gqlTestClient: ReturnType<typeof createTestClient>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    server = app.get(ApolloServer);
    gqlTestClient = createTestClient(server);

    // Clear the database to ensure tests are isolated
    const prismaService = app.get(PrismaService);
    await prismaService.$executeRaw`TRUNCATE TABLE "Publisher" CASCADE;`;
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should create a publisher', async () => {
    const CREATE_PUBLISHER_MUTATION = `
      mutation CreatePublisher($data: CreatePublisherInput!) {
        createPublisher(data: $data) {
          id
          name
          description
        }
      }
    `;

    const result = await gqlTestClient.mutate({
      mutation: CREATE_PUBLISHER_MUTATION,
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
    expect(result.data.createPublisher.description).toBe('Test Description');
  });

  it('should update a publisher', async () => {
    // Create a publisher first
    const CREATE_PUBLISHER_MUTATION = `
      mutation CreatePublisher($data: CreatePublisherInput!) {
        createPublisher(data: $data) {
          id
          name
          description
        }
      }
    `;

    const createResult = await gqlTestClient.mutate({
      mutation: CREATE_PUBLISHER_MUTATION,
      variables: {
        data: {
          name: 'Test Publisher',
          description: 'Test Description',
        },
      },
    });

    const publisherId = createResult.data.createPublisher.id;

    // Update the publisher
    const UPDATE_PUBLISHER_MUTATION = `
      mutation UpdatePublisher($id: Int!, $data: UpdatePublisherInput!) {
        updatePublisher(id: $id, data: $data) {
          id
          name
          description
        }
      }
    `;

    const updateResult = await gqlTestClient.mutate({
      mutation: UPDATE_PUBLISHER_MUTATION,
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
    expect(updateResult.data.updatePublisher.description).toBe('Updated Description');
  });

  it('should delete a publisher', async () => {
    // Create a publisher first
    const CREATE_PUBLISHER_MUTATION = `
      mutation CreatePublisher($data: CreatePublisherInput!) {
        createPublisher(data: $data) {
          id
          name
          description
        }
      }
    `;

    const createResult = await gqlTestClient.mutate({
      mutation: CREATE_PUBLISHER_MUTATION,
      variables: {
        data: {
          name: 'Test Publisher',
          description: 'Test Description',
        },
      },
    });

    const publisherId = createResult.data.createPublisher.id;

    // Delete the publisher
    const DELETE_PUBLISHER_MUTATION = `
      mutation DeletePublisher($id: Int!) {
        deletePublisher(id: $id) {
          id
          name
          description
        }
      }
    `;

    const deleteResult = await gqlTestClient.mutate({
      mutation: DELETE_PUBLISHER_MUTATION,
      variables: {
        id: publisherId,
      },
    });

    expect(deleteResult.errors).toBeUndefined();
    expect(deleteResult.data.deletePublisher.id).toBe(publisherId);
    expect(deleteResult.data.deletePublisher.name).toBe('Test Publisher');
  });

  it('should get a publisher', async () => {
    // Create a publisher first
    const CREATE_PUBLISHER_MUTATION = `
      mutation CreatePublisher($data: CreatePublisherInput!) {
        createPublisher(data: $data) {
          id
          name
          description
        }
      }
    `;

    const createResult = await gqlTestClient.mutate({
      mutation: CREATE_PUBLISHER_MUTATION,
      variables: {
        data: {
          name: 'Test Publisher',
          description: 'Test Description',
        },
      },
    });

    const publisherId = createResult.data.createPublisher.id;

    // Get the publisher
    const GET_PUBLISHER_QUERY = `
      query GetPublisher($id: Int!) {
        getPublisher(id: $id) {
          id
          name
          description
        }
      }
    `;

    const getResult = await gqlTestClient.query({
      query: GET_PUBLISHER_QUERY,
      variables: {
        id: publisherId,
      },
    });

    expect(getResult.errors).toBeUndefined();
    expect(getResult.data.getPublisher.id).toBe(publisherId);
    expect(getResult.data.getPublisher.name).toBe('Test Publisher');
    expect(getResult.data.getPublisher.description).toBe('Test Description');
  });

  it('should paginate publishers', async () => {
    // Create multiple publishers
    for (let i = 0; i < 15; i++) {
      await gqlTestClient.mutate({
        mutation: `
          mutation CreatePublisher($data: CreatePublisherInput!) {
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

    // Paginate publishers
    const PAGINATE_PUBLISHERS_QUERY = `
      query GetPublishers($skip: Int, $take: Int) {
        getPublishers(skip: $skip, take: $take) {
          id
          name
        }
      }
    `;

    const paginateResult = await gqlTestClient.query({
      query: PAGINATE_PUBLISHERS_QUERY,
      variables: {
        skip: 0,
        take: 10,
      },
    });

    expect(paginateResult.errors).toBeUndefined();
    expect(paginateResult.data.getPublishers.length).toBe(10);
  });

  it('should search publishers', async () => {
    // Create a publisher to search
    await gqlTestClient.mutate({
      mutation: `
        mutation CreatePublisher($data: CreatePublisherInput!) {
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
    const SEARCH_PUBLISHERS_QUERY = `
      query SearchPublishers($search: String!) {
        searchPublishers(search: $search) {
          id
          name
        }
      }
    `;

    const searchResult = await gqlTestClient.query({
      query: SEARCH_PUBLISHERS_QUERY,
      variables: {
        search: 'Special',
      },
    });

    expect(searchResult.errors).toBeUndefined();
    expect(searchResult.data.searchPublishers).toHaveLength(1);
    expect(searchResult.data.searchPublishers[0].name).toBe('Special Publisher');
  });
});
