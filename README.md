# react-native-ttlock-upgrade



##### Developers Email && Quick Response

ttlock-developers-email-list@googlegroups.com

## Installation

```sh
yarn add react-native-ttlock-upgrade
```

##  Upgrade



#### Lock

```js
import {TtlockDFU, TtUpgradeError, TtUpgradeProgress} from 'react-native-ttlock-upgrade'

//Upgrade the lock and recover the data inside the lock
TtlockDFU.startUpgradeByClient("clientId", "accessToken", 1, "lockData", (progress: TtUpgradeProgress, percentage: number) => {
        console.log("status：" + progress + "    percentage：" + percentage)
    }, (newLockData: string) => {
        console.log("upgrade success: " + newLockData)
    }, (error: TtUpgradeError) => {
        console.log("fail: " + error)
})  

//Only the upgrade lock will be restored to factory Settings after the upgrade is complete
TtlockDFU.startUpgradeByFirmwarePackage("packageUrl", "lockData", (progress: TtUpgradeProgress, percentage: number) => {
       console.log("status：" + progress + "    percentage：" + percentage)
    }, (newLockData: string) => {
        console.log("upgrade success: " + newLockData)
    }, (error: TtUpgradeError) => {
        console.log("fail: " + error)
})

//Stop Upgrade
TtlockDFU.stopUpgrade()


```





#### Gateway

```js
import {TtGatewayDFU, TtlockDFU, TtUpgradeError, TtUpgradeProgress, TtUpgradeType} from 'react-native-ttlock-upgrade'

//Upgrade the gateway 
 TtGatewayDFU.startUpgrade(TtUpgradeType.Net, "clientId", 'token',1, "gatewayMac", (status:TtUpgradeProgress, percentage:   number) => {
        console.log("status：" + progress + "    percentage：" + percentage)
    }, () => {
        console.log("upgrade success")
    }, (error: TtUpgradeError) => {
        console.log("fail: " + error)
    }
)


//Stop Upgrade
TtGatewayDFU.stopUpgrade()

```

 



