import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {


startLockDfuByClient(clientId: string, accessToken: string, lockId: number, lockData: string, success: null | ((newLockData: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;


startLockDfuByFirmwarePackage(firmwarePackage: string, lockData: string, success: null | ((newLockData: string) => void), fail: null | ((errorCode: number, description: string) => void)): void;


stopLockUpgrade(): void;


startGatewayDfuByType(type: number, clientId: string, accessToken: string, gatewayId: number, gatewayMac: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)): void;


 stopGatewayUpgrade(): void;

}

export default TurboModuleRegistry.getEnforcing<Spec>('TtlockUpgrade');
