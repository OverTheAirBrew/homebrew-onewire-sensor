import { Sensor, SensorToken } from '@overtheairbrew/homebrew-plugin';
import {
  NumberProperty,
  SelectBoxProperty,
} from '@overtheairbrew/homebrew-plugin/dist/properties';
import { OneWireFactory } from '@overtheairbrew/raspberrypi-one-wire';
import { Container, Service } from 'typedi';

export interface IOneWireParams {
  sensor_id: string;
  sensorAddress: string;
  offset: number;
}

@Service({ id: SensorToken, multiple: true })
export class OneWireSensor extends Sensor {
  private readonly factory: OneWireFactory;

  constructor() {
    super('one-wire', [
      new SelectBoxProperty(
        'one-wire.sensorAddress',
        'Sensor Address',
        true,
        () => this.getSensors(),
      ),
      new NumberProperty('one-wire.offset', false),
    ]);
    this.factory = Container.get<OneWireFactory>(OneWireFactory);
  }

  private async deviceExists(address: string) {
    const devices = await this.factory.findDevices(
      `/sys/bus/w1/devices/${address}/w1_slave`,
    );
    return devices.length > 0;
  }

  private async getSensors() {
    const sensors = await this.factory.findDevices();
    return sensors;
  }

  public async run(params: IOneWireParams): Promise<number> {
    if (!(await this.deviceExists(params.sensorAddress))) return;

    const device = await this.factory.fromDevice(params.sensorAddress);
    const tempReading = await device.current();

    const offset = params.offset || 0;
    const tempWithOffset = tempReading.celcius + offset;

    await this.dataRecieved(params.sensor_id, tempWithOffset);
    return tempWithOffset;
  }
}
