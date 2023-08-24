export abstract class Warning {
  message: string;
  locations: Location[];
  path: string[];
  extensions: {
    code: string;
    typeName: string;
    fieldName: string;
  };
}
