import React, { useCallback, useState } from 'react';
import { View } from 'react-native';

import { ApproveComponentIDs } from '../../../../../../../e2e/selectors/Confirmation/ConfirmationView.selectors';
import { useStyles } from '../../../../../../component-library/hooks';
import Button, {
  ButtonSize,
  ButtonVariants,
} from '../../../../../../component-library/components/Buttons/Button';
import { strings } from '../../../../../../../locales/i18n';
import Text, {
  TextVariant,
  TextColor,
} from '../../../../../../component-library/components/Texts/Text';
import { ApproveMethod } from '../../../types/approve';
import { SpendingCapInput } from '../../spending-cap-input';
import BottomModal from '../../UI/bottom-modal';
import styleSheet from './edit-spending-cap-modal.styles';

export interface EditSpendingCapProps {
  approveMethod: ApproveMethod;
  balance: string;
  decimals: number;
  spendingCap: string;
  onSpendingCapUpdate: (spendingCap: string) => Promise<void>;
}

export interface ModalProps {
  onClose: () => void;
}

export const EditSpendingCapModal = ({
  approveMethod,
  balance,
  decimals,
  spendingCap,
  onSpendingCapUpdate,
  onClose,
}: EditSpendingCapProps & ModalProps) => {
  const { styles } = useStyles(styleSheet, {});
  const [newSpendingCap, setNewSpendingCap] = useState(spendingCap);
  const [error, setError] = useState<string | boolean>(false);
  const [isDataUpdating, setIsDataUpdating] = useState<boolean>(false);

  const handleCloseModal = useCallback(() => {
    if (!isDataUpdating) {
      onClose();
    }
  }, [onClose, isDataUpdating]);

  return (
    <BottomModal
      avoidKeyboard
      onBackdropPress={handleCloseModal}
      onBackButtonPress={handleCloseModal}
      onSwipeComplete={handleCloseModal}
    >
      <View style={styles.container}>
        <Text variant={TextVariant.BodyLGMedium} style={styles.title}>
          {strings('confirm.simulation.edit_approval_limit_title')}
        </Text>
        <Text
          variant={TextVariant.BodyMD}
          style={styles.description}
          color={TextColor.Alternative}
        >
          {strings('confirm.simulation.edit_approval_limit_description')}
        </Text>
        <SpendingCapInput
          approveMethod={approveMethod}
          initialValue={spendingCap}
          decimals={decimals}
          onChange={(updatedSpendingCap) => {
            setNewSpendingCap(updatedSpendingCap);
          }}
          onErrorChange={(newError) => {
            setError(newError);
          }}
        />

        <Text
          variant={TextVariant.BodyMD}
          style={styles.balanceInfo}
          color={TextColor.Alternative}
        >
          Account balance : {balance}
        </Text>

        <View style={styles.buttonsContainer}>
          <Button
            variant={ButtonVariants.Secondary}
            size={ButtonSize.Lg}
            isDisabled={isDataUpdating}
            style={styles.button}
            label={strings('confirm.simulation.cancel')}
            onPress={handleCloseModal}
          />
          <Button
            variant={ButtonVariants.Primary}
            size={ButtonSize.Lg}
            style={styles.button}
            label={strings('confirm.simulation.save')}
            isDisabled={!!error}
            testID={ApproveComponentIDs.EDIT_SPENDING_CAP_SAVE_BUTTON}
            onPress={async () => {
              setIsDataUpdating(true);
              await onSpendingCapUpdate?.(newSpendingCap);
              onClose();
              setIsDataUpdating(false);
            }}
          />
        </View>
      </View>
    </BottomModal>
  );
};
