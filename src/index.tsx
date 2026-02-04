import NativeTTLockUpgrade from './NativeTtlockUpgrade';

import { NativeEventEmitter, NativeModules } from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.TtlockUpgrade);





const EventUpgradeProgress: string = 'EventUpgradeProgress'


const subscriptionMap = new Map();


function removeUpgreadeProgressEvent(){
  let subscription = subscriptionMap.get(EventUpgradeProgress)
  if (subscription !== undefined) {
    subscription.remove()
  }
  return subscription
}

function progressCallback(progress: (status: TtUpgradeProgress, percentage: number) => void){
  let subscription = removeUpgreadeProgressEvent()
  subscription = eventEmitter.addListener(EventUpgradeProgress, (args: any) => {
    if(progress){
      progress(args[0] as TtUpgradeProgress, args[1]);
    }
  });
  subscriptionMap.set(EventUpgradeProgress, subscription);
}


class TtlockDFU {

  static startUpgradeByClient(clientId: string, accessToken: string, lockId: number, lockData: string, progress: (status: TtUpgradeProgress, percentage: number) => void, success: (newLockData: string) => void, fail: (error:TtUpgradeError) => void) {
    progressCallback(progress)
    NativeTTLockUpgrade.startLockDfuByClient(clientId, accessToken, lockId, lockData, success, fail);
  }

  static startUpgradeByFirmwarePackage(firmwarePackage: string, lockData: string, progress: (status: TtUpgradeProgress, percentage: number) => void, success: (newLockData: string) => void, fail: (error:TtUpgradeError) => void) {
    progressCallback(progress)
    NativeTTLockUpgrade.startLockDfuByFirmwarePackage(firmwarePackage, lockData, success, fail);
  }

  static stopUpgrade(){
    NativeTTLockUpgrade.stopLockUpgrade();
  }

}

class TtGatewayDFU {

  static startUpgrade(type: TtUpgradeType, clientId: string, accessToken: string, gatewayId: number, gatewayMac: string, progress: (status: TtUpgradeProgress, percentage: number) => void, success: () => void, fail: (error:TtUpgradeError) => void) {
    progressCallback(progress)
    NativeTTLockUpgrade.startGatewayDfuByType(type, clientId,accessToken,gatewayId, gatewayMac, success, fail);
  }

  static stopUpgrade(){
    NativeTTLockUpgrade.stopGatewayUpgrade();
  }
}



enum TtUpgradeProgress {
  Preparing = 1,
  Upgrading = 2,
  Recovering = 3
}

enum TtUpgradeType {
  Net = 0,
  Bluetooth = 1
}


enum TtUpgradeError {
  PeripheralPoweredOff  = 1,
    ConnectTimeout = 2,
    NetFail = 3,
    NoNeedUpgrade = 4,
    UnknownUpgradeVersion = 5,
    EnterUpgradeState = 6,
    UpgradeLockFail = 7,
    UpgradeOprationPreparingError = 8,
    UpgradeOprationGetSpecialValueError = 9,
    UpgradeFail = 10,
    UpgradeOprationSetLockTimeError = 11
}
export { TtlockDFU, TtGatewayDFU, TtUpgradeProgress, TtUpgradeError, TtUpgradeType }
