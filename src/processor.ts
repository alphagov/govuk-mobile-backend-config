import {FileHandler} from './file-handler';
import {ConfigTransformer, Transformer} from './transformer';
import {ConfigVersionDocumentBundle} from './types/config-version-document';
import {ConfigVersionDocumentValidator, Validator} from './validator';

/**
 * This class is responsible for injecting dependencies and connecting the relevant
 * classes together, delegating requests to the correct place.
 */
export class Processor {
  fileHandler = new FileHandler();
  cvdValidator = new ConfigVersionDocumentValidator();
  transformer = new ConfigTransformer();

  validate(filename: string) {
    const op = new ValidateOperation({filename}, this.fileHandler, this.cvdValidator);
    op.run();
  }

  generate(filename: string) {
    this.validate(filename);
    const op = new GenerateOperation({filename}, this.fileHandler, this.transformer);
    op.run();
  }

  build(inDir: string, outDir: string, noSig: boolean, localSig: boolean) {
    const op = new BuildOperation({
      inputDirectory: inDir,
      outputDirectory: outDir,
      omitSignature: noSig,
      localSignature: localSig,
    });
    op.run();
  }
}

abstract class Operation<Params> {
  params: Params;
  constructor(params: Params) {
    this.params = params;
  }
  abstract run(): void;
}

interface VersionDocumentParams {
  filename: string;
}

export class ValidateOperation extends Operation<VersionDocumentParams> {
  fileHandler: FileHandler;
  cvdValidator: Validator<ConfigVersionDocumentBundle>;

  constructor(
    params: VersionDocumentParams,
    fileHandler: FileHandler,
    cvdValidator: Validator<ConfigVersionDocumentBundle>
  ) {
    super(params);
    this.fileHandler = fileHandler;
    this.cvdValidator = cvdValidator;
  }

  run(): void {
    const versionDocument = this.fileHandler.loadDocument(this.params.filename);
    const versionString = this.fileHandler.extractVersionFromFilename(this.params.filename);
    const result = this.cvdValidator.validate({
      versionString,
      versionDocument,
    });

    if (!result.isValid()) {
      throw result.getMessage();
    }
  }
}

export class GenerateOperation extends Operation<VersionDocumentParams> {
  fileHandler: FileHandler;
  transformer: Transformer;

  constructor(params: VersionDocumentParams, fileHandler: FileHandler, transformer: Transformer) {
    super(params);
    this.fileHandler = fileHandler;
    this.transformer = transformer;
  }

  run(): void {
    const versionDocument = this.fileHandler.loadDocument(this.params.filename);
    const output = this.transformer.transform(versionDocument);
    console.log(JSON.stringify(output, null, 2));
  }
}

interface BuildParams {
  inputDirectory: string;
  outputDirectory: string;
  omitSignature: boolean;
  localSignature: boolean;
}

export class BuildOperation extends Operation<BuildParams> {
  run(): void {
    throw new Error('Method not implemented.');
  }
}
