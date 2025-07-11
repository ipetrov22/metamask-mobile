import {
  NetworkEducationModalSelectorsIDs,
  NetworkEducationModalSelectorsText,
} from '../../selectors/Network/NetworkEducationModal.selectors';
import Matchers from '../../framework/Matchers.ts';
import Gestures from '../../framework/Gestures.ts';

class NetworkEducationModal {
  get container() {
    return Matchers.getElementByID(NetworkEducationModalSelectorsIDs.CONTAINER);
  }

  get closeButton() {
    return device.getPlatform() === 'ios'
      ? Matchers.getElementByID(NetworkEducationModalSelectorsIDs.CLOSE_BUTTON)
      : Matchers.getElementByLabel(
          NetworkEducationModalSelectorsIDs.CLOSE_BUTTON,
        );
  }

  get addToken() {
    return Matchers.getElementByText(
      NetworkEducationModalSelectorsText.ADD_TOKEN,
    );
  }

  get networkName() {
    return Matchers.getElementByID(
      NetworkEducationModalSelectorsIDs.NETWORK_NAME,
    );
  }

  async tapGotItButton() {
    await Gestures.waitAndTap(this.closeButton, {
      elemDescription: 'Got it button',
    });
  }

  async tapNetworkName() {
    await Gestures.waitAndTap(this.networkName);
    await Gestures.waitAndTap(this.networkName);

  }
}

export default new NetworkEducationModal();
