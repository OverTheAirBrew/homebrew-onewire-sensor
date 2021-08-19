import { OneWireSensor } from './one-wire-sensor';
import { IPackageConfig } from '@overtheairbrew/homebrew-plugin';

const OtaPackage: IPackageConfig = {
  sensors: [OneWireSensor],
};

export default OtaPackage;
