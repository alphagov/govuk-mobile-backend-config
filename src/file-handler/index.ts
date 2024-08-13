import {ConfigVersionDocument} from '../types/config-version-document';
import path = require('path');
import {readFileSync} from 'fs';
import {parse} from 'yaml';
import TOML from '@ltd/j-toml';

export class FileHandler {
  // TODO consider if this should be moved elsewhere
  extractVersionFromFilename(filename: string): string {
    return path.basename(filename).replace('.yaml', '').replace('.yml', '').replace('.toml', '');
  }

  loadDocument(filename: string): ConfigVersionDocument {
    const ext = path.extname(filename);
    switch (ext) {
      case '.yaml':
        return this.loadYaml(filename);
      case '.yml':
        return this.loadYaml(filename);
      case '.toml':
        return this.loadToml(filename);
      default:
        throw new Error(`Invalid extension: ${ext}`);
    }
  }

  loadYaml(filename: string): ConfigVersionDocument {
    const file = readFileSync(filename, 'utf-8');
    return parse(file);
  }

  loadToml(filename: string): ConfigVersionDocument {
    // enable parsing of multiline inline tables
    const opts = {
      x: {
        multi: true,
      },
    };

    const file = readFileSync(filename, 'utf-8');

    // there is some strangeness that needs further investigation
    // where what comes out of TOML.parse, whilst serializing to an
    // identical JSON object as yaml.load, behaves differently when
    // subjected to lodash.merge. the workaround is to serialize
    // to JSON and then parse back to an object
    return JSON.parse(JSON.stringify(TOML.parse(file, opts))) as unknown as ConfigVersionDocument;
  }
}
