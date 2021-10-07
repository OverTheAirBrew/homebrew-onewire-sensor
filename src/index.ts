import { IPackageConfig } from '@overtheairbrew/homebrew-plugin';
import { join } from 'path';
import { OneWireSensor } from './one-wire-sensor';

const OtaPackage: IPackageConfig = {
  sensors: [OneWireSensor],
  localesDirectory: join(__dirname, 'locales'),
};

export default OtaPackage;
