import * as fs from 'fs';
import * as path from 'path';

interface ContentItem {
  url: string;
  [key: string]: any;
}

interface TopicFile {
  title: string;
  content: ContentItem[];
  [key: string]: any;
}

function createUrlToTopicMapping() {
  const topicsDir = 'static/topics/';
  const mapping: Record<string, string[]> = {};
  const outputFilename = 'url-to-topic-mapping';
  const {exec} = require('child_process');

  const files = fs.readdirSync(topicsDir);

  files.forEach(filename => {
    if (
      filename === '.' ||
      filename === '..' ||
      filename === 'list' ||
      filename === outputFilename
    ) {
      return;
    }

    const filePath = path.join(topicsDir, filename);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const json: TopicFile = JSON.parse(fileContent);
      const topic = json.title;

      json.content.forEach(item => {
        if (mapping[item.url]) {
          mapping[item.url].push(topic);
        } else {
          mapping[item.url] = [topic];
        }
      });
    } catch (error) {
      console.error(`Error processing file ${filename}:`, error);
    }
  });

  const outputPath = path.join(topicsDir, outputFilename);
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2), 'utf-8');

  exec(`git diff ${outputPath}`, (err: any, stdout: string, stderr: string) => {
    if (err) {
      console.error(`Error executing command: ${err}`);
      return;
    }

    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }

    if (stdout) {
      console.log(
        'URL to Topic mapping file has been updated. Remember to commit, push and merge these changes!'
      );
    } else {
      console.log('URL to Topic mapping file is up to date. No changes detected.');
    }
  });
}

module.exports = {
  createUrlToTopicMapping,
};
