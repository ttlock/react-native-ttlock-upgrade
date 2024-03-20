import {
  NativeModules,
  NativeEventEmitter,
} from 'react-native';



const EventUpgradeProgress: string = 'EventUpgradeProgress'
const ttlockModule = NativeModules.Ttlock;
const ttlockEventEmitter = new NativeEventEmitter(ttlockModule);

const subscriptionMap = new Map();


function progressCallback(progress: (status: TtUpgradeProgress, percentage: number) => void){
  let subscription = subscriptionMap.get(EventUpgradeProgress)
  if (subscription !== undefined) {
    subscription.remove()
  }
  subscription = ttlockEventEmitter.addListener(EventUpgradeProgress, (data: any[]) => {
    progress(data[0] as TtUpgradeProgress, data[1]);
  });
  subscriptionMap.set(EventUpgradeProgress, subscription);
}

// function failCallback(fail: (error:TtUpgradeError) => void){
//   fail(console.error();
//   )
// }

class TtGatewayDFU {

  static startUpgradeByClient(clientId: string, accessToken: string, gatewayId: number, gatewayMac: string, progress: (status: TtUpgradeProgress, percentage: number) => void, fail: (error:TtUpgradeError) => void) {
    progressCallback(progress)
    ttlockModule.startGatewayDfuByClient(clientId,accessToken,gatewayId, gatewayMac, fail);
  }

  static stopUpgrade(){
    ttlockModule.endGatewayUpgrade();
  }

  static restartUpgradeByNet(){
    ttlockModule.restartGatewayUpgradeByNet();
  }

  static restartUpgradeByBluetooth(){
    ttlockModule.restartGatewayUpgradeByBluetooth();
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

  static restartUpgrade(){
    ttlockModule.restartLockUpgrade();
  }

}

enum TtUpgradeProgress {
  Preparing = 1,
  Upgrading,
  Recovering,
  Success,
}


enum TtUpgradeError {
  PeripheralPoweredOff  = 1,
    ConnectTimeout,
    NetFail,
    NoNeedUpgrade,
    UnknownUpgradeVersion,
    EnterUpgradeState ,
    UpgradeLockFail,
    UpgradeOprationPreparingError,
    UpgradeOprationGetSpecialValueError,
    UpgradeFail,
    UpgradeOprationSetLockTimeError
}






export { TtlockDFU, TtGatewayDFU, TtUpgradeProgress, TtUpgradeError }