import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import PrintSlips from './PrintSlips';
import { translationsProperties } from '../../../../../../test/jest/helpers';
import ComponentToPrint from '../../../ComponentToPrint';

jest.mock('../../../ComponentToPrint', () => jest.fn(() => <div>ComponentToPrint</div>));

const templatesContextMock = [{
  'innReachTransaction.patronTypeDescription': 'description',
  'innReachTransaction.centralServerId': 'testServerId',
}];

const templatesMock = {
  'testServerId': '<p>template</p>',
};

const renderPrintSlip = ({
  templatesContext = templatesContextMock,
  templates = templatesMock,
  onBeforePrint,
  onAfterPrint,
} = {}) => {
  return renderWithIntl(
    <PrintSlips
      data-testid="print-slips"
      templatesContext={templatesContext}
      templates={templates}
      onBeforePrint={onBeforePrint}
      onAfterPrint={onAfterPrint}
    >
      Close
    </PrintSlips>,
    translationsProperties,
  );
};

describe('PrintSlips', () => {
  const onBeforePrint = jest.fn();
  const onAfterPrint = jest.fn();
  const commonProps = {
    onBeforePrint,
    onAfterPrint,
  };

  beforeEach(() => {
    ComponentToPrint.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderPrintSlip(commonProps);

    expect(container).toBeVisible();
  });

  it('should show Close button', () => {
    renderPrintSlip(commonProps);
    expect(screen.getByText('Close')).toBeVisible();
  });

  it('should pass template with line break to ComponentToPrint', () => {
    renderPrintSlip(commonProps);
    const templateMockWithBrake = templatesMock.testServerId.concat('</br>');

    expect(ComponentToPrint.mock.calls[0][0].template).toEqual(templateMockWithBrake);
  });

  it('should pass template context to ComponentToPrint', () => {
    renderPrintSlip(commonProps);
    expect(ComponentToPrint.mock.calls[0][0].dataSource).toEqual(templatesContextMock[0]);
  });
});
