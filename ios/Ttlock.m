#import "Ttlock.h"
#import <TTLockDFU/TTLockDFU.h>
#import <TTLockDFU/TTGatewayDFU.h>
#import <objc/message.h>


#define NOT_NULL_STRING(string) (string ?: @"")

#define EVENT_UPGRADE_PROGRESS @"EventUpgradeProgress"



//static bool isAddListenBluetoothState = false;


@implementation Ttlock

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (instancetype)init{
    if (self = [super init]) {
//        __weak Ttlock *weakSelf = self;
        [TTLock setupBluetooth:^(TTBluetoothState state) {
//            if (isAddListenBluetoothState) {
//                [weakSelf sendEventWithName:EVENT_BLUETOOTH_STATE body:@(state)];
//            }
        }];
    }
    return self;
}

//暴露出支持的事件
- (NSArray<NSString *> *)supportedEvents
{
  return @[EVENT_UPGRADE_PROGRESS];
}


RCT_EXPORT_METHOD(startLockDfuByClient:(NSString *)clientId accessToken:(NSString *)accessToken lockId: (NSNumber *)lockId lockData:(NSString *) lockData  fail:(RCTResponseSenderBlock)fail)
{
    [[TTLockDFU shareInstance] startDfuWithClientId:clientId accessToken:accessToken lockId:lockId lockData:lockData successBlock:^(UpgradeOpration type, NSInteger process) {
        [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
    } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
            fail(@[@(code)]);
    }];
}

RCT_EXPORT_METHOD(startLockDfuByFirmwarePackage:(NSString *)firmwarePackage lockData:(NSString *) lockData  fail:(RCTResponseSenderBlock)fail)
{
//    [[TTLockDFU shareInstance] startDfuWithFirmwarePackage:firmwarePackage lockData:lockData successBlock:^(UpgradeOpration type, NSInteger process) {
//        [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
//    } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
//            fail(@[@(code)]);
//    }];
    
    [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(UpgradeOprationPreparing),@(10)]];
    [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(UpgradeOprationUpgrading),@(50)]];
    [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(UpgradeOprationSuccess),@(100)]];
    
    fail(@[@(UpgradeErrorCodeNetFail)]);
}


RCT_EXPORT_METHOD(stopLockUpgrade)
{
    [[TTLockDFU shareInstance] endUpgrade];
}


RCT_EXPORT_METHOD(restartLockUpgrade)
{
    [[TTLockDFU shareInstance] retry];
}


RCT_EXPORT_METHOD(startGatewayDfuByClient:(NSString *)clientId accessToken:(NSString *)accessToken gatewayId: (NSNumber *)gatewayId gatewayMac:(NSString *) gatewayMac  fail:(RCTResponseSenderBlock)fail)
{
    [[TTGatewayDFU shareInstance] startDfuWithClientId:clientId accessToken:accessToken gatewayId:gatewayId gatewayMac:gatewayMac successBlock:^(UpgradeOpration type, NSInteger process) {
        [self sendEventWithName:EVENT_UPGRADE_PROGRESS body:@[@(type),@(process)]];
    } failBlock:^(UpgradeOpration type, UpgradeErrorCode code) {
        fail(@[@(code)]);
    }];
}


RCT_EXPORT_METHOD(restartGatewayUpgradeByNet)
{
    [[TTGatewayDFU shareInstance] retryEnterUpgradeModebyNet];
}


RCT_EXPORT_METHOD(restartGatewayUpgradeByBluetooth)
{
    [[TTGatewayDFU shareInstance] retryEnterUpgradeModebyBluetooth];
}

RCT_EXPORT_METHOD(endGatewayUpgrade)
{
    [[TTGatewayDFU shareInstance] endUpgrade];
}

@end
