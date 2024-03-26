import {
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

const EventUpgradeProgress: string = 'EventUpgradeProgress'
const ttlockModule = NativeModules.TtlockUpgrade;
const ttlockEventEmitter = new NativeEventEmitter(ttlockModule);

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
  subscription = ttlockEventEmitter.addListener(EventUpgradeProgress, (data: any[]) => {
    if(progress){
      progress(data[0] as TtUpgradeProgress, data[1]);
    }
  });
  subscriptionMap.set(EventUpgradeProgress, subscription);
}

// function failCallback(fail: (error:TtUpgradeError) => void){
//   fail(console.error();
//   )
// }

class TtGatewayDFU {

  static startUpgrade(type: TtUpgradeType, clientId: string, accessToken: string, gatewayId: number, gatewayMac: string, progress: (status: TtUpgradeProgress, percentage: number) => void, fail: (error:TtUpgradeError) => void) {
    progressCallback(progress)
    ttlockModule.startGatewayDfuByType(type, clientId,accessToken,gatewayId, gatewayMac, fail);
  }

  static stopUpgrade(){
    ttlockModule.endGatewayUpgrade();
  }
}


class TtlockDFU {

  static startUpgradeByClient(clientId: string, accessToken: string, lockId: number, lockData: string, progress: (status: TtUpgradeProgress, percentage: number) => void, fail: (error:TtUpgradeError) => void) {
    progressCallback(progress)
    ttlockModule.startLockDfuByClient(clientId,accessToken,lockId, lockData, fail);
  }

  static startUpgradeByFirmwarePackage(firmwarePackage: string, lockData: string, progress: (status: TtUpgradeProgress, percentage: number) => void, fail: (error:TtUpgradeError) => void) {
    progressCallback(progress)
    ttlockModule.startLockDfuByFirmwarePackage(firmwarePackage, lockData, fail);
  }

  static stopUpgrade(){
    ttlockModule.stopLockUpgrade();
  }

}

enum TtUpgradeProgress {
  Preparing = 1,
  Upgrading = 2,
  Recovering = 3,
  Success = 4,
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