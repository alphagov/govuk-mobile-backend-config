// eslint-disable-next-line n/no-unpublished-import
import {mock, instance, resetCalls, when, verify, anything} from '@typestrong/ts-mockito';
import {FileHandler} from '../src/file-handler';
import {GenerateOperation, ValidateOperation} from '../src/processor';
import {Validator} from '../src/validator';
import {ValidationResult} from '../src/validator/validation-result';
import {ConfigVersionDocument} from './utils/version-document';
import {Transformer} from '../src/transformer';
import {MockCvdValidator, MockTransformer} from './utils/mocks';
import {ConfigVersionDocumentBundle} from '../src/types/config-version-document';

const dummyFilename = './my-files/0.1.2.yaml';

const fileHandler: FileHandler = mock(FileHandler);
const cvdValidator: Validator<ConfigVersionDocumentBundle> = mock(MockCvdValidator);
const transformer: Transformer = mock(MockTransformer);

describe('ValidateOperation', () => {
  let op: ValidateOperation;
  beforeEach(() => {
    resetCalls(fileHandler);
    resetCalls(cvdValidator);
    op = new ValidateOperation(
      {
        filename: dummyFilename,
      },
      instance(fileHandler),
      instance(cvdValidator)
    );
  });

  it('completes without error when config is valid', () => {
    when(fileHandler.extractVersionFromFilename(dummyFilename)).thenReturn('0.1.2');
    when(fileHandler.loadDocument(dummyFilename)).thenReturn(ConfigVersionDocument.VALID);
    when(cvdValidator.validate(anything())).thenReturn(new ValidationResult());
    op.run();
    verify(cvdValidator.validate(anything())).once();
  });

  it('throws an error when config is not valid', () => {
    const invalidConfigResult = new ValidationResult();
    invalidConfigResult.putError('config is actually a banana');
    when(fileHandler.extractVersionFromFilename(dummyFilename)).thenReturn('0.1.2');
    when(fileHandler.loadDocument(dummyFilename)).thenReturn(ConfigVersionDocument.VALID);
    when(cvdValidator.validate(anything())).thenReturn(invalidConfigResult);
    expect(() => {
      op.run();
    }).toThrow('config is actually a banana');
  });
});

describe('GenerateOperation', () => {
  let op: GenerateOperation;
  beforeEach(() => {
    resetCalls(fileHandler);
    resetCalls(transformer);
    op = new GenerateOperation(
      {
        filename: dummyFilename,
      },
      instance(fileHandler),
      instance(transformer)
    );
  });

  it('calls transform with the correct object', () => {
    when(fileHandler.loadDocument(dummyFilename)).thenReturn(ConfigVersionDocument.VALID);
    when(transformer.transform(ConfigVersionDocument.VALID)).thenReturn({});
    op.run();
    verify(transformer.transform(ConfigVersionDocument.VALID)).once();
  });
});
