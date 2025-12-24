import * as React from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import {TtGatewayDFU, TtlockDFU, TtUpgradeError, TtUpgradeProgress, TtUpgradeType} from 'react-native-ttlock-upgrade'

// 锁的常量配置
const CLIENT_ID = "439063e312444f1f85050a52efcecd2e";
const ACCESS_TOKEN = "23971533d33b03fea3389870f8195223";
const LOCK_DATA = "9J+QyZ/5W4s2khQb9vZ3kbz1t/jTXxnwu5rEepqg3jmkA5IaHZC2RkfZ12LfabtugDBcW0NFe+vU8fIrlByCZT+bA5eYUuQpbFPcAnWsIT8Fc5zei8FPiyxt63KS27aQyE22yYodT+BuJUcRBh15GaZVCOF7mSUZeKhV1wQLa5H5LPaEfwi2nIXF6lF3M9+PYvoxGk8Li7w1yWnpE+1OKSC86KrsJgkiYLxlQWRONoJkCfzOyhZMV5lgJ4bFE4KHKgDEb0v2fra2l3LzSjyid+YjYctZqW51Oy0r+RFmNf7n79BZpgx1u1SutCb1TW9Etqay3M0sYTW4Zmckd7Na2+4rbOSIWWT9diukznAVg+OdXKFaac9cTllGYKK219JamZ1iffBGHraggn4cJ4EErV82a443OCJ9I9V38PdDM/nnaWP+kbl9sH84zJbW/iHCqfolMOgLfVa5IAOq0/xMzh7FDVbll8xDpkMjKEtsHPhfas9vTYw4Ugj/3yWiudCUK3L3gcidkUrfAwGTE5VSDn+Qcmdb4MMZ0Sb92Hvl7NhRpaczQ6FPTEBK+Qk4Azw59Dhr9Uf6Fk371V9T532tDA3Iy+bu6O/4Oedxeha+CeywnUyFBI/YhjlbA9fPN3BRqzU1ftqj/YXTOMNJ8+YQkc1XJ/6hPQgE3Glk8fPFtyyYXmxWoKAL/WGz9TAVwLyO5ZVMQFEN1aTmqRaWexfTn8AmwiIM5Xbq/cTxQTeWl6XARMhnh4LL3rfxSvNHMVVhmoGZ9XCHjSj/odBZM6cbjCWrk4M3F8MLlNIZQQkXdTjtu8AConvx/03oDnFm+cDyjg18I8mOhDFC940wo/mORfSccctOzl6SmqLygsOwdBPMWfagOuikMjXSIWvj2J5IHaYt979wxeS198fjBVEuXJRtc+iqK7Dcov95bhVg0rtAFySzHPn/V7Fwi/0TDlDi1AZ74QUnNO14gByVpAlufovDcXgtiTUdtWAT38qCjI3wHWIJuHoAo7axgI7e53IL9anSojJKY8L3V3ot/ochib7hiHBmrND7ow3PRMpsuLMyT5k/AdeJGPTTAEbszL3fEjDOHY21uK/KotZ0WAX7g/PtkbDQy0+uKEHG0zZcpAdPeAo7xvdhbfmC5TVpzVh8aWDePfUpGspeWetGc7JngNwsK836S+YdBKwCJ4agBQL4eVWSnEPN3x3cXVlGzOsiMVKjJp2gMgnDPmByPGOb0EueIlGrNXKNdtaASW7uH+bAJDQCuzk=";
const LOCK_ID = 20297995; // 锁ID，根据实际情况修改
const GATEWAY_MAC = "gatewayMac"; // 网关MAC地址，根据实际情况修改
const GATEWAY_ID = 1; // 网关ID，根据实际情况修改

const MainPage = ({ navigation }: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={() => {
          // TtlockDFU.startUpgradeByFirmwarePackage("eee", 'eeee', (status:TtUpgradeProgress, percentage: number) => {
          //   console.log('返回数据:' +  status + "    进度：" + percentage)
          // }, (error: TtUpgradeError) => {
          //   console.log("错误码：" + error)
          // })

          TtlockDFU.startUpgradeByClient(CLIENT_ID, ACCESS_TOKEN, LOCK_ID, LOCK_DATA, (status:TtUpgradeProgress, percentage: number) => {
            console.log('返回数据:' +  status + "    进度：" + percentage)
          }, (newLockData: string) => {
            console.log("upgrade success: " + newLockData)
        }, (error: TtUpgradeError) => {
            console.log("错误码：" + error)
          });
        }}>
        <Text style={styles.touchButtonText}>Lock</Text>
      </TouchableHighlight>



      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={() => {
          TtGatewayDFU.startUpgrade(TtUpgradeType.Bluetooth, CLIENT_ID, ACCESS_TOKEN, GATEWAY_ID, GATEWAY_MAC, (status:TtUpgradeProgress, percentage: number) => {
            console.log('返回数据:' +  status + "    进度：" + percentage)
          }, () => {
            console.log("upgrade success")
        }, (error: TtUpgradeError) => {
            console.log("错误码：" + error)
          })
        }}>
        <Text style={styles.touchButtonText}>Gateway</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "column",
    justifyContent: "center"
  },


  touchButton: {
    backgroundColor: "white",
    marginTop: 80,
    marginHorizontal: 100,
    height: 150,

    borderRadius: 20,
    borderColor: "lightgray",
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  touchButtonText: {
    color: '#333333',
    textAlign: 'center',
  }
});

export default MainPage;
