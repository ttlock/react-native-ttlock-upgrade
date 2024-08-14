package com.reactnativettlockupgrade;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.module.annotations.ReactModule;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reactnativettlockupgrade.model.TTLockEvent;
import com.reactnativettlockupgrade.model.TTUpgradeError;
import com.reactnativettlockupgrade.model.TTUpgradeStatus;
import com.reactnativettlockupgrade.util.PermissionUtils;
import com.ttlock.bl.sdk.api.EncryptionUtil;
import com.ttlock.bl.sdk.api.LockDfuClient;
import com.ttlock.bl.sdk.callback.DfuCallback;
import com.ttlock.bl.sdk.entity.LockData;
import com.ttlock.bl.sdk.gateway.api.GatewayClient;
import com.ttlock.bl.sdk.gateway.api.GatewayDfuClient;
import com.ttlock.bl.sdk.util.GsonUtil;
import com.ttlock.bl.sdk.util.LogUtil;

@ReactModule(name = "TtlockUpgrade")
public class TtlockUpgradeModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;

  public TtlockUpgradeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "TtlockUpgrade";
  }


  @ReactMethod
  public void startLockDfuByFirmwarePackage(String firmwarePackage, String lockData, Callback fail) {
    PermissionUtils.doWithScanPermission(getCurrentActivity(), success -> {
      if (success) {
        LockData lockParam = EncryptionUtil.parseLockData(lockData);
        if (lockParam == null) {
          fail.invoke(TTUpgradeError.UpgradeFail);
          return;
        }
        LockDfuClient.getDefault().startDfu(reactContext, lockData, lockParam.lockMac, firmwarePackage, new DfuCallback() {
          @Override
          public void onDfuSuccess(String deviceAddress) {
            progressCallback(TTUpgradeStatus.Success, 100);
          }

          @Override
          public void onStatusChanged(int status) {
            int process = 0;
            switch (status) {
              case TTUpgradeStatus.Preparing:
                process = 0;
                break;
              case TTUpgradeStatus.Upgrading:
                process = 0;
                break;
              case TTUpgradeStatus.Recovering:
                process = 100;
                break;
              case TTUpgradeStatus.Success:
                process = 100;
                break;
            }
            progressCallback(status, process);
          }

          @Override
          public void onDfuAborted(String deviceAddress) {
            fail.invoke(TTUpgradeError.UpgradeFail);
          }

          @Override
          public void onProgressChanged(String deviceAddress, int percent, float speed, float avgSpeed, int currentPart, int partsTotal) {
            progressCallback(TTUpgradeStatus.Upgrading, percent);
          }

          @Override
          public void onError(int errorCode, String errorContent) {
            convertErrorCodeCallback(fail, errorCode);
          }
        });
      } else {
        LogUtil.d("no scan permission");
      }
    });
  }

  @ReactMethod
  public void stopLockUpgrade() {
      LockDfuClient.getDefault().abortDfu();
  }

  private void convertErrorCodeCallback(Callback fail, int nativeErrorCode) {
    LogUtil.d("nativeErrorCode:" + nativeErrorCode);
    switch (nativeErrorCode) {
      case 1://固件升级失败
        fail.invoke(TTUpgradeError.UpgradeFail);
        break;
      case 3://蓝牙通信错误
        fail.invoke(TTUpgradeError.ConnectTimeout);
        break;
      case 4://服务器请求错误
        fail.invoke(TTUpgradeError.NetFail);
        break;
      case 5://网络错误
        fail.invoke(TTUpgradeError.NetFail);
        break;
    }
  }

  private void progressCallback(int status, int progress) {
    WritableArray writableArray = Arguments.createArray();
    writableArray.pushInt(status);
    writableArray.pushInt(progress);
    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(TTLockEvent.EventUpgradeProgress, writableArray);
  }

  @ReactMethod
  public void startGatewayDfuByFirmwarePackage(String firmwarePackage, String gatewayMac, Callback fail) {
    PermissionUtils.doWithScanPermission(getCurrentActivity(), success -> {
      if (success) {
          GatewayDfuClient.getDefault().startDfu(reactContext, gatewayMac, firmwarePackage, new com.ttlock.bl.sdk.gateway.callback.DfuCallback() {
            @Override
            public void onDfuSuccess(String deviceAddress) {
              progressCallback(TTUpgradeStatus.Success, 100);
            }

            @Override
            public void onDfuAborted(String deviceAddress) {
              fail.invoke(TTUpgradeError.UpgradeFail);
            }

            @Override
            public void onProgressChanged(String deviceAddress, int percent, float speed, float avgSpeed, int currentPart, int partsTotal) {
              progressCallback(TTUpgradeStatus.Upgrading, percent);
            }

            @Override
            public void onError() {
              fail.invoke(TTUpgradeError.UpgradeFail);
            }
          });
      } else {
        LogUtil.d("no scan permission");
      }
    });
  }

  @ReactMethod
  public void endGatewayUpgrade() {
      GatewayDfuClient.getDefault().abortDfu();
  }

}
