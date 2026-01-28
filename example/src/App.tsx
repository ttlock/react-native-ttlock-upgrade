import { Text, View, StyleSheet, Button } from 'react-native';
import { TtlockDFU, TtGatewayDFU, TtUpgradeType } from 'react-native-ttlock-upgrade';



export default function App() {
  return (
    <View style={styles.container}>
      <Button title="Lock Start Upgrade" onPress={() => {
        TtlockDFU.startUpgradeByClient("clientId", "accessToken", 12345, "lockData", (status, percentage) => {
          console.log(`Progress: ${status}, ${percentage}%`);
        }, (newLockData) => {
          console.log(`Upgrade successful: ${newLockData}`);
        }, (error) => {
          console.log(`Upgrade failed: ${error}`);
        });
      }} />
      <Button title="LockStop Upgrade" onPress={() => {
        TtlockDFU.stopUpgrade();
      }} />
      <Button title="Gateway Start Upgrade" onPress={() => {
        TtGatewayDFU.startUpgrade(TtUpgradeType.Bluetooth, "clientId", "accessToken", 12345, "gatewayMac", (status, percentage) => {
          console.log(`Progress: ${status}, ${percentage}%`);
        }, () => {
          console.log("Upgrade successful");
        }, (error) => {
          console.log(`Upgrade failed: ${error}`);
        });
      }} />
      <Button title="Gateway Stop Upgrade" onPress={() => {
        TtGatewayDFU.stopUpgrade();
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
