package com.reactnativettlockupgrade;

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
import com.ttlock.bl.sdk.api.TTLockClient;
import com.ttlock.bl.sdk.callback.GetLockSystemInfoCallback;
import com.ttlock.bl.sdk.entity.DeviceInfo;
import com.ttlock.bl.sdk.entity.LockError;
import com.ttlock.bl.sdk.util.EncryptionUtil;
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
  private String cacheGatewayMac;

  private Callback cacheSuccessCallback;
  private Callback cacheFailCallback;

  public TtlockUpgradeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "TtlockUpgrade";
  }

  @ReactMethod
  public void startLockDfuByClient(String clientId, String accessToken, int lockId, String lockData, Callback successCallback, Callback fail) {
    Log.e("TtlockUpgrade", "startLockDfuByClient called");
    Log.e("TtlockUpgrade", "clientId = " + clientId);
    Log.e("TtlockUpgrade", "accessToken = " + (accessToken != null ? accessToken.substring(0, Math.min(20, accessToken.length())) + "..." : "null"));
    Log.e("TtlockUpgrade", "lockId = " + lockId);
    Log.e("TtlockUpgrade", "lockData length = " + (lockData != null ? lockData.length() : 0));
    
    // 参数验证
    if (clientId == null || clientId.isEmpty()) {
      Log.e("TtlockUpgrade", "clientId is null or empty");
      fail.invoke(TTUpgradeError.NetFail);
      return;
    }
    if (accessToken == null || accessToken.isEmpty()) {
      Log.e("TtlockUpgrade", "accessToken is null or empty");
      fail.invoke(TTUpgradeError.NetFail);
      return;
    }
    if (lockData == null || lockData.isEmpty()) {
      Log.e("TtlockUpgrade", "lockData is null or empty");
      fail.invoke(TTUpgradeError.UpgradeFail);
      return;
    }
    
    PermissionUtils.doWithScanPermission(getCurrentActivity(), success -> {
      Log.e("TtlockUpgrade", "Permission check result = " + success);
      if (success) {
        Log.e("TtlockUpgrade", "Parsing lockData...");
        LockData lockParam = EncryptionUtil.parseLockData(lockData);
        if (lockParam == null) {
          Log.e("TtlockUpgrade", "parseLockData failed, lockParam is null");
          fail.invoke(TTUpgradeError.UpgradeFail);
          return;
        }
        Log.e("TtlockUpgrade", "parseLockData success, lockMac = " + lockParam.lockMac);
        Log.e("TtlockUpgrade", "Starting DFU...");
        Log.e("TtlockUpgrade", "Before startDfu - clientId: " + (clientId != null ? clientId : "null"));
        Log.e("TtlockUpgrade", "Before startDfu - accessToken: " + (accessToken != null ? accessToken.substring(0, Math.min(20, accessToken.length())) + "..." : "null"));
        Log.e("TtlockUpgrade", "Before startDfu - lockId: " + lockId);
        Log.e("TtlockUpgrade", "Before startDfu - lockData length: " + (lockData != null ? lockData.length() : 0));
        Log.e("TtlockUpgrade", "Before startDfu - lockMac: " + (lockParam.lockMac != null ? lockParam.lockMac : "null"));
        Log.e("TtlockUpgrade", "Before startDfu - reactContext: " + (reactContext != null ? "not null" : "null"));
        LockDfuClient.getDefault().startDfu(reactContext, clientId, accessToken, lockId, lockData, lockParam.lockMac, new DfuCallback() {
          @Override
          public void onDfuSuccess(String deviceAddress) {
            Log.e("TtlockUpgrade", "onDfuSuccess, deviceAddress = " + deviceAddress);
            Log.e("TtlockUpgrade", "Getting lock system info...");
            getLockSysInfo(lockData, successCallback, fail);
          }

          @Override
          public void onStatusChanged(int status) {
            Log.e("TtlockUpgrade", "onStatusChanged, status = " + status);
            int process = 0;
            switch (status) {
              case TTUpgradeStatus.Preparing:
                process = 0;
                Log.e("TtlockUpgrade", "Status = Preparing");
                break;
              case TTUpgradeStatus.Upgrading:
                process = 0;
                Log.e("TtlockUpgrade", "Status = Upgrading");
                break;
              case TTUpgradeStatus.Recovering:
                process = 100;
                Log.e("TtlockUpgrade", "Status = Recovering");
                break;
              case TTUpgradeStatus.Success:
                process = 100;
                Log.e("TtlockUpgrade", "Status = Success");
                break;
            }
            progressCallback(status, process);
          }

          @Override
          public void onDfuAborted(String deviceAddress) {
            Log.e("TtlockUpgrade", "onDfuAborted, deviceAddress = " + deviceAddress);
            fail.invoke(TTUpgradeError.UpgradeFail);
          }

          @Override
          public void onProgressChanged(String deviceAddress, int percent, float speed, float avgSpeed, int currentPart, int partsTotal) {
            Log.e("TtlockUpgrade", "onProgressChanged, percent = " + percent + ", speed = " + speed + ", currentPart = " + currentPart + "/" + partsTotal);
            progressCallback(TTUpgradeStatus.Upgrading, percent);
          }

          @Override
          public void onError(int errorCode, String errorContent) {
            Log.e("TtlockUpgrade", "onError, errorCode = " + errorCode + ", errorContent = " + errorContent);
            convertErrorCodeCallback(fail, errorCode);
          }
        });
      } else {
        Log.e("TtlockUpgrade", "no scan permission");
      }
    });
  }

  private void getLockSysInfo(String lockData, Callback successCallback, Callback fail) {
    Log.e("TtlockUpgrade", "getLockSysInfo called");
    TTLockClient.getDefault().getLockSystemInfo(lockData, null, new GetLockSystemInfoCallback() {
      @Override
      public void onGetLockSystemInfoSuccess(DeviceInfo deviceInfo) {
        Log.e("TtlockUpgrade", "getLockSysInfo success, new lockData = " + (deviceInfo.lockData != null ? deviceInfo.lockData.substring(0, Math.min(50, deviceInfo.lockData.length())) + "..." : "null"));
        successCallback.invoke(deviceInfo.lockData);
      }

      @Override
      public void onFail(LockError lockError) {
        Log.e("TtlockUpgrade", "getLockSysInfo failed, error = " + lockError);
        fail.invoke(3);
      }
    });
  }

  @ReactMethod
  public void startLockDfuByFirmwarePackage(String firmwarePackage, String lockData, Callback successCallback, Callback fail) {
    PermissionUtils.doWithScanPermission(getCurrentActivity(), success -> {
      if (success) {
        LockData lockParam = EncryptionUtil.parseLockData(lockData);
        LockDfuClient.getDefault().startDfu(reactContext, lockData, lockParam.lockMac, firmwarePackage, new DfuCallback() {
          @Override
          public void onDfuSuccess(String deviceAddress) {
            getLockSysInfo(lockData, successCallback, fail);
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
    Log.e("TtlockUpgrade", "convertErrorCodeCallback, nativeErrorCode = " + nativeErrorCode);
    switch (nativeErrorCode) {
      case 1://固件升级失败
        Log.e("TtlockUpgrade", "Error code 1 - 固件升级失败");
        fail.invoke(TTUpgradeError.UpgradeFail);
        break;
      case 3://蓝牙通信错误
        Log.e("TtlockUpgrade", "Error code 3 - 蓝牙通信错误");
        fail.invoke(TTUpgradeError.ConnectTimeout);
        break;
      case 4://服务器请求错误
        Log.e("TtlockUpgrade", "Error code 4 - 服务器请求错误");
        fail.invoke(TTUpgradeError.NetFail);
        break;
      case 5://网络错误
        Log.e("TtlockUpgrade", "Error code 5 - 网络错误");
        fail.invoke(TTUpgradeError.NetFail);
        break;
      default:
        Log.e("TtlockUpgrade", "Unknown error code = " + nativeErrorCode);
        fail.invoke(TTUpgradeError.UpgradeFail);
        break;
    }
  }

  private void progressCallback(int status, int progress) {
    Log.e("TtlockUpgrade", "progressCallback, status = " + status + ", progress = " + progress);
    WritableArray writableArray = Arguments.createArray();
    writableArray.pushInt(status);
    writableArray.pushInt(progress);
    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(TTLockEvent.EventUpgradeProgress, writableArray);
  }

  @ReactMethod
  public void startGatewayDfuByType(int type, String clientId, String accessToken,int gatewayId, String gatewayMac, Callback successCallback, Callback fail) {
    cacheSuccessCallback = successCallback;
    cacheFailCallback = fail;
    PermissionUtils.doWithScanPermission(getCurrentActivity(), success -> {
      if (success) {
        if (!gatewayMac.equals(cacheGatewayMac)) {
          cacheGatewayMac = gatewayMac;
          GatewayDfuClient.getDefault().startDfu(reactContext, clientId, accessToken, gatewayId, gatewayMac, new com.ttlock.bl.sdk.gateway.callback.DfuCallback() {
            @Override
            public void onDfuSuccess(String deviceAddress) {
              cacheGatewayMac = "";
              cacheSuccessCallback.invoke();
            }

            @Override
            public void onDfuAborted(String deviceAddress) {
              cacheFailCallback.invoke(TTUpgradeError.UpgradeFail);
            }

            @Override
            public void onProgressChanged(String deviceAddress, int percent, float speed, float avgSpeed, int currentPart, int partsTotal) {
              progressCallback(TTUpgradeStatus.Upgrading, percent);
            }

            @Override
            public void onError() {
              cacheFailCallback.invoke(TTUpgradeError.UpgradeFail);
            }
          });
        } else {//相当于重试
          switch (type) {
            case 0://net
              GatewayDfuClient.getDefault().retryEnterDfuModeByNet();
              break;
            case 1://bluetooth
              GatewayDfuClient.getDefault().retryEnterDfuModeByBle();
              break;
          }
        }
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
