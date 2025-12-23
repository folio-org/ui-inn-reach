import user from '@folio/jest-config-stripes/testing-library/user-event';
import { translationsProperties, renderWithIntl } from '../../../../../../test/jest/helpers';
import ResetButton from './ResetButton';

const renderResetButton = (props = {}) => (renderWithIntl(
  <ResetButton
    {...props}
  />,
  translationsProperties
));

describe('ResetButton', () => {
  it('should call reset prop when button is pressed', async () => {
    const reset = jest.fn();
    const { getByTestId } = renderResetButton({ reset });

    await user.click(getByTestId('reset-button'));
    expect(reset).toHaveBeenCalled();
  });

  it('should be disabled when prop is truthy', () => {
    const reset = jest.fn();
    const { getByTestId } = renderResetButton({ reset, disabled: true });

    expect(getByTestId('reset-button').disabled).toBeTruthy();
  });
});
