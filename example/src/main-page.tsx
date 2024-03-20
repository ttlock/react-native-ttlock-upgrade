import * as React from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import { TtUpgradeError, TtUpgradeProgress, TtlockDFU } from 'react-native-ttlock-upgrade';


const MainPage = ({ navigation }: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={() => {
          TtlockDFU.startUpgradeByFirmwarePackage("eee", 'eeee', (status:TtUpgradeProgress, percentage: number) => {
            console.log('返回数据:' +  status + "    进度：" + percentage)
          }, (error: TtUpgradeError) => {
            console.log("错误码：" + error)
          })
        }}>
        <Text style={styles.touchButtonText}>Lock</Text>
      </TouchableHighlight>

     

      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={() => {
         
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