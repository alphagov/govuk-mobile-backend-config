import {FileHandler} from '../../src/file-handler';

const fileHandler = new FileHandler();

describe('FileHandler#extractVersionFromFilename', () => {
  it('extracts a basic version number from a filename', () => {
    const filename = '/path/to/file/7.6.1.yaml';
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual('7.6.1');
  });

  it('extracts a basic version number from a filename with a yml extension', () => {
    const filename = '/path/to/file/7.6.1.yml';
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual('7.6.1');
  });

  it('also works with toml', () => {
    const filename = '/path/to/file/7.6.1.toml';
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual('7.6.1');
  });

  it('extracts a version number with additional details from a filename', () => {
    const filename = '/path/to/file/7.6.1+rc2.yaml';
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual('7.6.1+rc2');
  });

  it('extracts a version number even with no file extension', () => {
    const filename = '/path/to/file/7.6.1';
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual('7.6.1');
  });

  it('extracts version number from a relative path', () => {
    const filename = './files/7.6.1.yaml';
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual('7.6.1');
  });

  it('extracts version number from a relative path with no extension', () => {
    const filename = './files/7.6.1';
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual('7.6.1');
  });

  it('extracts version number from a filename with no path', () => {
    const filename = '7.6.1.yaml';
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual('7.6.1');
  });

  it('extracts version number from a filename with no path and no extension', () => {
    const filename = '7.6.1';
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual('7.6.1');
  });

  it('extracts complex version number from a filename with no path', () => {
    const filename = '7.6.1+rc3.yaml';
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual('7.6.1+rc3');
  });
});
