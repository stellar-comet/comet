/**
 * @jest-environment node
 */

import { shouldQuit } from '../../src/lib/system/squirrel';

jest.mock('electron-squirrel-startup', () => ({ mock: true }));

describe('shouldQuit', () => {
  test('returns simply electron-squirrel-startup', () => {
    expect(shouldQuit()).toEqual({ mock: true });
  });
});
