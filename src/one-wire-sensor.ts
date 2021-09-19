import { Sensor, SensorToken } from '@overtheairbrew/homebrew-plugin';
import { SelectBoxProperty } from '@overtheairbrew/homebrew-plugin/dist/properties';
import { OneWireFactory } from '@overtheairbrew/raspberrypi-one-wire';
import { Container, Service } from 'typedi';

export interface IOneWireParams {
  sensor_id: string;
  sensorAddress: string;
}

@Service({ id: SensorToken, multiple: true })
export class OneWireSensor extends Sensor {
  private readonly factory: OneWireFactory;

  constructor() {
    super('one-wire', [
      new SelectBoxProperty('sensorAddreses', 'Sensor Addresses', true, () =>
        this.getSensors(),
      ),
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
    await this.dataRecieved(params.sensor_id, tempReading.celcius);
    return tempReading.celcius;
  }
}
