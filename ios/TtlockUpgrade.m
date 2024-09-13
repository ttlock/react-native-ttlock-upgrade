#import "TtlockUpgrade.h"
#import <TTLockDFUOnPremise/TTLockDFUOnPremise.h>
#import <TTLockDFUOnPremise/TTGatewayDFU.h>
#import <TTLockOnPremise/TTLock.h>
#import <TTLockOnPremise/TTGateway.h>
#import <objc/message.h>

#define NOT_NULL_STRING(string) (string ?: @"")

#define EVENT_UPGRADE_PROGRESS @"EventUpgradeProgress"


@implementation TtlockUpgrade

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}



//暴露出支持的事件
- (NSArray<NSString *> *)supportedEvents
{
  return @[EVENT_UPGRADE_PROGRESS];
}

//RN端错误码参考
//enum TtUpgradeError {
//  PeripheralPoweredOff  = 1,
//    ConnectTimeout = 2,
//    NetFail = 3,
//    NoNeedUpgrade = 4,
//    UnknownUpgradeVersion = 5,
//    EnterUpgradeState = 6,
//    UpgradeLockFail = 7,
//    UpgradeOprationPreparingError = 8,
//    UpgradeOprationGetSpecialValueError = 9,
//    UpgradeFail = 10,
//    UpgradeOprationSetLockTimeError = 11
//}

RCT_EXPORT_METHOD(startLockDfuByFirmwarePackage:(NSString *)firmwarePackage lockData:(NSString *) lockData success:(RCTResponseSenderBlock)success  fail:(RCTResponseSenderBlock)fail)
{
    [[TTLockDFUOnPremise shareInstance] startDfuWithFirmwarePackage:firmwarePackage lockData:lockData successBlock:^(UpgradeOpration type, NSInteger process) {
        if (type == UpgradeOprationSuccess) {
            [TTLock getLockFeatureValueWithLockData:lockData success:^(NSString *newLockData) {
                success(@[newLockData]);
            } failure:^(TTError errorCode, NSString *errorMsg) {
                success(@[lockData]);
            }];
        }else{
            [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
        }
    } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
        fail(@[@(code)]);
    }];
}


RCT_EXPORT_METHOD(stopLockUpgrade)
{
    [[TTLockDFUOnPremise shareInstance] endUpgrade];
}



RCT_EXPORT_METHOD(startGatewayDfuByFirmwarePackage:(NSString *)firmwarePackage gatewayMac:(NSString *) gatewayMac success:(RCTResponseSenderBlock)success  fail:(RCTResponseSenderBlock)fail)
{
    [TTGateway connectGatewayWithGatewayMac:gatewayMac block:^(TTGatewayConnectStatus connectStatus) {
        if (connectStatus == TTGatewayConnectSuccess) {
            [TTGateway upgradeGatewayWithGatewayMac:gatewayMac block:^(TTGatewayStatus status) {
                if (status == TTGatewaySuccess) {
                    [[TTGatewayDFU shareInstance] startDfuWithFirmwarePackage:firmwarePackage gatewayMac:gatewayMac successBlock:^(UpgradeOpration type, NSInteger process) {
                        if (type == UpgradeOprationSuccess) {
                            success(@[]);
                        }else{
                            [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
                        }
                    } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
                            fail(@[@(code)]);
                    }];
                }else{
                    fail(@[@(6)]);
                }
            }];
        }else{
            fail(@[@(2)]);
        }
    }];
}


RCT_EXPORT_METHOD(endGatewayUpgrade)
{
    [[TTGatewayDFU shareInstance] endUpgrade];
}

@end

