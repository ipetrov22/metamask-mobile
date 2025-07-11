import { useCallback } from 'react';
import StorageWrapper from '../../../store/storage-wrapper';
import Logger from '../../../util/Logger';
import { EXISTING_USER } from '../../../constants/storage';
import { Authentication } from '../../../core';
import AUTHENTICATION_TYPE from '../../../constants/userProperties';
import { clearAllVaultBackups } from '../../../core/BackupVault';
import { useMetrics } from '../useMetrics';
import Engine from '../../../core/Engine';

const useDeleteWallet = () => {
  const metrics = useMetrics();
  const resetWalletState = useCallback(async () => {
    try {
      await Authentication.newWalletAndKeychain(`${Date.now()}`, {
        currentAuthType: AUTHENTICATION_TYPE.UNKNOWN,
      });

      Engine.context.SeedlessOnboardingController.clearState();

      await clearAllVaultBackups();
      await Authentication.lockApp();
      // TODO: Replace "any" with type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMsg = `Failed to createNewVaultAndKeychain: ${error}`;
      Logger.log(error, errorMsg);
    }
  }, []);

  const deleteUser = async () => {
    try {
      await StorageWrapper.removeItem(EXISTING_USER);
      await metrics.createDataDeletionTask();
      // TODO: Replace "any" with type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMsg = `Failed to remove key: ${EXISTING_USER} from MMKV`;
      Logger.log(error, errorMsg);
    }
  };

  return [resetWalletState, deleteUser];
};

export default useDeleteWallet;
