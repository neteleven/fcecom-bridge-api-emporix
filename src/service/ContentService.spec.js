const service = require('./ContentService');

describe('ContentService', () => {
  it('contentGet', async () => {
    const result = await service.contentGet( 'testPage', 'EN');

    expect(result.content).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.hasNext).toBe(false);
  });
  it('contentContentIdsGet', async () => {
    const result = await service.contentContentIdsGet([ 1, 2 ,3 ], 'EN');

    expect(result.content).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.hasNext).toBe(false);
  });
  it('getContentUrl', async () => {
    const result = await service.getContentUrl('testContentId', 'EN');

    expect(result).toEqual('');
  });
  it('getContentIdByUrl', async () => {
    const result = await service.getContentIdByUrl('https://content-url.local', 'EN');

    expect(result).toEqual({ error: 'not supported' });
  });
  it('contentContentIdDelete', async () => {
    await service.contentContentIdDelete('testContentId');
  });
  it('contentPost', async () => {
    const result = await service.contentPost('payload');

    expect(result).toEqual({ error: 'not supported' });
  });
  it('contentPost', async () => {
    const result = await service.contentContentIdPut('payload', 'testContentId');

    expect(result).toEqual({ error: 'not supported' });
  });
});
