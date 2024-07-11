//
//  TTGatewayDFU.h
//  TTLockSourceCodeDemo
//
//  Created by 王娟娟 on 2019/4/27.
//  Copyright © 2019 Sciener. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TTDFUMacros.h"

@interface TTGatewayDFU : NSObject

+ (instancetype _Nonnull  )shareInstance;

/* only do dfu operation
 
Before calling this interface,  please set the gateway into upgrade mode first.
You can upgrade the gateway by the following two ways.
 
1 By net
 call server "/gateway/setUpgradeMode"
 
2 By Bluetooth
 call sdk below method
 [TTGateway upgradeGatewayWithGatewayMac:dfuModel.gatewayMac block:^(TTGatewayStatus status) {
     if (status == TTGatewaySuccess) {
       [[TTGatewayDFU shareInstance] startDfuWithFirmwarePackage...];
     }
   }];
 */

- (void)startDfuWithFirmwarePackage:(NSString *_Nonnull)firmwarePackage
                         gatewayMac:(NSString *_Nonnull)gatewayMac
                       successBlock:(TTLockDFUSuccessBlock _Nullable )sblock
                          failBlock:(TTLockDFUFailBlock _Nullable )fblock;

- (void)endUpgrade;


@end

