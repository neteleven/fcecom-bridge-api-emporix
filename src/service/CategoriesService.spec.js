const httpClient = require('../utils/http-client');
const data = require('./CategoriesService.spec.data');
const service = require('./CategoriesService');

jest.mock('../../src/utils/http-client');

describe('CategoriesService', () => {
    const testLang = 'EN';

    describe('categoriesGet', () => {
        it('returns the categories as list (no parent ID)', async () => {
            const expectedCategoryLength = 13; /* number of all categories in response no matter the depth */
            httpClient.get.mockResolvedValue({ data: data.categoriesGet.categories });

            const result = await service.categoriesGet();

            expect(httpClient.get.mock.calls[0][0]).toEqual('/category/n11showcase/categories?showRoots=false&lang=undefined');
            expect(result.categories.length).toEqual(expectedCategoryLength);
            for (let i = 0; i < data.categoriesGet.categories.length; i++) {
                // Check if every category from the test data set is present in the result (ignore ordering)
                expect(result.categories.findIndex((category) => category.id === data.categoriesGet.categories[i].id) !== -1).toEqual(true);
            }
            expect(result.hasNext).toEqual(false);
            expect(result.total).toEqual(expectedCategoryLength);
        });
        it('returns the categories as list (with parent ID)', async () => {
            const expectedCategoryLength = 13; /* number of all subcategories of the first category in response */
            httpClient.get.mockResolvedValue({ data: data.categoriesGet.categories });

            const result = await service.categoriesGet(data.categoriesGet.categories[0].id);

            expect(httpClient.get.mock.calls[0][0]).toEqual('/category/n11showcase/categories/aac8ba09-62a3-4926-9e8f-2476f6b90270/subcategories?lang=undefined');
            expect(result.categories.length).toEqual(expectedCategoryLength);
            expect(result.categories[0].id).toEqual('aac8ba09-62a3-4926-9e8f-2476f6b90270');
        });
    });
    describe('categoryTreeGet', () => {
        it('returns the categories as tree (no parent ID)', async () => {
            httpClient.get.mockResolvedValue({ data: data.buildCategoryTree.data });

            const result = await service.categoryTreeGet();

            expect(httpClient.get.mock.calls[0][0]).toEqual('/category/n11showcase/category-trees?lang=undefined');
            expect(result.categorytree[0].id).toEqual('aac8ba09-62a3-4926-9e8f-2476f6b90270');
            expect(result.categorytree[0].children[0].id).toEqual('91f6441a-fcdb-4981-b97e-a7a4ee421d50');
            expect(result.categorytree[0].children[1].id).toEqual('d904e984-a794-4211-b9c3-af16efab69c7');
            expect(result.categorytree[0].children[2].id).toEqual('b6df5541-ba8e-4c23-b803-8735a8ae1c98');
            expect(result.hasNext).toEqual(false);
            expect(result.total).toEqual(data.buildCategoryTree.total);
        });
        it('returns the categories as tree (with parent ID)', async () => {
            httpClient.get.mockResolvedValue({ data: data.buildCategoryTree.data });

            const result = await service.categoryTreeGet(data.categoriesGet.categories[0].id);

            expect(httpClient.get.mock.calls[0][0]).toEqual('/category/n11showcase/category-trees?lang=undefined');
            expect(result.categorytree[0].id).toEqual('91f6441a-fcdb-4981-b97e-a7a4ee421d50');
            expect(result.categorytree[1].id).toEqual('d904e984-a794-4211-b9c3-af16efab69c7');
            expect(result.categorytree[2].children[0].id).toEqual('09c4b9d6-1d6c-491f-af5e-df2ea9b2024e');
            expect(result.hasNext).toEqual(false);
            expect(result.total).toEqual(3);
        });
        it('returns the categories as tree (with parent ID from level 2)', async () => {
            httpClient.get.mockResolvedValue({ data: data.buildCategoryTree.data });

            const result = await service.categoryTreeGet('91f6441a-fcdb-4981-b97e-a7a4ee421d50');

            expect(httpClient.get.mock.calls[0][0]).toEqual('/category/n11showcase/category-trees?lang=undefined');
            expect(result.categorytree[0].id).toEqual('388ed55f-15b1-418b-a270-33cfcbbd18d4');
            expect(result.categorytree[1].id).toEqual('1a3b6e13-3a93-4bb7-b843-29d4a04fd89d');
            expect(result.hasNext).toEqual(false);
            expect(result.total).toEqual(2);
        });
    });

    describe('categoriesCategoryIdsGet', () => {
        it('returns the categories pages with the given IDs', async () => {
            const categoryIds = [data.categoriesGet.categories[0].id, -999];
            const testCategory1 = data.categoriesGet.categories[0];
            httpClient.get.mockResolvedValueOnce({ data: testCategory1, status: 200 }).mockResolvedValue({ data: { errors: true } });

            const result = await service.categoriesCategoryIdsGet(categoryIds);

            expect(result.categories.length).toEqual(1);
            expect(result.categories[0].id).toEqual(categoryIds[0]);
            expect(result.total).toEqual(1);
        });
    });
});
