import React, { useLayoutEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Text from '../../../component-library/components/Texts/Text';
import {
  TextColor,
  TextVariant,
} from '../../../component-library/components/Texts/Text/Text.types';
import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { strings } from '../../../../locales/i18n';
import { getOnboardingNavbarOptions } from '../../UI/Navbar';
import { useTheme } from '../../../util/theme';
import styles from './index.styles';
import Button, {
  ButtonVariants,
  ButtonSize,
  ButtonWidthTypes,
} from '../../../component-library/components/Buttons/Button';
import Icon, {
  IconName,
  IconSize,
} from '../../../component-library/components/Icons/Icon';
import { MetaMetricsEvents } from '../../../core/Analytics/MetaMetrics.events';
import { PREVIOUS_SCREEN } from '../../../constants/navigation';
import { MetricsEventBuilder } from '../../../core/Analytics/MetricsEventBuilder';
import trackOnboarding from '../../../util/metrics/TrackOnboarding/trackOnboarding';
import { IMetaMetricsEvent } from '../../../core/Analytics/MetaMetrics.types';

import AccountStatusImg from '../../../images/already_exist.png';

interface AccountStatusProps {
  type?: 'found' | 'not_exist';
}

interface AccountRouteParams {
  accountName?: string;
  oauthLoginSuccess?: boolean;
}

const AccountStatus = ({ type = 'not_exist' }: AccountStatusProps) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  const accountName = (route.params as AccountRouteParams)?.accountName;
  const oauthLoginSuccess = (route.params as AccountRouteParams)
    ?.oauthLoginSuccess;

  // check for small screen size
  const isSmallScreen = Dimensions.get('window').width < 375;
  useLayoutEffect(() => {
    const marginLeft = 16;
    const headerLeft = () => (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon
          name={IconName.ArrowLeft}
          size={IconSize.Lg}
          color={colors.text.default}
          style={{ marginLeft }}
        />
      </TouchableOpacity>
    );

    const headerRight = () => <View />;

    navigation.setOptions(
      getOnboardingNavbarOptions(
        route,
        {
          headerLeft,
          headerRight,
        },
        colors,
        false,
      ),
    );
  }, [navigation, colors, route]);

  const track = (event: IMetaMetricsEvent) => {
    trackOnboarding(MetricsEventBuilder.createEventBuilder(event).build());
  };

  const navigateNextScreen = (
    targetRoute: string,
    previousScreen: string,
    metricEvent: string,
  ) => {
    navigation.dispatch(
      StackActions.replace(targetRoute, {
        [PREVIOUS_SCREEN]: previousScreen,
        oauthLoginSuccess,
      }),
    );
    track(
      metricEvent === 'import'
        ? MetaMetricsEvents.WALLET_IMPORT_STARTED
        : MetaMetricsEvents.WALLET_SETUP_STARTED,
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text variant={TextVariant.DisplayMD}>
            {type === 'found'
              ? strings('account_status.account_already_exists')
              : strings('account_status.account_not_found')}
          </Text>
          <Image
            source={AccountStatusImg}
            resizeMethod={'auto'}
            style={styles.walletReadyImage}
          />
          <View style={styles.descriptionWrapper}>
            <Text variant={TextVariant.BodyMD} color={TextColor.Alternative}>
              {type === 'found'
                ? strings('account_status.account_already_exists_description', {
                    accountName,
                  })
                : strings('account_status.account_not_found_description', {
                    accountName,
                  })}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View>
        <Button
          variant={ButtonVariants.Primary}
          size={isSmallScreen ? ButtonSize.Md : ButtonSize.Lg}
          width={ButtonWidthTypes.Full}
          onPress={() => {
            if (type === 'found') {
              navigateNextScreen('Rehydrate', 'Onboarding', 'import');
            } else {
              navigateNextScreen('ChoosePassword', 'Onboarding', 'create');
            }
          }}
          label={
            type === 'found'
              ? strings('account_status.log_in')
              : strings('account_status.create_new_wallet')
          }
        />
        <Button
          variant={ButtonVariants.Secondary}
          size={isSmallScreen ? ButtonSize.Md : ButtonSize.Lg}
          width={ButtonWidthTypes.Full}
          onPress={() => {
            navigation.goBack();
          }}
          label={strings('account_status.use_different_login_method')}
          style={styles.secondaryButton}
        />
      </View>
    </View>
  );
};

export default AccountStatus;
