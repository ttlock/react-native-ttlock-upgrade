package com.reactnativettlock.model;

import com.ttlock.bl.sdk.entity.LockError;

/**
 * Created by TTLock on 2020/9/10.
 */
public class TTLockErrorConverter {

    public static final int reseted = 0;
    public static final int fail = 18;
    public static final int notSupportModifyPasscode = 31;
    public static final int bluetoothOff = 32;
    public static final int bluetoothConnectTimeount = 33;
    public static final int bluetoothDisconnection = 34;
    public static final int lockIsBusy = 35;
    public static final int invalidLockData = 36;
    public static final int invalidParameter = 37;

    public static int native2RN(LockError error) {
        int errorCode = error.getIntErrorCode();
        if (errorCode >= 1 && errorCode <= 0x08) {
            return errorCode;
        }

        if (errorCode >= 0xa && errorCode <= 0x1f) {
            return errorCode - 1;
        }

        if (errorCode >= 0x20) {//31~37 ios customized error code
            switch (error) {
                case Failed:
                case AES_PARSE_ERROR:
                    return fail;
                case LOCK_CONNECT_FAIL:
                    return bluetoothConnectTimeount;
                case LOCK_IS_BUSY:
                    return lockIsBusy;
                case DATA_FORMAT_ERROR:
                    return invalidParameter;
                case KEY_INVALID:
                    return reseted;
            }
        }

        return fail;
    }
}
