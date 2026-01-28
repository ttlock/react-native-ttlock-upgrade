package com.ttlockupgrade

import com.facebook.react.bridge.ReactApplicationContext

class TtlockUpgradeModule(reactContext: ReactApplicationContext) :
  NativeTtlockUpgradeSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeTtlockUpgradeSpec.NAME
  }
}
