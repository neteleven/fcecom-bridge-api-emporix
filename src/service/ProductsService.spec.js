const httpClient = require('../utils/http-client');
const data = require('./ProductsService.spec.data');
const service = require('./ProductsService');

jest.mock('../../src/utils/http-client');

describe('ProductsService', () => {
    describe('productsGet', () => {
        it('fetches product data and maps it to internal type', async () => {
            const body = {
                page: 1,
                categoryId: 456,
                q: 'KEYWORD'
            };
            httpClient.get.mockResolvedValue({ data: data.fetchProducts, status: 200 });

            const result = await service.productsGet(body);

            expect(httpClient.get.mock.calls[0][0]).toContain(`path/to/OCC/products/search`);
            expect(result.products.length).toEqual(data.fetchProducts.products.length);
            result.products.forEach((product, index) => {
                expect(product.id).toEqual(data.fetchProducts.products[index].code);
                expect(product.label).toEqual(data.fetchProducts.products[index].name);
                expect(product.extract).toEqual(data.fetchProducts.products[index].url);
            });
            expect(result.total).toEqual(data.fetchProducts.products.length);
            expect(result.hasNext).toEqual(data.fetchProducts.pagination.currentPage + 1 > data.fetchProducts.pagination.totalPages);
        });
    });
    describe('productsProductIdsGet', () => {
        it('fetches product data based on provided ids', async () => {
            const testProduct1 = data.fetchProducts.products[0];
            const testProduct2 = data.fetchProducts.products[1];
            const testProductIds = [testProduct1.code, testProduct2.code];
            httpClient.get.mockResolvedValueOnce({ data: testProduct1 }).mockResolvedValue({ data: testProduct2 });

            const result = await service.productsProductIdsGet(testProductIds);

            result.products.forEach((page) => {
                expect(page.id).toBeDefined();
            });
            expect(result.total).toEqual(2);
        });
    });
});
