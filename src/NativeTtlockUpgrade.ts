import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {


startLockDfuByFirmwarePackage(firmwarePackage: string, lockData: string, success: null | ((newLockData: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;


stopLockUpgrade(): void;


startGatewayDfuByFirmwarePackage(firmwarePackage: string, gatewayMac: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;


 stopGatewayUpgrade(): void;

}

export default TurboModuleRegistry.getEnforcing<Spec>('TtlockUpgrade');
